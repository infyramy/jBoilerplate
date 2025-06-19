#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

function clearScreen() {
  console.clear();
}

function printAsciiArt() {
  // Custom ASCII art with color, no subtitle
  console.log(chalk.cyanBright(
    '        _____        _ __                __      __     \n' +
    '      (_) __ )____  (_) /__  _________  / /___ _/ /____ \n' +
    '     / / __  / __ \\ / / / _ \\ ___/ __ \\ / / __ `/ __/ _ \\ \n' +
    '    / / /_/ / /_/ / / /  __/ /  / /_/ / / /_/ / /_/  __/\n' +
    ' __/ /_____/\\____/_/_/\\___/_/  / .___/_/\\__,_/\\__/\\___/ \n' +
    '/___/                         /_/                        '
  ));
  console.log(); // Add a blank line after ASCII art
}

// Helper to style questions, answers, and user input
const q = (text: string) => chalk.gray(text); // question in readable grey
const a = (text: string) => chalk.whiteBright(text); // answer in white
const u = (text: string) => chalk.cyanBright(text); // user input/main color

async function intro() {
  clearScreen();
  printAsciiArt();
  console.log(q('Welcome to the JBoilerplate CLI!'));
  console.log(chalk.gray('A seamless way to bootstrap your next project.\n'));
}

function checkCommand(cmd: string): boolean {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function ensureRequirements() {
  const spinner = ora('Checking system requirements...').start();
  const hasNode = checkCommand('node');
  const hasNpm = checkCommand('npm');
  const hasGit = checkCommand('git');
  spinner.stop();
  if (!hasNode || !hasNpm || !hasGit) {
    clearScreen();
    printAsciiArt();
    console.log(chalk.red('Some required tools are missing:'));
    if (!hasNode) console.log(q('Node.js: ') + chalk.red('Not found'));
    if (!hasNpm) console.log(q('npm: ') + chalk.red('Not found'));
    if (!hasGit) console.log(q('git: ') + chalk.red('Not found'));
    const { setup } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: q('Would you like to see setup instructions before running the CLI?'),
        default: true,
      },
    ]);
    if (setup) {
      console.log();
      if (!hasNode) console.log(a('Install Node.js: ') + u('https://nodejs.org/en/download/'));
      if (!hasNpm) console.log(a('Install npm: ') + u('https://docs.npmjs.com/downloading-and-installing-node-js-and-npm'));
      if (!hasGit) console.log(a('Install git: ') + u('https://git-scm.com/downloads'));
      console.log();
      process.exit(1);
    } else {
      console.log(chalk.red('Exiting CLI. Please install the required tools and try again.'));
      process.exit(1);
    }
  }
}

// Helper for backable prompts with back always at the bottom (unless first page)
async function backablePrompt(promptConfig: any, backOption = 'Back', showBack = true) {
  if ((promptConfig.type === 'list' || promptConfig.type === 'rawlist') && showBack) {
    // Remove any existing back option
    promptConfig.choices = promptConfig.choices.filter((c: any) => c.value !== '__back');
    promptConfig.choices = [
      ...promptConfig.choices,
      { name: a(backOption), value: '__back' },
    ];
  }
  const result = await inquirer.prompt([promptConfig]);
  if (result[promptConfig.name] === '__back') return '__back';
  return result[promptConfig.name];
}

// Update selectAction and getEnvSetup to support back option at the bottom
async function selectAction() {
  let action;
  while (true) {
    action = await backablePrompt({
      type: 'list',
      name: 'action',
      message: q('What would you like to do?'),
      choices: [
        { name: a('Clone new JBoilerplate project'), value: 'clone' },
        { name: a('Update existing JBoilerplate project'), value: 'update' },
        { name: a('Manage database migrations'), value: 'migrations' },
        { name: a('Exit'), value: 'exit' },
      ],
      pageSize: 5,
      loop: false,
    }, 'Back', false); // No back on first page
    if (action !== '__back') break;
  }
  return action;
}

