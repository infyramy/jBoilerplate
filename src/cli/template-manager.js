#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import logSymbols from 'log-symbols';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { execSync } from 'child_process';

/**
 * Template Manager class for handling template operations
 */
export class TemplateManager {
  constructor() {
    this.templatesPath = path.resolve(process.cwd(), 'templates');
    this.templates = this.loadTemplates();
  }

  /**
   * Load available templates from the templates directory
   * @returns {Object} Object containing template configurations
   */
  loadTemplates() {
    const templates = {};
    const templateDirs = fs.readdirSync(this.templatesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const dir of templateDirs) {
      const configPath = path.join(this.templatesPath, dir, 'template.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        templates[dir] = config;
      }
    }
    
    return templates;
  }

  /**
   * Get a list of available templates
   * @returns {Array} Array of template objects with name and description
   */
  getTemplateChoices() {
    return Object.entries(this.templates).map(([id, template]) => ({
      name: `${template.name} - ${template.description}`,
      value: id,
      short: template.name
    }));
  }

  /**
   * Get template configuration by ID
   * @param {string} templateId - The ID of the template
   * @returns {Object} Template configuration
   */
  getTemplate(templateId) {
    return this.templates[templateId] || this.templates['default'];
  }

  /**
   * Create project from template
   * @param {string} templateId - The ID of the template to use
   * @param {string} projectName - The name of the new project
   * @param {string} destination - The destination directory
   * @param {Object} variables - Variables for template substitution
   * @param {boolean} installDependencies - Whether to install dependencies
   * @returns {Promise<void>}
   */
  async createProject(templateId, projectName, destination, variables, installDependencies = true) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const templatePath = path.join(this.templatesPath, templateId);
    
    // Project creation steps
    const steps = [
      { 
        title: 'Creating project structure',
        task: async () => {
          await this.copyTemplateFiles(templatePath, destination, template.structure.ignore);
        }
      },
      { 
        title: 'Processing template files',
        task: async () => {
          await this.processTemplateVariables(destination, variables);
        }
      }
    ];

    // Add rename step if needed
    if (template.structure.rename) {
      steps.push({
        title: 'Renaming files',
        task: async () => {
          await this.renameFiles(destination, template.structure.rename);
        }
      });
    }

    // Add dependencies installation step if enabled
    if (installDependencies) {
      steps.push({
        title: 'Installing dependencies',
        task: async () => {
          await this.installPackages(destination);
        }
      });
    }

    // Add post-install commands if specified
    if (template.postInstall && template.postInstall.length > 0) {
      steps.push({
        title: 'Running post-install commands',
        task: async () => {
          await this.runPostInstallCommands(destination, template.postInstall);
        }
      });
    }

    // Execute steps with progress indicators
    for (const step of steps) {
      const spinner = ora(`${step.title}...`).start();
      try {
        await step.task();
        spinner.succeed(step.title);
      } catch (error) {
        spinner.fail(`${step.title}: ${error.message}`);
        throw error;
      }
    }

    // Display completion message for template
    console.log(`\n${chalk.green(logSymbols.success)} ${chalk.bold(template.name)} template setup complete!\n`);

