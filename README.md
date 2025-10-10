# jBoilerplate

A modern, production-ready Vue 3 boilerplate with TypeScript, Shadcn UI, and enterprise-grade features for building scalable web applications.

## ✨ Features

### Core Stack
- 🚀 **[Vue 3](https://v3.vuejs.org/)** - Composition API with `<script setup>`
- 🔥 **[TypeScript](https://www.typescriptlang.org/)** - Full type safety
- ⚡ **[Vite](https://vitejs.dev/)** - Lightning-fast HMR and builds
- 🎨 **[Shadcn UI](https://ui.shadcn.com/)** - Beautiful, accessible components
- 🎯 **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling

### State & Routing
- 📦 **[Pinia](https://pinia.vuejs.org/)** - Intuitive state management
- 🔄 **[Vue Router](https://router.vuejs.org/)** - Dynamic routing with guards
- 🌐 **[Vue I18n](https://vue-i18n.intlify.dev/)** - Internationalization

### Database & Backend
- 🗄️ **[Knex.js](https://knexjs.org/)** - SQL query builder
- 🔌 **Flexible Database** - MySQL, PostgreSQL, SQLite support
- 🔐 **Authentication & Authorization** - Built-in user management
- 📊 **Database Migrations & Seeds** - Version-controlled schema

### UI & UX
- 🎭 **Dark Mode** - System preference detection
- 📱 **Responsive Design** - Mobile-first approach
- 🚦 **Form Validation** - Vuelidate integration
- 📈 **Dashboard Components** - Pre-built admin layouts
- 🎪 **Animations** - Smooth transitions with VueUse Motion

### Developer Experience
- 🐳 **Docker Ready** - Multi-environment deployment
- 🛠️ **Admin & SuperAdmin** - Role-based interfaces
- 🧪 **Testing Setup** - Vitest configuration
- 📝 **TypeScript Types** - Comprehensive type definitions
- 🔧 **ESLint & Prettier** - Code quality tools

## Prerequisites

- Node.js 16+
- pnpm 8+
- Docker and Docker Compose (for containerized deployment)

## Quick Start

### Using the CLI (Recommended)

The jBoilerplate CLI makes it easy to set up your project with your preferred database configuration:

```bash
# Install dependencies
pnpm install

# Run the setup CLI
pnpm run cli:setup
```

The CLI will guide you through configuring your application with the following options:

1. **Full stack deployment** - Includes a MySQL database container
2. **App-only deployment** - Connect to your own external database

### Manual Setup

#### Option 1: Full Stack Deployment (with built-in database)

1. Create a `.env` file with database credentials:

```env
# Docker settings
DB_CLIENT=mysql
DB_HOST=db
DB_PORT=3306
DB_USER=jboilerplate
DB_PASSWORD=jboilerplate
DB_NAME=jboilerplate
DB_ROOT_PASSWORD=rootpassword

# App settings
VITE_DB_CLIENT=mysql
VITE_DB_HOST=db
VITE_DB_PORT=3306
VITE_DB_USER=jboilerplate
VITE_DB_PASSWORD=jboilerplate
VITE_DB_NAME=jboilerplate
```

2. Start the application with database:

```bash
# Start with database
pnpm run docker:full
```

#### Option 2: App-Only Deployment (connect to external database)

1. Create a `.env` file with your external database credentials:

```env
# App settings
VITE_DB_CLIENT=mysql  # or pg for PostgreSQL, sqlite3 for SQLite
VITE_DB_HOST=your-db-host
VITE_DB_PORT=3306     # or 5432 for PostgreSQL
VITE_DB_USER=your-username
VITE_DB_PASSWORD=your-password
VITE_DB_NAME=your-database
```

2. Start the application only:

```bash
# Start application only
pnpm run docker:app-only
```

## Database Migrations

Run migrations to set up your database schema:

```bash
# Create a new migration
pnpm run migrate:make migration_name

# Run migrations
pnpm run migrate:latest

# Rollback migrations
pnpm run migrate:rollback

# Create a seed file
pnpm run seed:make seed_name

# Run seeds
pnpm run seed:run
```

## Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm run test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_DB_CLIENT` | Database client (mysql, pg, sqlite3) | mysql |
| `VITE_DB_HOST` | Database host | localhost |
| `VITE_DB_PORT` | Database port | 3306 |
| `VITE_DB_USER` | Database username | jboilerplate |
| `VITE_DB_PASSWORD` | Database password | jboilerplate |
| `VITE_DB_NAME` | Database name | jboilerplate |
| `VITE_DB_SSL` | Enable SSL for database connection | false |

## Project Structure

```
jBoilerplate/
├── cli/                   # CLI tool for project setup
├── migrations/            # Database migrations
├── public/               # Static assets
├── seeds/                # Database seed files
├── src/
│   ├── assets/           # Application assets
│   ├── components/       # Vue components
│   │   └── ui/           # Shadcn UI components
│   ├── composables/      # Vue composables
│   ├── constants/        # Application constants
│   ├── layouts/          # Page layouts
│   ├── lib/              # Utilities and libraries
│   │   └── db/           # Database integration
│   ├── locales/          # I18n translation files
│   ├── pages/            # Application pages
│   │   ├── admin/        # Admin pages
│   │   └── superadmin/   # SuperAdmin pages
│   ├── plugins/          # Vue plugins
│   ├── router/           # Vue Router configuration
│   ├── services/         # API and other services
│   ├── stores/           # Pinia stores
│   └── types/            # TypeScript type definitions
├── templates/            # Project templates
├── components.json       # Shadcn UI configuration
├── docker-compose.yml    # Full stack Docker configuration
├── docker-compose.app-only.yml # App-only Docker configuration
├── knexfile.js          # Knex.js configuration
└── vite.config.mts      # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this boilerplate for your projects!

## 🙏 Acknowledgments

Built with modern web technologies and best practices for the Vue.js ecosystem.

---

**Made with ❤️ for the Vue.js community**