async function getProjectName() {
  let projectName;
  while (true) {
    const { projectName: name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: q('Enter your project name:'),
        transformer: u,
        validate: (input: string) => input ? true : chalk.red('Project name cannot be empty'),
      },
    ]);
    if (name === '__back') return '__back';
    projectName = name;
    break;
  }
  return projectName;
}

// Simplified function to ask if user wants app-only or app with database
async function getDeploymentOption() {
  let deploymentOption;
  while (true) {
    deploymentOption = await backablePrompt({
      type: 'list',
      name: 'deploymentOption',
      message: q('How would you like to deploy your application?'),
      choices: [
        { name: a('Full stack (with built-in MySQL database)'), value: 'with-db' },
        { name: a('App only (connect to external database)'), value: 'app-only' },
      ],
      pageSize: 3,
      loop: false,
    }, 'Back', true);
    if (deploymentOption !== '__back') break;
  }
  return deploymentOption;
}

// Function to handle database migrations
async function handleDatabaseMigrations() {
  clearScreen();
  printAsciiArt();
  console.log(chalk.cyanBright('Database Migration Management'));
  console.log(chalk.gray('Choose how to handle your database schema:\n'));
  
  let migrationOption;
  while (true) {
    migrationOption = await backablePrompt({
      type: 'list',
      name: 'migrationOption',
      message: q('What do you want to do with your database?'),
      choices: [
        { 
          name: a('Scenario 1: Apply schema from project to empty DB'), 
          value: 'apply-schema' 
        },
        { 
          name: a('Scenario 2: Check migration status (for existing DB)'), 
          value: 'check-status' 
        },
        { 
          name: a('Scenario 3: Mark migrations as complete without applying'), 
          value: 'mark-complete' 
        },
        { 
          name: a('Scenario 4: Run specific migration'), 
          value: 'specific-migration' 
        },
        { 
          name: a('Back to main menu'), 
          value: 'back' 
        },
      ],
      pageSize: 6,
      loop: false,
    }, 'Back', false);
    if (migrationOption !== '__back') break;
  }
  
  if (migrationOption === 'back') return;
  
  // Get project directory
  const { projectDir } = await inquirer.prompt([{
    type: 'input',
    name: 'projectDir',
    message: q('Enter the path to your project:'),
    transformer: u,
    default: '.',
  }]);
  
  try {
    switch (migrationOption) {
      case 'apply-schema':
        console.log(chalk.cyan('\nApplying database schema from migrations...'));
        console.log(chalk.gray('This will create all tables defined in migration files.'));
        const { confirmApply } = await inquirer.prompt([{
          type: 'confirm',
          name: 'confirmApply',
          message: q('Are you sure you want to apply all migrations?'),
          default: false,
        }]);
        
        if (confirmApply) {
          const spinner = ora('Running migrations...').start();
          try {
            execSync('npx knex migrate:latest', { cwd: projectDir, stdio: 'pipe' });
            spinner.succeed('Successfully applied migrations!');
          } catch (error: any) {
            spinner.fail('Failed to apply migrations.');
            console.error(chalk.red('Error details:'));
            console.error(chalk.gray(error.message || String(error)));
          }
        }
        break;
        
      case 'check-status':
        console.log(chalk.cyan('\nChecking migration status...'));
        try {
          const output = execSync('npx knex migrate:status', { cwd: projectDir, encoding: 'utf8' });
          console.log(chalk.gray(output));
        } catch (error: any) {
          console.error(chalk.red('Failed to check migration status.'));
          console.error(chalk.gray(error.message || String(error)));
        }
        break;
        
      case 'mark-complete':
        console.log(chalk.cyan('\nMarking migrations as complete without running them...'));
        console.log(chalk.yellow('Warning: This assumes your database schema already matches the migrations.'));
        
        // Get the list of migration files
        let migrations: string[] = [];
        try {
          // Get migrations directory from knexfile if possible
          let migrationsDir = './migrations';
          if (fs.existsSync(path.join(projectDir, 'knexfile.js'))) {
            console.log(chalk.gray('Reading knexfile.js for migrations directory...'));
            // We can't easily import the knexfile, so we'll check in common locations
            migrationsDir = './migrations'; // Default location
          }
          
          migrations = fs.readdirSync(path.join(projectDir, migrationsDir))
            .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
            
          if (migrations.length === 0) {
            console.log(chalk.yellow('No migration files found in the migrations directory.'));
            return;
          }
          
          // Select which migrations to mark as complete
          const { selectedMigrations } = await inquirer.prompt([{
            type: 'checkbox',
            name: 'selectedMigrations',
            message: q('Select migrations to mark as complete:'),
            choices: migrations.map(m => ({ name: m, value: m })),
            pageSize: Math.min(10, migrations.length + 1),
            validate: (input: string[]) => input.length > 0 ? true : 'Select at least one migration'
          }]);
          
          // Mark selected migrations as complete
          if (selectedMigrations && selectedMigrations.length > 0) {
            const spinner = ora('Marking migrations as complete...').start();
            
            // We'll use knex migrate:up with --to option for each selected migration
            for (const migration of selectedMigrations) {
              try {
                console.log(chalk.gray(`\nMarking ${migration} as complete...`));
                execSync(`npx knex migrate:up --name=${migration}`, { 
                  cwd: projectDir, 
                  stdio: 'pipe' 
                });
              } catch (error: any) {
                spinner.fail(`Failed to mark migration ${migration} as complete.`);
                console.error(chalk.red('Error details:'));
                console.error(chalk.gray(error.message || String(error)));
              }
            }
            
            spinner.succeed('Successfully marked selected migrations as complete!');
          }
        } catch (error: any) {
          console.error(chalk.red('Failed to process migrations.'));
          console.error(chalk.gray(error.message || String(error)));
        }
        break;
        
      case 'specific-migration':
        console.log(chalk.cyan('\nRunning specific migration...'));
        
        // Get migrations
        try {
          // Get migrations directory from knexfile if possible
          let migrationsDir = './migrations';
          
          if (fs.existsSync(path.join(projectDir, 'migrations'))) {
            const migrationFiles = fs.readdirSync(path.join(projectDir, migrationsDir))
              .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
              
            if (migrationFiles.length === 0) {
              console.log(chalk.yellow('No migration files found.'));
              return;
            }
            
            // Select which migration to run
            const { migrationFile } = await inquirer.prompt([{
              type: 'list',
              name: 'migrationFile',
              message: q('Select a migration to run:'),
              choices: migrationFiles.map(m => ({ name: m, value: m })),
              pageSize: Math.min(10, migrationFiles.length + 1)
            }]);
            
            if (migrationFile) {
              const { direction } = await inquirer.prompt([{
                type: 'list',
                name: 'direction',
                message: q('Run migration up or down?'),
                choices: [
                  { name: 'Up (apply migration)', value: 'up' },
                  { name: 'Down (rollback migration)', value: 'down' }
                ]
              }]);
              
              const spinner = ora(`Running migration ${direction}...`).start();
              try {
                execSync(`npx knex migrate:${direction} --name=${migrationFile}`, { 
                  cwd: projectDir, 
                  stdio: 'pipe' 
                });
                spinner.succeed(`Successfully ran migration ${direction}!`);
              } catch (error: any) {
                spinner.fail(`Failed to run migration ${direction}.`);
                console.error(chalk.red('Error details:'));
                console.error(chalk.gray(error.message || String(error)));
              }
            }
          } else {
            console.log(chalk.yellow('Migrations directory not found.'));
          }
        } catch (error: any) {
          console.error(chalk.red('Failed to process migrations.'));
          console.error(chalk.gray(error.message || String(error)));
        }
        break;
    }
  } catch (error: any) {
    console.error(chalk.red('An error occurred:'));
    console.error(chalk.gray(error.message || String(error)));
  }
  
  // Ask if they want to return to the migration menu
  const { returnToMenu } = await inquirer.prompt([{
    type: 'confirm',
    name: 'returnToMenu',
    message: q('Do you want to perform another migration operation?'),
    default: true
  }]);
  
  if (returnToMenu) {
    await handleDatabaseMigrations();
  }
}

