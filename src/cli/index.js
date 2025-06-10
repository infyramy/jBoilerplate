#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import boxen from 'boxen';
import ora from 'ora';
import gradient from 'gradient-string';
import validateNpmPackageName from 'validate-npm-package-name';
import updateNotifier from 'update-notifier';
import { fileURLToPath } from 'url';
import logSymbols from 'log-symbols';
import cliCursor from 'cli-cursor';
import terminalLink from 'terminal-link';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
import inquirerSearchList from 'inquirer-search-list';
import templateManager from './template-manager.js';

// Register additional inquirer prompts
inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);
inquirer.registerPrompt('search-list', inquirerSearchList);

// Get package.json for version info
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));

// Create program
const program = new Command();

// Check for updates
updateNotifier({ pkg: packageJson }).notify();

// Define a gradient color scheme
const primaryGradient = gradient(['#4f46e5', '#7c3aed', '#2563eb']);
const secondaryGradient = gradient(['#059669', '#0ea5e9']);

// Create ASCII art logo
const logo = `
     ██╗██████╗  ██████╗ ██╗██╗     ███████╗██████╗ ██████╗ ██╗      █████╗ ████████╗███████╗
     ██║██╔══██╗██╔═══██╗██║██║     ██╔════╝██╔══██╗██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝
     ██║██████╔╝██║   ██║██║██║     █████╗  ██████╔╝██████╔╝██║     ███████║   ██║   █████╗  
██   ██║██╔══██╗██║   ██║██║██║     ██╔══╝  ██╔══██╗██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  
╚█████╔╝██████╔╝╚██████╔╝██║███████╗███████╗██║  ██║██║     ███████╗██║  ██║   ██║   ███████╗
 ╚════╝ ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
`;

// Display welcome message
const displayWelcomeMessage = () => {
  console.clear();
  console.log(primaryGradient(logo));
  console.log();
  console.log(
    boxen(
      `${chalk.bold(primaryGradient('jBoilerplate'))} ${chalk.grey(`v${packageJson.version}`)}\n\n` +
      `${chalk.white('A modern Vue 3 boilerplate with TypeScript, Shadcn UI, and more.')}\n\n` +
      `${chalk.dim('Docs:')} ${terminalLink('https://github.com/yourusername/jboilerplate', 'https://github.com/yourusername/jboilerplate')}`,
      {
        padding: 1,
        margin: 1,
        borderColor: 'blue',
        borderStyle: 'round',
        float: 'center',
        title: chalk.bold('Welcome'),
        titleAlignment: 'center',
      }
    )
  );
};

// Format template choices with features list
const formatTemplateChoices = (templates) => {
  return templates.map(template => {
    const features = template.short ? templateManager.getTemplate(template.value).features.slice(0, 3) : [];
    return {
      name: `${chalk.bold(template.name.split(' - ')[0])} ${chalk.grey(features.length ? `(${features.join(', ')}...)` : '')}`,
      value: template.value,
      short: template.short
    };
  });
};

// Configure CLI
program
  .name('jboilerplate')
  .description('Create a new Vue 3 project with jBoilerplate')
  .version(packageJson.version);