    // Return the template used
    return template;
  }

  /**
   * Copy template files to destination
   * @param {string} templatePath - Source template path
   * @param {string} destination - Destination directory
   * @param {Array} ignorePatterns - Patterns to ignore
   * @returns {Promise<void>}
   */
  async copyTemplateFiles(templatePath, destination, ignorePatterns = []) {
    const filter = (src) => {
      const relativePath = path.relative(templatePath, src);
      
      // Skip template.json and preview image
      if (relativePath === 'template.json' || relativePath === 'preview.png') {
        return false;
      }
      
      // Check against ignore patterns
      return !ignorePatterns.some(pattern => {
        if (pattern.endsWith('/**')) {
          const dirPattern = pattern.slice(0, -3);
          return relativePath.startsWith(dirPattern);
        }
        return relativePath === pattern || relativePath.startsWith(`${pattern}/`);
      });
    };
    
    await fs.copy(templatePath, destination, { filter });
  }

  /**
   * Process template variables in files
   * @param {string} destination - Destination directory
   * @param {Object} variables - Variables for substitution
   * @returns {Promise<void>}
   */
  async processTemplateVariables(destination, variables) {
    const textExtensions = ['.js', '.ts', '.vue', '.json', '.html', '.css', '.md', '.txt', '.env'];
    
    const processFile = async (filePath) => {
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(filePath);
        for (const file of files) {
          await processFile(path.join(filePath, file));
        }
      } else if (stat.isFile()) {
        const ext = path.extname(filePath);
        if (textExtensions.includes(ext)) {
          let content = await fs.readFile(filePath, 'utf8');
          
          // Replace template variables
          for (const [key, value] of Object.entries(variables)) {
            const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            content = content.replace(pattern, value);
          }
          
          await fs.writeFile(filePath, content, 'utf8');
        }
      }
    };
    
    await processFile(destination);
  }

  /**
   * Rename files according to template configuration
   * @param {string} destination - Destination directory
   * @param {Object} renameMap - Map of old paths to new paths
   * @returns {Promise<void>}
   */
  async renameFiles(destination, renameMap) {
    for (const [oldPath, newPath] of Object.entries(renameMap)) {
      const srcPath = path.join(destination, oldPath);
      const destPath = path.join(destination, newPath);
      
      if (await fs.pathExists(srcPath)) {
        await fs.move(srcPath, destPath, { overwrite: true });
      }
    }
  }

  /**
   * Install npm packages
   * @param {string} destination - Project directory
   * @returns {Promise<void>}
   */
  async installPackages(destination) {
    return new Promise((resolve, reject) => {
      try {
        // Check if yarn.lock exists in the template
        const hasYarnLock = fs.existsSync(path.join(destination, 'yarn.lock'));
        
        // Choose the appropriate package manager
        const packageManager = hasYarnLock ? 'yarn' : 'npm';
        const installCommand = hasYarnLock ? 'yarn' : 'npm install';
        
        console.log(`\n${chalk.blue(logSymbols.info)} Using ${chalk.cyan(packageManager)} to install dependencies...\n`);
        
        // Execute install command with real-time output
        execSync(installCommand, { 
          cwd: destination, 
          stdio: 'inherit' 
        });
        
        resolve();
      } catch (error) {
        console.log(`\n${chalk.yellow(logSymbols.warning)} Dependencies installation encountered issues.`);
        console.log(`${chalk.yellow(logSymbols.warning)} You can run ${chalk.cyan('npm install')} or ${chalk.cyan('yarn')} manually in your project directory.\n`);
        // We don't reject here to allow the process to continue
        resolve();
      }
    });
  }

  /**
   * Run post-install commands
   * @param {string} destination - Destination directory
   * @param {Array} commands - Commands to run
   * @returns {Promise<void>}
   */
  async runPostInstallCommands(destination, commands) {
    const { default: execa } = await import('execa');
    
    for (const command of commands) {
      const spinner = ora(`Running: ${command}`).start();
      try {
        const [cmd, ...args] = command.split(' ');
        await execa(cmd, args, { cwd: destination, stdio: 'pipe' });
        spinner.succeed(`Command completed: ${command}`);
      } catch (error) {
        spinner.fail(`Command failed: ${command}`);
        console.error(chalk.red(error.stderr || error.message));
      }
    }
  }

  /**
   * Display template preview information
   * @param {string} templateId - The ID of the template
   * @returns {void}
   */
  displayTemplatePreview(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) {
      console.log(chalk.red(`Template ${templateId} not found`));
      return;
    }

    console.log(gradient(['#4f46e5', '#7c3aed'])(figlet.textSync(template.name, { font: 'Slant' })));
    console.log('\n');
    console.log(`${chalk.bold('Description:')} ${template.description}`);
    console.log('\n');
    
    console.log(chalk.bold('Features:'));
    template.features.forEach(feature => {
      console.log(`  ${chalk.green('•')} ${feature}`);
    });
    console.log('\n');
    
    if (template.prerequisites && template.prerequisites.length > 0) {
      console.log(chalk.bold('Prerequisites:'));
      template.prerequisites.forEach(prereq => {
        console.log(`  ${chalk.yellow('•')} ${prereq}`);
      });
      console.log('\n');
    }
    
    if (template.documentation) {
      console.log(`${chalk.bold('Documentation:')} ${chalk.blue(template.documentation)}`);
      console.log('\n');
    }
  }
}

export default new TemplateManager(); 