async function getEnvSetup() {
  let envOption;
  while (true) {
    envOption = await backablePrompt({
      type: 'list',
      name: 'envOption',
      message: q('How do you want to set up your .env file?'),
      choices: [
        { name: a('Download from URL'), value: 'url' },
        { name: a('Use default template (recommended)'), value: 'template' },
        { name: a('Edit manually later'), value: 'manual' },
      ],
      pageSize: 4,
      loop: false,
    }, 'Back', true);
    if (envOption !== '__back') break;
  }
  let envUrl = '';
  if (envOption === 'url') {
    const { url } = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: q('Enter the URL to download your .env file:'),
        transformer: u,
        validate: (input: string) => input.startsWith('http') ? true : chalk.red('Please enter a valid URL'),
      },
    ]);
    envUrl = url;
  }
  return { envOption, envUrl };
}

async function setupEnvFile(envOption: string, envUrl: string, projectPath: string, deploymentOption: string) {
  const envFilePath = path.join(projectPath, '.env');
  let envContent = '';

  const spinner = ora('Setting up .env file...').start();
  
  try {
    if (envOption === 'url' && envUrl) {
      const res = await fetch(envUrl);
      if (!res.ok) throw new Error('Failed to download .env');
      envContent = await res.text();
    } else if (envOption === 'template') {
      // Create default .env from template based on deployment option
      envContent = `# Generated by jBoilerplate CLI\n\n`;
      
      if (deploymentOption === 'with-db') {
        // For built-in database deployment
        envContent += `# Docker settings\n`;
        envContent += `DB_CLIENT=mysql\n`;
        envContent += `DB_HOST=db\n`;
        envContent += `DB_PORT=3306\n`;
        envContent += `DB_USER=jboilerplate\n`;
        envContent += `DB_PASSWORD=jboilerplate\n`;
        envContent += `DB_NAME=jboilerplate\n`;
        envContent += `DB_ROOT_PASSWORD=rootpassword\n\n`;
        
        envContent += `# App settings\n`;
        envContent += `VITE_DB_CLIENT=mysql\n`;
        envContent += `VITE_DB_HOST=db\n`;
        envContent += `VITE_DB_PORT=3306\n`;
        envContent += `VITE_DB_USER=jboilerplate\n`;
        envContent += `VITE_DB_PASSWORD=jboilerplate\n`;
        envContent += `VITE_DB_NAME=jboilerplate\n`;
      } else {
        // For app-only deployment
        envContent += `# App settings\n`;
        envContent += `VITE_DB_CLIENT=mysql\n`;
        envContent += `VITE_DB_HOST=localhost\n`;
        envContent += `VITE_DB_PORT=3306\n`;
        envContent += `VITE_DB_USER=root\n`;
        envContent += `VITE_DB_PASSWORD=\n`;
        envContent += `VITE_DB_NAME=jboilerplate\n`;
      }
    }
    
    if (envContent) {
      fs.writeFileSync(envFilePath, envContent);
      spinner.succeed('.env file created!');
    } else {
      spinner.info('No .env file created. You can create one manually later.');
    }
    
    // Always create .env.example as a reference
    const exampleEnvPath = path.join(projectPath, '.env.example');
    if (!fs.existsSync(exampleEnvPath)) {
      // Copy from the included .env.example template if it exists
      if (fs.existsSync(path.join(projectPath, '.env.example.template'))) {
        fs.copyFileSync(
          path.join(projectPath, '.env.example.template'),
          exampleEnvPath
        );
      } else {
        // Create a basic .env.example
        const exampleEnvContent = `# Environment Configuration
VITE_ENVIRONMENT=development

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_API_RETRIES=3

# Docker Database Configuration
# Used when running with docker-compose --profile with-db
DB_IMAGE=mysql:8
DB_PORT_FORWARD=3306
DB_PORT=3306
DB_HOST=db
DB_USER=jboilerplate
DB_PASSWORD=your-password
DB_NAME=jboilerplate
DB_ROOT_PASSWORD=your-root-password
DB_CLIENT=mysql

# Database Configuration for Application
# These settings are used by the application to connect to the database
VITE_DB_CLIENT=mysql
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=jboilerplate
VITE_DB_PASSWORD=your-password
VITE_DB_NAME=jboilerplate
VITE_DB_SSL=false

# Email Configuration
VITE_PLUNK_API_KEY=
VITE_DEFAULT_FROM_EMAIL=no-reply@jboilerplate.com

# Feature Flags
VITE_FEATURE_DARK_MODE=true
VITE_FEATURE_MULTILINGUAL_SUPPORT=true
VITE_FEATURE_NOTIFICATIONS=true
VITE_FEATURE_ANALYTICS=false
VITE_FEATURE_ADMIN_DASHBOARD=true
VITE_FEATURE_USER_MANAGEMENT=true
VITE_FEATURE_EMAIL_SERVICE=false`;

        fs.writeFileSync(exampleEnvPath, exampleEnvContent);
      }
      console.log(chalk.gray('Created .env.example with configuration reference'));
    }
    
  } catch (e) {
    spinner.fail('Failed to create .env file.');
    console.error(e);
  }
}