program
  .command('create [name]')
  .description('Create a new project')
  .option('-y, --yes', 'Skip all prompts and use default options')
  .option('-t, --template <template>', 'Specify template (default, admin, minimal)')
  .option('--typescript [boolean]', 'Use TypeScript (default: true)')
  .option('--no-install', 'Skip package installation')
  .action(async (name, options) => {
    try {
      displayWelcomeMessage();

      // Hide cursor during the process
      cliCursor.hide();
      
      let projectName = name;
      let templateId = options.template;
      let useTypeScript = options.typescript !== undefined ? options.typescript !== 'false' : true;
      let description = 'A Vue 3 application created with jBoilerplate';
      let author = '';
      let useI18n = true;

      // If not using --yes flag, prompt for options
      if (!options.yes) {
        // Create prompts array
        const prompts = [];
        
        // Project name prompt
        if (!projectName) {
          prompts.push({
            type: 'input',
            name: 'projectName',
            message: `${chalk.blue('?')} ${chalk.bold('What is the name of your project?')}`,
            default: 'my-vue-app',
            validate: (input) => {
              const validation = validateNpmPackageName(input);
              if (!validation.validForNewPackages) {
                return `Invalid package name: ${validation.errors?.join(', ') || 'Unknown error'}`;
              }
              return true;
            },
          });
        }
        
        // Template selection prompt
        if (!templateId) {
          prompts.push({
            type: 'search-list',
            name: 'template',
            message: `${chalk.blue('?')} ${chalk.bold('Select a template:')}`,
            choices: formatTemplateChoices(templateManager.getTemplateChoices()),
            pageSize: 10
          });
        }
        
        // Project description prompt
        prompts.push({
          type: 'input',
          name: 'description',
          message: `${chalk.blue('?')} ${chalk.bold('Project description:')}`,
          default: description
        });
        
        // Author name prompt
        prompts.push({
          type: 'input',
          name: 'author',
          message: `${chalk.blue('?')} ${chalk.bold('Author name:')}`,
          default: author
        });
        
        // TypeScript prompt
        if (options.typescript === undefined) {
          prompts.push({
            type: 'confirm',
            name: 'useTypeScript',
            message: `${chalk.blue('?')} ${chalk.bold('Use TypeScript?')}`,
            default: true
          });
        }
        
        // i18n prompt for minimal template
        if (!templateId || templateId === 'minimal') {
          prompts.push({
            type: 'confirm',
            name: 'useI18n',
            message: `${chalk.blue('?')} ${chalk.bold('Add internationalization (i18n) support?')}`,
            default: true,
            when: (answers) => !templateId || answers.template === 'minimal' || templateId === 'minimal'
          });
        }
        
        // Show prompts
        if (prompts.length > 0) {
          const answers = await inquirer.prompt(prompts);
          
          // Set values from answers
          projectName = projectName || answers.projectName;
          templateId = templateId || answers.template;
          description = answers.description;
          author = answers.author;
          useTypeScript = answers.useTypeScript !== undefined ? answers.useTypeScript : useTypeScript;
          useI18n = answers.useI18n !== undefined ? answers.useI18n : useI18n;
        }
      } else if (!projectName) {
        // If --yes flag is used but no project name is provided, use default
        projectName = 'my-vue-app';
      }
      
      // Get template configuration
      const template = templateManager.getTemplate(templateId || 'default');

      // Print selected options
      console.log('\n');
      console.log(`${chalk.blue(logSymbols.info)} ${chalk.bold('Creating a new jBoilerplate project with the following settings:')}`);
      console.log(`  ${chalk.dim('>')} ${chalk.bold('Name:')} ${chalk.green(projectName)}`);
      console.log(`  ${chalk.dim('>')} ${chalk.bold('Template:')} ${chalk.green(template.name)}`);
      console.log(`  ${chalk.dim('>')} ${chalk.bold('TypeScript:')} ${chalk.green(useTypeScript ? 'Yes' : 'No')}`);
      console.log(`  ${chalk.dim('>')} ${chalk.bold('i18n Support:')} ${chalk.green(useI18n ? 'Yes' : 'No')}`);
      console.log(`  ${chalk.dim('>')} ${chalk.bold('Package Installation:')} ${chalk.green(options.install !== false ? 'Yes' : 'No')}`);
      console.log();
      
      // Create destination directory path
      const destinationPath = path.resolve(process.cwd(), projectName);
      
      // Check if directory exists
      if (fs.existsSync(destinationPath)) {
        if (!options.yes) {
          const { overwrite } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `${chalk.yellow('!')} Directory ${chalk.cyan(projectName)} already exists. Overwrite?`,
              default: false
            }
          ]);
          
          if (!overwrite) {
            console.log(chalk.yellow(`${logSymbols.warning} Operation cancelled.`));
            cliCursor.show();
            return;
          }
        }
        
        // Display spinner while emptying directory
        const cleaningSpinner = ora(`Cleaning directory ${chalk.cyan(projectName)}...`).start();
        await fs.emptyDir(destinationPath);
        cleaningSpinner.succeed(`Directory ${chalk.cyan(projectName)} cleaned`);
      } else {
        // Display spinner while creating directory
        const creatingSpinner = ora(`Creating directory ${chalk.cyan(projectName)}...`).start();
        await fs.ensureDir(destinationPath);
        creatingSpinner.succeed(`Directory ${chalk.cyan(projectName)} created`);
      }
      
      // Prepare variables for template substitution
      const variables = {
        projectName,
        description,
        author,
        version: '0.1.0',
        useTypeScript: useTypeScript ? 'true' : 'false',
        useI18n: useI18n ? 'true' : 'false'
      };
      
      // Create project from template
      await templateManager.createProject(templateId || 'default', projectName, destinationPath, variables, options.install !== false);
      
      // Show success message
      console.log('\n');
      console.log(
        boxen(
          `${chalk.green(logSymbols.success)} ${chalk.bold('Success!')} Project ${chalk.green(projectName)} created at ${chalk.green(destinationPath)}\n\n` +
          `${chalk.bold(secondaryGradient('Next steps:'))}\n\n` +
          `  ${chalk.cyan('$')} ${chalk.bold(`cd ${projectName}`)}\n` +
          `  ${chalk.cyan('$')} ${chalk.bold('npm run dev')}\n\n` +
          `${chalk.bold(secondaryGradient('Documentation:'))}\n` +
          `  ${terminalLink('https://github.com/yourusername/jboilerplate', 'https://github.com/yourusername/jboilerplate')}`,
          {
            padding: 1,
            margin: 1,
            borderColor: 'green',
            borderStyle: 'round',
            title: chalk.bold('Ready to go!'),
            titleAlignment: 'center',
          }
        )
      );
      
      // Show cursor again
      cliCursor.show();
      
    } catch (error) {
      // Show cursor on error
      cliCursor.show();
      console.error(`\n${chalk.red(logSymbols.error)} ${chalk.bold('Error creating project:')}`);
      console.error(`  ${chalk.red(error.message)}`);
      process.exit(1);
    }
  });

program
  .command('list-templates')
  .description('List available templates')
  .action(() => {
    displayWelcomeMessage();
    
    const templates = templateManager.getTemplateChoices();
    console.log(chalk.bold.blue('\n📦 Available Templates:\n'));
    
    templates.forEach((template, index) => {
      const templateData = templateManager.getTemplate(template.value);
      console.log(`  ${chalk.green(index + 1 + '.')} ${chalk.bold(templateData.name)}`);
      console.log(`     ${chalk.dim(templateData.description)}`);
      console.log(`     ${chalk.blue('Features:')} ${templateData.features.slice(0, 5).join(', ')}${templateData.features.length > 5 ? ', ...' : ''}`);
      console.log();
    });
  });

// Handle keyboard interrupts
process.on('SIGINT', () => {
  cliCursor.show();
  console.log(`\n${chalk.yellow(logSymbols.warning)} Operation cancelled by user`);
  process.exit(0);
});

// Parse command line arguments
program.parse(process.argv);

// Display help if no arguments provided
if (!process.argv.slice(2).length) {
  displayWelcomeMessage();
  program.outputHelp();
} 