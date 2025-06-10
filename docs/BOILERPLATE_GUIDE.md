# jBoilerplate Developer Guide

Welcome to jBoilerplate, a robust foundation for your Vue 3 applications with TypeScript and Shadcn UI components. This guide is designed for software engineers and covers all aspects of the boilerplate to help you leverage its full potential.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Core Features](#core-features)
   - [Authentication](#authentication)
   - [Internationalization (i18n)](#internationalization-i18n)
   - [Routing & Navigation](#routing--navigation)
   - [State Management](#state-management)
   - [UI Components](#ui-components)
   - [Layouts](#layouts)
4. [Advanced Features](#advanced-features)
   - [API Integration](#api-integration)
   - [Drizzle ORM](#drizzle-orm)
   - [Analytics](#analytics)
   - [Email Integration](#email-integration)
5. [Development Workflow](#development-workflow)
6. [Deployment](#deployment)
7. [Customization](#customization)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jboilerplate.git your-project-name

# Navigate to project directory
cd your-project-name

# Install dependencies
npm install
# OR
yarn install

# Start development server
npm run dev
# OR
yarn dev
```

### Default Credentials

The boilerplate includes three user roles with pre-configured credentials for quick testing:

1. **Superadmin**
   - Email: superadmin@example.com
   - Password: password123

2. **Admin**
   - Email: admin@example.com
   - Password: password123

3. **User**
   - Email: user@example.com
   - Password: password123

## Project Structure

```
src/
├── assets/         # Static assets like images, global CSS
├── components/     # Reusable UI components
│   └── ui/         # Shadcn UI components
├── composables/    # Vue composables (reusable logic)
├── constants/      # Application constants
├── layouts/        # Page layouts
├── lib/           
│   └── db/         # Database related code (Drizzle)
├── locales/        # i18n translation files
├── pages/          # Application pages organized by role
├── plugins/        # Vue plugins
├── router/         # Routing configuration
│   └── routes/     # Route groups by feature/role
├── services/       # API and service layer
├── stores/         # Pinia stores
└── types/          # TypeScript type definitions
```

## Core Features

### Authentication

The boilerplate includes a complete authentication system with:

- User login/logout
- Role-based access control (Superadmin, Admin, User)
- Protected routes
- Auth persistence
- Password reset flow

#### Usage

The authentication system is managed through the auth store:

```typescript
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Login
await authStore.login({ 
  email: "user@example.com", 
  password: "password" 
});

// Check if user is authenticated
if (authStore.isAuthenticated) {
  // Do something
}

// Access user data
const userRole = authStore.user?.user_type;

// Logout
await authStore.logout();
```

#### Protecting Routes

Routes can be protected by role using meta properties:

```typescript
// In your route definition
{
  path: '/admin/dashboard',
  name: 'admin-dashboard',
  component: () => import('@/pages/admin/dashboard/index.vue'),
  meta: {
    requiresAuth: true,
    roles: ['admin'],
    layout: 'dashboard',
    title: 'Admin Dashboard'
  }
}
```

### Internationalization (i18n)

The boilerplate includes Vue I18n for multilingual support.

#### Usage

```typescript
// In your component
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Change language
locale.value = 'es'; // Switch to Spanish

// Use translations in template
<template>
  <p>{{ t('common.welcome') }}</p>
</template>
```

#### Adding New Languages

1. Create a new JSON file in `src/locales/` (e.g., `fr.json`)
2. Add translations matching the structure in existing language files
3. Register the new locale in `src/plugins/i18n.ts`:

```typescript
import fr from '@/locales/fr.json';

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    fr // Add your new locale
  }
});
```

#### Language Switching

The boilerplate includes a `<LanguageSwitcher />` component that can be used to change languages:

```vue
<template>
  <LanguageSwitcher />
</template>

<script setup>
import { LanguageSwitcher } from '@/components/ui/language-switcher';
</script>
```

### Routing & Navigation

The boilerplate uses Vue Router with modular route files organized by feature.

#### Route Structure

Routes are organized in modules:

- `auth-routes.ts`: Authentication-related routes
- `admin-routes.ts`: Admin panel routes
- `user-routes.ts`: Standard user routes
- `public-routes.ts`: Public-facing routes
- `common-routes.ts`: Routes available to all authenticated users

#### Adding New Routes

To add a new route:

1. Identify the appropriate route module file
2. Add your route configuration:

```typescript
// Example: Adding a new admin route
export const adminRoutes: RouteRecordRaw[] = [
  // ... existing routes
  {
    path: '/admin/new-feature',
    name: 'admin-new-feature',
    component: () => import('@/pages/admin/new-feature/index.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      layout: 'dashboard',
      title: 'New Feature'
    }
  }
];
```

#### Layouts

The boilerplate includes several layouts that can be specified in route meta:

- `dashboard`: Main application layout with sidebar
- `auth`: Authentication pages layout
- `blank`: Minimal layout with no navigation
- `forms`: Layout optimized for form pages

```typescript
// Specifying layout in route
{
  meta: {
    layout: 'dashboard'
  }
}
```

### State Management

The boilerplate uses Pinia for state management with several pre-configured stores:

- `useAuthStore`: Authentication state
- `useNavStore`: Navigation and sidebar state
- `useConfigStore`: Application configuration

#### Creating a New Store

```typescript
// src/stores/my-feature.ts
import { defineStore } from 'pinia';

export const useMyFeatureStore = defineStore('myFeature', {
  state: () => ({
    items: [],
    isLoading: false
  }),
  
  getters: {
    itemCount: (state) => state.items.length
  },
  
  actions: {
    async fetchItems() {
      this.isLoading = true;
      try {
        // API call logic
        this.items = await fetchFromAPI();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
```

### UI Components

The boilerplate includes a comprehensive set of UI components based on Shadcn UI.

#### Available Components

- Accordion
- Alert
- Avatar
- Badge
- Button
- Card
- Checkbox
- Data Table
- Date Picker
- Dialog
- Dropdown
- Input
- Select
- Tabs
- Toast
- and many more...

#### Using Components

```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>This is the card content.</p>
    </CardContent>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
</script>
```

#### Data Tables

The boilerplate includes a powerful data table component:

```vue
<template>
  <DataTable
    :columns="columns"
    :data="data"
    :pagination="true"
    :search="true"
  />
</template>

<script setup lang="ts">
import { DataTable } from '@/components/ui/data-table';
import { ref } from 'vue';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  }
];

const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]);
</script>
```

## Advanced Features

### API Integration

The boilerplate includes a service layer for API communication:

```typescript
// Using the API service
import { api } from '@/services/api';

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
await api.put(`/users/${id}`, {
  name: 'John Updated'
});

// DELETE request
await api.delete(`/users/${id}`);
```

### Drizzle ORM

The boilerplate includes Drizzle ORM for database interactions:

#### Database Schema

Schemas are defined in `src/lib/db/schema.ts`:

```typescript
// Example: Adding a new table
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  description: text('description'),
  categoryId: text('category_id').references(() => categories.id)
});
```

#### Database Queries

```typescript
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Select all products
const allProducts = await db.select().from(products);

// Select with filter
const expensiveProducts = await db.select()
  .from(products)
  .where(gt(products.price, 100));

// Insert a new product
await db.insert(products).values({
  id: 'prod-123',
  name: 'New Product',
  price: 99
});
```

### Analytics

The boilerplate includes Umami analytics integration:

```typescript
// Track a custom event
import { useAnalytics } from '@/composables/useAnalytics';

const analytics = useAnalytics();

// Track a page view
analytics.trackPageView('/custom-page');

// Track a custom event
analytics.trackEvent('button_click', {
  button: 'sign_up',
  location: 'header'
});
```

### Email Integration

The boilerplate includes Plunk email integration:

```typescript
// Send an email
import { emailService } from '@/services/email';

await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to our platform',
  template: 'welcome',
  data: {
    name: 'John Doe',
    activationLink: 'https://example.com/activate/token'
  }
});
```

## Development Workflow

### Environment Variables

The boilerplate uses environment variables for configuration:

```
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_PLUNK_API_KEY=your_plunk_api_key
VITE_UMAMI_WEBSITE_ID=your_umami_id
VITE_UMAMI_URL=https://analytics.example.com
```

To use environment variables in your code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Adding New Features

1. **Plan**: Define what components, services, and state you need
2. **Implement**: Create the necessary files following the project structure
3. **Connect**: Wire up your feature to the rest of the application
4. **Test**: Verify functionality across different roles and scenarios

### Best Practices

- Use TypeScript types for everything
- Follow the existing folder structure and naming conventions
- Leverage existing components and services
- Keep components small and focused
- Use Pinia for complex state management
- Create reusable composables for shared logic

## Deployment

The boilerplate includes configuration for different deployment options:

### Docker

```bash
# Build the Docker image
docker build -t your-app-name .

# Run the container
docker run -p 80:80 your-app-name
```

### Vercel

The boilerplate includes a `vercel.json` configuration file for easy deployment to Vercel:

```bash
# Deploy to Vercel
npx vercel
```

## Customization

### Theming

The boilerplate uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          // Add your color variations
        },
        // Add your custom colors
      },
      // Add other theme extensions
    }
  }
};
```

### Branding

Update the following files to customize branding:

- `src/assets/logo/`: Replace logo files
- `src/layouts/auth.vue`: Update logo and branding text
- `src/layouts/dashboard.vue`: Update sidebar logo and app name

## Troubleshooting

### Common Issues

#### Login Screen Not Appearing

If the login screen appears blank:

1. Check for JavaScript errors in the console
2. Verify that the auth layout is correctly referenced in the route meta
3. Ensure all required components are properly imported

#### API Connection Issues

If you're having trouble connecting to your API:

1. Check environment variables in `.env`
2. Verify API URL is correct
3. Check network tab for specific error responses
4. Ensure CORS is properly configured on your API

#### Type Errors

If you encounter TypeScript errors:

1. Make sure all imports have proper paths
2. Check that types are correctly defined in `src/types/`
3. Run `npm run type-check` to verify all types

### Getting Help

If you need further assistance:

1. Check the issue tracker on GitHub
2. Join our community Discord channel
3. Consult the documentation for specific components

---

This guide covers the main features and usage patterns of jBoilerplate. For more detailed information on specific components or advanced use cases, refer to the source code and comments within the codebase.

Happy coding!