// Create a launch script based on deployment option
async function createLaunchScript(projectPath: string, deploymentOption: string) {
  const spinner = ora('Creating launch script...').start();
  
  try {
    let launchScript = '#!/bin/bash\n\n';
    
    if (deploymentOption === 'with-db') {
      launchScript += '# Start the full stack application with database\n';
      launchScript += 'docker-compose --profile with-db up -d\n';
    } else {
      launchScript += '# Start the application only (connect to external database)\n';
      launchScript += 'docker-compose -f docker-compose.app-only.yml up -d\n';
    }
    
    fs.writeFileSync(path.join(projectPath, 'launch.sh'), launchScript);
    fs.chmodSync(path.join(projectPath, 'launch.sh'), '755'); // Make executable
    spinner.succeed('Launch script created!');
  } catch (error) {
    spinner.fail('Error creating launch script.');
    console.error(error);
  }
}

async function setupIDEConfig(projectPath: string) {
  const spinner = ora('Setting up IDE config...').start();
  // Example: create .editorconfig (user can expand as needed)
  const editorConfig = `root = true\n[*]\nindent_style = space\nindent_size = 2\nend_of_line = lf\ncharset = utf-8\ntrim_trailing_whitespace = true\ninsert_final_newline = true\n`;
  fs.writeFileSync(path.join(projectPath, '.editorconfig'), editorConfig);
  spinner.succeed('IDE config set!');
}

