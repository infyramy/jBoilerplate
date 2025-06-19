# JLaunch

An interactive command-line interface for setting up and managing jBoilerplate projects - a modern Vue 3 boilerplate with TypeScript, Shadcn UI, and flexible database options.

## Features

- 🚀 Interactive project setup
- 🗄️ Database migration management with Knex.js
- 🔄 Project update functionality
- 🎨 Beautiful CLI interface
- 🛠️ Multiple deployment options

## Installation

```bash
# Install globally
npm install -g jlaunch

# Or use with npx
npx jlaunch
```

## Usage

```bash
# Start the CLI
jlaunch

# Or with npx
npx jlaunch
```

### Available Commands

The CLI provides an interactive interface with the following options:

1. **Clone new JBoilerplate project**
   - Create a new project from scratch
   - Configure database options
   - Set up environment variables

2. **Update existing JBoilerplate project**
   - Update dependencies
   - Apply latest changes
   - Migrate database schema

3. **Manage database migrations**
   - Apply schema to empty database
   - Check migration status
   - Mark migrations as complete
   - Run specific migrations

## Database Options

The CLI supports two deployment options:

1. **Full Stack Deployment**
   - Includes a MySQL database container
   - Perfect for local development
   - Easy to set up and manage

2. **App-Only Deployment**
   - Connect to your own external database
   - Supports MySQL, PostgreSQL, and SQLite
   - Flexible for different hosting environments

## Requirements

- Node.js >= 16.0.0
- npm >= 7.0.0
- Git

## About jBoilerplate

jBoilerplate is a modern Vue 3 boilerplate with:
- TypeScript support
- Shadcn UI components
- Knex.js database integration
- Docker deployment options
- Admin and user interfaces
- Dark mode support
- Internationalization
- And much more!

Visit [the GitHub repository](https://github.com/infyramy/jBoilerplate) for more information.

## License

MIT 