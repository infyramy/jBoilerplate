# Environment Setup Guide

This document provides instructions for setting up environment variables for the jBoilerplate application. The application uses environment variables to configure various aspects of its behavior, such as API endpoints, database connections, and feature flags.

## Getting Started

1. Copy the `.env.example` file to create a new `.env` file:
   ```
   cp .env.example .env
   ```

2. Open the `.env` file in your editor and customize the values as needed.

## Environment Configuration

### App Environment

- `VITE_ENVIRONMENT` - Sets the environment mode ('development', 'staging', or 'production')

### API Configuration

- `VITE_API_URL` - The base URL for API requests
- `VITE_API_TIMEOUT` - Timeout for API requests in milliseconds
- `VITE_API_RETRIES` - Number of times to retry failed API requests

### Database Configuration

- `VITE_DB_HOST` - Database server hostname
- `VITE_DB_PORT` - Database server port
- `VITE_DB_USER` - Database username
- `VITE_DB_PASSWORD` - Database password
- `VITE_DB_NAME` - Database name

### Email Configuration

- `VITE_PLUNK_API_KEY` - Your Plunk API key for email service
- `VITE_DEFAULT_FROM_EMAIL` - Default sender email address

### Analytics Configuration

- `VITE_UMAMI_WEBSITE_ID` - Your Umami website ID for analytics
- `VITE_UMAMI_URL` - The URL of your Umami analytics instance

## Feature Flags

The application uses feature flags to enable or disable certain features. You can toggle these by setting the corresponding environment variable to `true` or `false`:

- `VITE_FEATURE_DARK_MODE` - Enable dark mode
- `VITE_FEATURE_MULTILINGUAL_SUPPORT` - Enable multilingual support
- `VITE_FEATURE_NOTIFICATIONS` - Enable notifications
- `VITE_FEATURE_ANALYTICS` - Enable analytics tracking
- `VITE_FEATURE_ADMIN_DASHBOARD` - Enable admin dashboard
- `VITE_FEATURE_USER_MANAGEMENT` - Enable user management
- `VITE_FEATURE_EMAIL_SERVICE` - Enable email service

## Using the Configuration Service

In your components, you can access the configuration using the provided service:

```typescript
// Using Composition API with inject
import { inject } from 'vue';
import { ConfigService } from '@/services/config';

export default {
  setup() {
    const config = inject<ConfigService>('config');
    
    // Check if a feature is enabled
    const isDarkModeEnabled = config?.isFeatureEnabled('darkMode');
    
    // Get API configuration
    const apiUrl = config?.api.url;
    
    return { isDarkModeEnabled, apiUrl };
  }
};
```

```typescript
// Using Options API with $config
export default {
  mounted() {
    // Check if a feature is enabled
    const isDarkModeEnabled = this.$config.isFeatureEnabled('darkMode');
    
    // Get API configuration
    const apiUrl = this.$config.api.url;
  }
};
```

## Runtime Configuration

The configuration service also supports runtime configuration values, which can be modified during application execution:

```typescript
// Set a runtime configuration value
config.setRuntimeConfig('theme', 'dark');

// Get a runtime configuration value
const theme = config.getRuntimeConfig('theme', 'light'); // 'light' is the default value if not set
```

## Environment-Specific Configurations

For different deployment environments (development, staging, production), you can create environment-specific files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Vite will automatically load the appropriate file based on the `--mode` flag when running or building the application.

Example:
```bash
# Development build
npm run build -- --mode development

# Production build
npm run build -- --mode production
``` 