async function cloneOrUpdateRepo(action: string, projectName: string) {
  const repoUrl = 'https://github.com/infyramy/jBoilerplate.git'; // Updated to actual repo
  const projectPath = path.resolve(process.cwd(), projectName);
  const spinner = ora(action === 'clone' ? 'Cloning project...' : 'Updating project...').start();
  try {
    if (action === 'clone') {
      execSync(`git clone ${repoUrl} ${projectName}`, { stdio: 'ignore' });
    } else {
      execSync('git pull', { cwd: projectPath, stdio: 'ignore' });
    }
    spinner.succeed(action === 'clone' ? 'Project cloned!' : 'Project updated!');
    return projectPath;
  } catch (e) {
    spinner.fail('Git operation failed. Please check the project name and your network connection.');
    process.exit(1);
  }
}

async function installDependencies(projectPath: string) {
  const spinner = ora('Installing dependencies...').start();
  try {
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed('Dependencies installed!');
  } catch (e: any) {
    spinner.fail('Failed to install dependencies.');
    if (e && e.message && e.message.includes('ERESOLVE')) {
      console.log(chalk.yellowBright('\nDependency conflict detected.'));
      const { retry } = await inquirer.prompt([
        {
          type: 'list',
          name: 'retry',
          message: q('Would you like to retry with --legacy-peer-deps or --force?'),
          choices: [
            { name: a('Retry with --legacy-peer-deps (recommended)'), value: 'legacy' },
            { name: a('Retry with --force'), value: 'force' },
            { name: a('Cancel setup'), value: 'cancel' },
          ],
        },
      ]);
      if (retry === 'legacy') {
        try {
          spinner.start('Retrying with --legacy-peer-deps...');
          execSync('npm install --legacy-peer-deps', { cwd: projectPath, stdio: 'inherit' });
          spinner.succeed('Dependencies installed!');
          return;
        } catch (err: any) {
          spinner.fail('Still failed to install dependencies.');
          if (err && err.message) {
            console.log(chalk.red('Error details:'));
            console.log(chalk.gray(err.message));
          }
          process.exit(1);
        }
      } else if (retry === 'force') {
        try {
          spinner.start('Retrying with --force...');
          execSync('npm install --force', { cwd: projectPath, stdio: 'inherit' });
          spinner.succeed('Dependencies installed!');
          return;
        } catch (err: any) {
          spinner.fail('Still failed to install dependencies.');
          if (err && err.message) {
            console.log(chalk.red('Error details:'));
            console.log(chalk.gray(err.message));
          }
          process.exit(1);
        }
      } else {
        console.log(chalk.red('Setup cancelled.'));
        process.exit(1);
      }
    } else if (e && e.message) {
      console.log(chalk.red('Error details:'));
      console.log(chalk.gray(e.message));
      process.exit(1);
    }
  }
}

