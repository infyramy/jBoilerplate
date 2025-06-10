# jBoilerplate CLI Usage Guide

This guide provides detailed instructions for using the jBoilerplate CLI tool to create new Vue 3 projects.

## Installation

You can use jBoilerplate directly with npx without installing it globally:

```bash
npx jboilerplate create my-project
```

Or install it globally for easier access:

```bash
npm install -g jboilerplate
jboilerplate create my-project
```

## Commands

### Create a New Project

```bash
jboilerplate create [project-name]
```

This command creates a new Vue 3 project using the jBoilerplate template. If you don't provide a project name, you will be prompted to enter one.

#### Options and Prompts

The CLI will guide you through the following options:

1. **Project Name** - The name of your project (must be a valid npm package name)
2. **Template** - Choose from available templates:
   - Default - Complete application with all features
   - Admin Dashboard - Extended admin interface with analytics
   - Minimal - Lightweight starter with essential features
3. **Project Description** - A brief description of your project
4. **Author Name** - Your name or organization
5. **TypeScript** - Whether to use TypeScript (recommended)
6. **Internationalization** - Whether to include i18n support (asked only for minimal template)

### List Available Templates

```bash
jboilerplate list-templates
```

This command lists all available templates with their descriptions.

## Examples

### Creating a Standard Project

```bash
jboilerplate create my-app
```

Follow the prompts to select options. For a standard project, you might select:

```
? What is the name of your project? my-app
? Select a template: Default - Complete Vue 3 application with TypeScript, Shadcn UI, i18n, and basic admin pages
? Project description: My awesome Vue application
? Author name: John Doe
? Use TypeScript? Yes
```

### Creating a Minimal Project

```bash
jboilerplate create minimal-app
```

For a minimal project, you might select:

```
? What is the name of your project? minimal-app
? Select a template: Minimal - Lightweight Vue 3 starter with essential features only
? Project description: A lightweight Vue application
? Author name: John Doe
? Use TypeScript? Yes
? Add internationalization (i18n) support? No
```

### Creating an Admin Dashboard Project

```bash
jboilerplate create admin-app
```

For an admin dashboard project, you might select:

```
? What is the name of your project? admin-app
? Select a template: Admin Dashboard - Extended admin dashboard with analytics, user management, and settings
? Project description: Admin dashboard for my application
? Author name: John Doe
? Use TypeScript? Yes
```

## Template Details

### Default Template

The Default template includes:

- Vue 3 with TypeScript
- Shadcn UI components
- Pinia state management
- Vue Router
- Internationalization (i18n)
- Authentication system
- Dark mode
- Form validation
- Basic admin pages
- API integration

### Admin Dashboard Template

The Admin Dashboard template includes everything in the Default template plus:

- Advanced admin dashboard
- Analytics dashboard
- User management
- Role-based access control
- Settings management
- More comprehensive admin UI

### Minimal Template

The Minimal template includes only the essentials:

- Vue 3 with TypeScript
- Core Shadcn UI components
- Pinia state management
- Vue Router
- Dark mode

## Project Structure

After creating a project, you'll have the following structure:

```
my-project/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Application assets
│   ├── components/         # Vue components
│   │   └── ui/             # Shadcn UI components
│   ├── composables/        # Vue composables
│   ├── constants/          # Application constants
│   ├── layouts/            # Page layouts
│   ├── lib/                # Utilities and libraries
│   │   └── db/             # Database integration (if included)
│   ├── locales/            # I18n translation files (if included)
│   ├── pages/              # Application pages
│   │   ├── admin/          # Admin pages (if included)
│   │   └── superadmin/     # SuperAdmin pages (if included)
│   ├── plugins/            # Vue plugins
│   ├── router/             # Vue Router configuration
│   ├── services/           # API and other services
│   ├── stores/             # Pinia stores
│   └── types/              # TypeScript type definitions
├── components.json         # Shadcn UI configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Next Steps After Project Creation

After creating your project:

1. Navigate to your project directory:
   ```bash
   cd my-project
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access your application at http://localhost:3000

4. Explore the project structure and start customizing:
   - Modify `src/pages` to add new pages
   - Customize `src/components` for UI components
   - Update `src/stores` for state management
   - Configure API services in `src/services`

## Troubleshooting

### Common Issues

1. **Invalid Package Name**
   - Error: `Invalid package name: name cannot contain capital letters`
   - Solution: Use lowercase letters, hyphens, and numbers only

2. **Directory Already Exists**
   - Error: `Directory already exists`
   - Solution: Choose a different name or confirm overwrite

3. **Installation Errors**
   - Error: `Failed to install dependencies`
   - Solution: Check your Node.js version (should be 16+) and npm version (should be 7+)

4. **Template Not Found**
   - Error: `Template not found`
   - Solution: Make sure you're using a valid template name

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub repository](https://github.com/yourusername/jboilerplate/issues)
2. Open a new issue with details about your problem
3. Consult the [documentation](https://github.com/yourusername/jboilerplate/blob/main/README.md)

## Advanced Usage

### Creating Custom Templates

Advanced users can create custom templates by:

1. Cloning an existing template directory
2. Modifying the `template.json` file
3. Customizing the template files
4. Adding the template to your templates directory

Custom templates follow the same structure as built-in templates.

### Using Environment Variables

jBoilerplate projects support environment variables through `.env` files:

- `.env` - Loaded in all environments
- `.env.development` - Development environment
- `.env.production` - Production environment

Environment variables must be prefixed with `VITE_` to be accessible in your application:

```
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My Application
```

Access them in your code:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

## Conclusion

The jBoilerplate CLI provides a streamlined way to create Vue 3 applications with various features and configurations. By following this guide, you should be able to effectively use the CLI to create and customize your projects. 