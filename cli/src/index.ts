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
        { name: a('Exit'), value: 'exit' },
      ],
      pageSize: 4,
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

async function getEnvSetup() {
  let envOption;
  while (true) {
    envOption = await backablePrompt({
      type: 'list',
      name: 'envOption',
      message: q('How do you want to set up your .env file?'),
      choices: [
        { name: a('Download from URL'), value: 'url' },
        { name: a('Edit manually later'), value: 'manual' },
      ],
      pageSize: 3,
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

async function setupEnvFile(envUrl: string, projectPath: string) {
  const spinner = ora('Setting up .env file...').start();
  try {
    const res = await fetch(envUrl);
    if (!res.ok) throw new Error('Failed to download .env');
    const envContent = await res.text();
    fs.writeFileSync(path.join(projectPath, '.env'), envContent);
    spinner.succeed('.env file downloaded!');
  } catch (e) {
    spinner.fail('Failed to download .env file.');
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
        console.log(chalk.red('Setup cancelled by user.'));
        process.exit(1);
      }
    } else if (e && e.message) {
      console.log(chalk.red('Error details:'));
      console.log(chalk.gray(e.message));
    }
    process.exit(1);
  }
}

async function postSetupOptions(projectPath: string) {
  const { openOption } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'openOption',
      message: q('What do you want to do next?'),
      choices: [
        { name: a('Open in IDE'), value: 'ide' },
        { name: a('Open in browser (start dev server)'), value: 'browser' },
      ],
      pageSize: 2,
      loop: false,
    },
  ]);
  if (openOption.includes('ide')) {
    spawn('code', [projectPath], { stdio: 'ignore', detached: true });
  }
  if (openOption.includes('browser')) {
    const devProc = spawn('npm', ['run', 'dev'], { cwd: projectPath, stdio: 'ignore', detached: true });
    setTimeout(() => {
      require('open')('http://localhost:3000');
    }, 5000);
  }
}

// Add a summary page after user input, before install steps
async function showSummary({ projectName, envOption, envUrl }: { projectName: string, envOption: string, envUrl: string }) {
  clearScreen();
  printAsciiArt();
  console.log(chalk.cyanBright('Summary of your setup:'));
  console.log(q('Project Name: ') + u(projectName));
  console.log(q('Env Setup: ') + u(envOption === 'url' ? `Download from URL (${envUrl})` : 'Edit manually later'));
  console.log();
}

// Helper to print a loading message and summary
function printLoadingStep(label: string, summary: string, oraInstance?: import('ora').Ora) {
  clearScreen();
  printAsciiArt();
  // Draw summary in a double-line box style, with color
  const boxColor = chalk.hex('#444B53');
  const titleColor = chalk.gray;
  const valueColor = chalk.cyan;
  // Split summary into lines, and colorize title/value
  const lines = summary.split('\n').map(line => {
    const match = line.match(/^(.*?):\s*(.*)$/);
    if (match) {
      return titleColor(match[1] + ':') + ' ' + valueColor(match[2]);
    }
    return titleColor(line);
  });
  // Remove color codes for length calculation
  const visibleLengths = lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length);
  const maxLen = Math.max(...visibleLengths);
  const pad = (l: string, idx: number) => {
    const visibleLen = visibleLengths[idx];
    return l + ' '.repeat(maxLen - visibleLen);
  };
  // Double-line box drawing with color
  const top = boxColor('╔' + '═'.repeat(maxLen + 2) + '╗');
  const bottom = boxColor('╚' + '═'.repeat(maxLen + 2) + '╝');
  console.log(top);
  lines.forEach((l, idx) => {
    console.log(boxColor('║ ') + pad(l, idx) + boxColor(' ║'));
  });
  console.log(bottom + '\n');
  // Show current state beside ora spinner if oraInstance is provided
  if (oraInstance) {
    oraInstance.text = chalk.cyanBright(label);
  } else {
    process.stdout.write(chalk.cyanBright('⏳ ' + label));
  }
}

// Helper to build summary string
function buildSummary({ projectName, envOption, envUrl, projectPath }: { projectName: string, envOption: string, envUrl: string, projectPath: string }) {
  return [
    'Project Name: ' + projectName,
    'Directory: ' + (projectPath || '...'),
    `.env file: ${envOption === 'url' ? `Download from URL (${envUrl})` : 'Edit manually later'}`,
  ].join('\n');
}

async function main() {
  await ensureRequirements();
  await intro();
  const action = await selectAction();
  if (action === 'exit') return;
  const projectName = await getProjectName();
  const { envOption, envUrl } = await getEnvSetup();
  let projectPath: string = '';
  const summaryData = { projectName, envOption, envUrl, projectPath };
  await showSummary({ projectName, envOption, envUrl });

  // Steps with loading message
  const steps = [
    { fn: async () => await cloneOrUpdateRepo(action, projectName), label: 'Cloning/Updating project...' },
    { fn: async (p: string) => envOption === 'url' ? await setupEnvFile(envUrl, p) : undefined, label: 'Setting up .env file...' },
    { fn: async (p: string) => await setupIDEConfig(p), label: 'Setting up IDE config...' },
    { fn: async (p: string) => await installDependencies(p), label: 'Installing dependencies...' },
  ];
  for (let i = 0; i < steps.length; i++) {
    let label = steps[i].label;
    printLoadingStep(label, buildSummary({ ...summaryData, projectPath }));
    if (i === 0) {
      const result = await steps[i].fn("");
      if (typeof result === 'string') projectPath = result;
      summaryData.projectPath = projectPath;
    } else {
      await steps[i].fn(projectPath);
    }
  }
  // Final message
  clearScreen();
  printAsciiArt();
  console.log(chalk.greenBright('\nAll done!'));
  await postSetupOptions(projectPath);
  clearScreen();
  printAsciiArt();
  console.log(chalk.greenBright('\nEnjoy your development! 🚀'));
}

main();