async function postSetupOptions(projectPath: string) {
  console.log(chalk.cyan('\nSetup completed! What would you like to do next?'));
  const { nextAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextAction',
      message: q('Choose an option:'),
      choices: [
        { name: a('Start development server'), value: 'dev' },
        { name: a('Open in VS Code (if installed)'), value: 'code' },
        { name: a('Start Docker deployment'), value: 'docker' },
        { name: a('Manage database migrations'), value: 'migrations' },
        { name: a('Exit'), value: 'exit' },
      ],
    }
  ]);

  if (nextAction === 'dev') {
    console.log(chalk.cyan('\nStarting development server...'));
    const child = spawn('npm', ['run', 'dev'], { cwd: projectPath, stdio: 'inherit' });
    child.on('close', code => {
      process.exit(code || 0);
    });
  } else if (nextAction === 'code') {
    try {
      console.log(chalk.cyan('\nOpening in VS Code...'));
      execSync(`code ${projectPath}`, { stdio: 'ignore' });
      console.log(chalk.green('Done! VS Code should open shortly.'));
      process.exit(0);
    } catch (e) {
      console.log(chalk.yellow('Failed to open VS Code. Please open it manually.'));
      process.exit(0);
    }
  } else if (nextAction === 'docker') {
    console.log(chalk.cyan('\nStarting Docker deployment...'));
    try {
      execSync(`cd ${projectPath} && ./launch.sh`, { stdio: 'inherit' });
      console.log(chalk.green('Docker containers started successfully!'));
      process.exit(0);
    } catch (e) {
      console.log(chalk.red('Failed to start Docker containers. Please run ./launch.sh manually.'));
      process.exit(1);
    }
  } else if (nextAction === 'migrations') {
    await handleDatabaseMigrations();
    await postSetupOptions(projectPath);
  } else {
    console.log(chalk.green('\nSetup complete! Happy coding!'));
    process.exit(0);
  }
}

