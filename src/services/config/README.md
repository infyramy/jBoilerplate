# Configuration Service

This service provides centralized access to application configuration, environment variables, and feature flags.

## Usage

### Basic Usage

```typescript
import { configService } from '@/services/config';

// Access environment configuration
const apiUrl = configService.api.url;
const isProduction = configService.isProduction;

// Check feature flags
const isDarkModeEnabled = configService.isFeatureEnabled('darkMode');

// Runtime configuration
configService.setRuntimeConfig('theme', 'dark');
const theme = configService.getRuntimeConfig('theme', 'light'); // 'light' is default if not set
```

### In Vue Components

#### Using Composition API

```typescript
import { inject } from 'vue';
import { ConfigService } from '@/services/config';

export default {
  setup() {
    const config = inject<ConfigService>('config');
    
    // Access config values
    const apiUrl = config?.api.url;
    const isDarkModeEnabled = config?.isFeatureEnabled('darkMode');
    
    return { apiUrl, isDarkModeEnabled };
  }
}
```

#### Using Options API

```typescript
export default {
  mounted() {
    // Access through global properties
    const apiUrl = this.$config.api.url;
    const isDarkModeEnabled = this.$config.isFeatureEnabled('darkMode');
  }
}
```

## Feature Flags

The service provides a feature flag system that can be configured through environment variables:

```
# In .env file
VITE_FEATURE_DARK_MODE=true
VITE_FEATURE_NOTIFICATIONS=false
```

Or toggled at runtime:

```typescript
// Enable a feature
configService.enableFeature('darkMode');

// Disable a feature
configService.disableFeature('notifications');

// Toggle a feature
const isEnabled = configService.toggleFeature('analytics');
```

## Available Configuration

### Environment

- `environment`: Current environment (development, staging, production)
- `isDevelopment`: Boolean check if in development
- `isProduction`: Boolean check if in production

### API

- `api.url`: API base URL
- `api.timeout`: Request timeout in milliseconds
- `api.retries`: Number of retries for failed requests

### Database

- `database.host`: Database host
- `database.port`: Database port
- `database.user`: Database username
- `database.password`: Database password
- `database.name`: Database name

### Email

- `email.plunkApiKey`: Plunk API key
- `email.defaultFromEmail`: Default sender email

### Analytics

- `analytics.umamiWebsiteId`: Umami website ID
- `analytics.umamiUrl`: Umami analytics URL
- `analytics.enabled`: Whether analytics is enabled 