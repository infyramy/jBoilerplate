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
- MySQL, PostgreSQL, or SQLite database

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/infyramy/jBoilerplate.git
cd jBoilerplate
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Database Configuration
DB_CLIENT=mysql2                    # or 'pg' for PostgreSQL, 'sqlite3' for SQLite
DB_HOST=your_database_host
DB_PORT=3306                        # 5432 for PostgreSQL
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Frontend Environment Variables
VITE_DB_CLIENT=mysql                # or 'pg', 'sqlite3'
VITE_DB_HOST=your_database_host
VITE_DB_PORT=3306
VITE_DB_USER=your_database_user
VITE_DB_PASSWORD=your_database_password
VITE_DB_NAME=your_database_name
```

### 4. Run Database Migrations

```bash
# Run migrations to create database tables
pnpm run migrate:latest

# (Optional) Seed the database with sample data
pnpm run seed:run
```

### 5. Start Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

### Development
```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production (with type checking)
pnpm run build:only   # Build without type checking
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
pnpm run test         # Run tests
pnpm run test:watch   # Run tests in watch mode
```

### Database Commands
```bash
pnpm run migrate:make <name>   # Create a new migration file
pnpm run migrate:latest        # Run all pending migrations
pnpm run migrate:rollback      # Rollback the last migration
pnpm run seed:make <name>      # Create a new seed file
pnpm run seed:run              # Run all seed files
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_CLIENT` | Database client (mysql2, pg, sqlite3) | mysql2 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_USER` | Database username | your_user |
| `DB_PASSWORD` | Database password | your_password |
| `DB_NAME` | Database name | your_database |
| `VITE_DB_CLIENT` | Frontend database client | mysql |
| `VITE_DB_HOST` | Frontend database host | localhost |
| `VITE_DB_PORT` | Frontend database port | 3306 |
| `VITE_DB_USER` | Frontend database username | your_user |
| `VITE_DB_PASSWORD` | Frontend database password | your_password |
| `VITE_DB_NAME` | Frontend database name | your_database |

## Project Structure

```
jBoilerplate/
├── migrations/            # Database migrations
├── public/               # Static assets
├── seeds/                # Database seed files
├── scripts/              # Utility scripts
├── src/
│   ├── assets/           # Application assets (CSS, images)
│   ├── components/       # Vue components
│   │   └── ui/           # Shadcn UI components
│   ├── composables/      # Vue composables (hooks)
│   ├── layouts/          # Page layouts (auth, admin, dashboard)
│   ├── lib/              # Utilities and libraries
│   │   └── db/           # Database integration
│   ├── locales/          # I18n translation files
│   ├── pages/            # Application pages
│   │   ├── admin/        # Admin pages
│   │   └── user/         # User pages
│   ├── plugins/          # Vue plugins
│   ├── router/           # Vue Router configuration
│   ├── services/         # API and service layer
│   ├── stores/           # Pinia stores
│   └── types/            # TypeScript type definitions
├── components.json       # Shadcn UI configuration
├── knexfile.js          # Knex.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
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