async function showSummary({ projectName, envOption, envUrl, deploymentOption }: { 
  projectName: string, 
  envOption: string, 
  envUrl: string, 
  deploymentOption: string 
}) {
  console.log(chalk.cyanBright('\n✨ Setup Summary:'));
  console.log(chalk.white('Project name: ') + u(projectName));
  console.log(chalk.white('Environment: ') + u(envOption === 'url' ? 'From URL' : (envOption === 'template' ? 'From template' : 'Manual setup')));
  if (envOption === 'url') {
    console.log(chalk.white('Env URL: ') + u(envUrl));
  }
  
  // Show deployment option
  console.log(chalk.white('Deployment: ') + u(deploymentOption === 'with-db' ? 'Full stack with database' : 'App only'));
}

function printLoadingStep(label: string, summary: string, oraInstance?: import('ora').Ora) {
  const prefix = oraInstance ? '  ' : ''; // Add indentation if used with ora
  console.log(`${prefix}${chalk.gray('⌛')} ${chalk.cyanBright(label)} ${chalk.gray(`(${summary})`)}`);
}

function buildSummary({ projectName, envOption, envUrl, projectPath, deploymentOption }: { 
  projectName: string, 
  envOption: string, 
  envUrl: string, 
  projectPath: string, 
  deploymentOption: string 
}) {
  const steps = [
    { label: 'Clone project', summary: `git clone to ${projectName}` },
    { label: 'Install dependencies', summary: 'npm install' },
    { label: 'Set up environment', summary: envOption === 'url' ? `Download from ${envUrl}` : (envOption === 'template' ? 'Create from template' : 'Manual setup') },
    { label: 'Create IDE config', summary: '.editorconfig' },
    { label: 'Deployment setup', summary: deploymentOption === 'with-db' ? 'With built-in database' : 'App only' },
    { label: 'Create launch script', summary: './launch.sh' },
  ];
  
  console.log(chalk.cyanBright('\n⚡ Project setup steps:'));
  
  // Add leading numbering and padding to align all steps
  const maxLabelLength = Math.max(...steps.map(step => step.label.length));
  const pad = (l: string, idx: number) => {
    return `${chalk.gray(idx + 1 + '.')} ${chalk.cyanBright(l.padEnd(maxLabelLength, ' '))}`;
  };
  
  steps.forEach((step, idx) => {
    console.log(`  ${pad(step.label, idx)} ${chalk.gray(step.summary)}`);
  });
  
  console.log(); // empty line
}

async function main() {
  await intro();
  await ensureRequirements();

  const action = await selectAction();
  
  if (action === 'exit') {
    console.log(chalk.green('Goodbye!'));
    process.exit(0);
  }
  
  if (action === 'migrations') {
    await handleDatabaseMigrations();
    // After handling migrations, return to main menu
    await main();
    return;
  }

  let projectName;
  if (action === 'clone') {
    projectName = await getProjectName();
  } else {
    const { dir } = await inquirer.prompt([{
      type: 'input',
      name: 'dir',
      message: q('Enter the path to your existing JBoilerplate project:'),
      transformer: u,
      default: '.',
    }]);
    projectName = dir;
  }

  // Get deployment option (with-db or app-only)
  const deploymentOption = await getDeploymentOption();

  const { envOption, envUrl } = await getEnvSetup();
  
  console.log(chalk.gray('\nReady to start! We will:'));
  buildSummary({ 
    projectName, 
    envOption, 
    envUrl, 
    projectPath: '', 
    deploymentOption 
  });
  
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: q('Proceed with setup?'),
    default: true,
  }]);
  
  if (!confirm) {
    console.log(chalk.yellow('Setup cancelled.'));
    process.exit(0);
  }
  
  // Actual setup process
  const projectPath = await cloneOrUpdateRepo(action, projectName);
  await installDependencies(projectPath);
  await setupEnvFile(envOption, envUrl, projectPath, deploymentOption);
  await createLaunchScript(projectPath, deploymentOption);
  await setupIDEConfig(projectPath);
  
  // Show summary
  await showSummary({ 
    projectName, 
    envOption, 
    envUrl, 
    deploymentOption 
  });
  
  // Post setup options
  await postSetupOptions(projectPath);
}

main().catch(err => {
  console.error(chalk.red('An error occurred:'));
  console.error(err);
  process.exit(1);
});
