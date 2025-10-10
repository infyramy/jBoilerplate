# jBoilerplate Migration Plan

## Context and Goals

This document is intended to guide the transformation of the current PCRM (Photography Client Relationship Management) codebase into a reusable Vue 3 boilerplate template called "jBoilerplate". The original codebase contains a functional application built with Vue 3, TypeScript, and Shadcn UI components, but includes business-specific functionality that needs to be generalized for reuse across projects.

### Original Project Overview
- **Current State**: A Vue 3 + TypeScript application with Shadcn UI components
- **Business Logic**: Contains photography studio management features (photographers, clients, forms, etc.)
- **UI Components**: Extensive set of UI components in src/components/ui/

### jBoilerplate Goals
1. **Create a clean foundation** for new Vue 3 projects
2. **Remove business-specific code** while preserving the core architecture
3. **Implement missing features**:
   - Internationalization (i18n)
   - Drizzle ORM integration
   - Plunk email integration
   - Cursor AI IDE support
   - Umami analytics
   - Enhanced admin and superadmin UI templates

### For Cursor AI Implementation
This migration plan is structured to be implemented with Cursor AI assistance. The plan:
- Provides detailed code examples for each phase
- Breaks down complex tasks into manageable steps
- Includes specific file paths and implementation details
- Maintains a logical progression from cleanup to new feature implementation

Follow this plan phase by phase, and reference the code examples as implementation guidelines. Cursor AI should be used to generate the actual implementation code based on the patterns and examples provided in this document.

---

This document outlines a comprehensive plan to transform the current PCRM codebase into a reusable jBoilerplate template. The plan is organized in phases to ensure a structured approach while maintaining existing functionality and implementing missing features.

## Phase 1: Assessment and Cleanup

### 1.1 Identify and Remove Non-Boilerplate Files

- **Business Logic Cleanup**
  - [x] Remove business-specific components in `src/components/client/`, `src/components/projects/`, `src/components/forms/`
  - [x] Remove business-specific pages:
    - All pages in `src/pages/affiliate/`
    - All pages in `src/pages/photographer/`
    - All pages in `src/pages/studio/`
    - Specific client pages that contain business logic
  - [x] Remove business-specific stores (retain auth and navigation stores)
  - [x] Remove business-specific services (keep core API services)

- **Clean Mock Data**
  - [x] Remove or generalize mock data in `src/constants/`
  - [x] Clean up example users in auth store
  - [x] Remove business-specific mock responses

### 1.2 Keep Fundamental Structure

- **Core Files to Retain**
  - [x] Keep core UI components in `src/components/ui/`
  - [x] Keep layout components in `src/layouts/`
  - [x] Keep router structure in `src/router/`
  - [x] Keep core stores (auth, navigation)
  - [x] Keep API service structure in `src/services/api.ts`
  - [x] Keep configuration files (vite.config.ts, tsconfig.json, etc.)

## Phase 2: Strengthen Foundation

### 2.1 Improve TypeScript Configuration

- [ ] Update `tsconfig.json` to ensure strict type checking
- [ ] Create comprehensive interface definitions in `src/types/`
- [ ] Add proper type annotations throughout the codebase

### 2.2 Enhance API Service Layer

- [ ] Refactor `src/services/api.ts` to handle different environments
- [ ] Implement proper error handling and logging
- [ ] Add request/response interceptors
- [ ] Create a more robust token refresh mechanism

```typescript
// src/services/api.ts improvements - minimal example
import { ofetch } from "ofetch";
import { useAuthStore } from "@/stores/auth";

// Environment configuration
const environments = {
  development: "http://localhost:3000/api",
  staging: "https://staging-api.example.com",
  production: "https://api.example.com",
};

// Get API URL based on environment
const getApiUrl = () => {
  const env = import.meta.env.MODE || "development";
  return environments[env as keyof typeof environments] || environments.development;
};

// Core API functionality would be implemented here
```

### 2.3 Improve Authentication System

- [ ] Refactor auth store to use more secure token storage
- [ ] Implement HTTP-only cookie approach for tokens
- [ ] Add CSRF protection
- [ ] Create a more robust role-based access system

### 2.4 Standardize Routing Structure

- [ ] Reorganize routes into logical groups
- [ ] Implement more granular route guards
- [ ] Add route meta for better organization

## Phase 3: Implement Missing Core Features

### 3.1 Add Internationalization (i18n)

- [x] Install and configure vue-i18n
- [x] Create language files structure
- [x] Implement language switching mechanism
- [x] Add i18n directive to templates

```typescript
// src/plugins/i18n.ts - minimal example
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
});
```

### 3.2 Integrate Drizzle ORM

- [x] Install Drizzle ORM and dependencies
- [x] Create database schema definitions
- [x] Implement database connection
- [x] Create repository pattern for data access

### 3.3 Set Up Plunk Email Integration

- [x] Create email service module
- [x] Implement email templates
- [x] Add email sending functionality

### 3.4 Implement Umami Analytics

- [x] Add Umami script to index.html
- [x] Create analytics service for tracking events
- [x] Implement page view tracking

### 3.5 Add Cursor AI IDE Support

- [x] Implement Cursor AI IDE integration
- [x] Create project rules file for Cursor
- [x] Add Cursor-specific documentation
- [x] Configure code snippets for Cursor assistance

### 3.6 Enhanced API with HONO Integration

- [x] Replace direct ofetch calls with HONO client
- [x] Implement unified API client with middleware support
- [x] Add robust error handling and logging
- [x] Create type-safe API endpoints

## Phase 4: Enhance superAdmin UI

### 4.1 Create Core Admin Templates

- [ ] Implement standardized admin layout with sidebar, header, and content areas
- [ ] Create reusable superadmin components (data tables, forms, filters)
- [ ] Develop superadmin dashboard template
- [ ] Design consistent UI patterns for all admin views

### 4.2 Implement Admin Dashboard

- [ ] Create dashboard widgets system with drag-and-drop capability
- [ ] Implement stats cards with real-time updates
- [ ] Add configurable dashboard layout with preferences saving
- [ ] Create chart components for data visualization
- [ ] Add activity feed and system notifications

### 4.3 Create SuperAdmin Module

- [ ] Implement system-wide settings management
- [ ] Create tenant management for multi-tenant setup
- [ ] Add system health monitoring dashboard
- [ ] Implement system logs viewer
- [ ] Create backup and restore functionality

### 4.4 Create User Management Module

- [ ] Implement user listing with advanced filtering and pagination
- [ ] Create comprehensive user edit/create forms with validation
- [ ] Add role management with fine-grained permissions
- [ ] Implement user activity tracking and audit logs
- [ ] Add user impersonation for troubleshooting
- [ ] Create bulk user operations (import/export)

## Phase 5: Add Environment Configuration

### 5.1 Set Up Environment Variables

- [x] Create `.env.example` file
- [x] Implement environment-specific configurations
- [x] Add documentation for environment setup

```
# .env.example - minimal example
VITE_API_URL=http://localhost:3000/api
VITE_PLUNK_API_KEY=your_plunk_api_key
VITE_UMAMI_WEBSITE_ID=your_umami_id
VITE_UMAMI_URL=https://analytics.example.com
```

### 5.2 Create Configuration Service

- [x] Implement centralized configuration management
- [x] Add runtime configuration options
- [x] Create feature flag system


## Phase 7: Performance Optimization

### 7.1 Implement Code Splitting

- [ ] Configure route-based code splitting in Vue Router
- [ ] Implement dynamic imports for large components and modules
- [ ] Set up Webpack/Vite chunk naming strategy
- [ ] Create async component loading states with fallbacks
- [ ] Add prefetching for critical routes

### 7.2 Add Asset Optimization

- [ ] Configure Vite image optimization plugins
- [ ] Implement responsive images with srcset
- [ ] Create image component with lazy loading
- [ ] Set up font loading optimization with preconnect and font-display
- [ ] Implement icon system with SVG sprites
- [ ] Add automatic image compression in build pipeline

### 7.3 Implement Caching Strategies

- [ ] Set up API response caching with configurable TTL
- [ ] Implement memory and local storage caching strategy
- [ ] Create request deduplication for parallel requests
- [ ] Add service worker for offline assets caching
- [ ] Implement optimistic UI updates with cache integration
- [ ] Create cache invalidation mechanism for data mutations

## Phase 8: Security Enhancements

### 8.1 Implement CSRF Protection

- [ ] Generate and manage CSRF tokens in client-side state
- [ ] Add automatic CSRF token inclusion in all API requests
- [ ] Create CSRF validation middleware for the API
- [ ] Implement token rotation and expiration strategy
- [ ] Add CSRF headers to forms and AJAX requests

### 8.2 Add Input Sanitization

- [ ] Create client-side input sanitization utility
- [ ] Implement DOMPurify for HTML content sanitization
- [ ] Add XSS protection directives for Vue templates
- [ ] Implement secure form field components with built-in sanitization
- [ ] Create input validation with sanitization rules
- [ ] Add Content Security Policy (CSP) headers configuration

### 8.3 Enhance Authentication Security

- [ ] Implement secure password policy with zxcvbn strength validation
- [ ] Create two-factor authentication with TOTP (Time-based One-Time Password)
- [ ] Implement login attempt limiting with exponential backoff
- [ ] Add device tracking and suspicious login detection
- [ ] Create session management with idle timeout and forced re-authentication
- [ ] Implement secure password reset flow with expiring tokens

## Phase 10: jBoilerplate Packaging

### 10.1 Create CLI Tool

- [ ] Build a scaffolding CLI using Commander.js and Inquirer like nextjs install npx wow
- [ ] Create template selection mechanism with previews
- [ ] Add validation for project names and paths
- [ ] Implement dependency management and installation
- [ ] Create progress tracking and error handling
- [ ] Add interactive help and documentation

### 10.2 Template Customization

- [ ] Create variable substitution engine for template files
- [ ] Implement conditional file and code inclusion
- [ ] Design template extension system for plugins
- [ ] Add project naming and path sanitization
- [ ] Add feature flags for optional components
- [ ] Implement post-installation hooks for additional setup

### 10.3 Final Release

- [ ] Package CLI tool for npm distribution
- [ ] Create comprehensive README with usage examples
- [ ] Implement package versioning with semantic release
- [ ] Set up telemetry for usage tracking (opt-in)

### Phase 11: Create Comprehensive Documentation

- [ ] Write setup and installation guide
- [ ] Document component API
- [ ] Create usage examples
- [ ] Add architecture documentation


## Conclusion

This migration plan provides a structured approach to transform the current PCRM codebase into a reusable jBoilerplate. By following this plan phase by phase, you will create a solid foundation for future projects while implementing all required features and maintaining the existing functionality.

Each phase builds upon the previous ones, ensuring that the final boilerplate is comprehensive, well-documented, and ready for use in new projects. The plan emphasizes best practices in terms of security, performance, and code organization, resulting in a high-quality boilerplate that can be used as a starting point for various Vue 3 applications.

## Working with Cursor AI

This migration plan is designed to be implemented with the assistance of Cursor AI. Here are specific guidelines for using Cursor AI effectively throughout this project:

### Setup for Cursor AI

1. **Project Rules File**: The `.cursor/rules.json` file outlined in Phase 3.5 should be implemented first to set coding standards.
2. **Use Project Structure**: Reference the existing project structure when asking Cursor AI to generate code.
3. **Incremental Implementation**: Work through each phase sequentially, asking Cursor AI to implement specific tasks within each phase.

### Effective Prompts for Cursor AI

When working with Cursor AI on this project, use these prompt patterns for best results:

1. **Task-based Prompts**: 
   ```
   Implement the Drizzle ORM integration as described in Phase 3.2 of the migration plan. 
   Start by creating the schema.ts file as shown in the example.
   ```

2. **Continuation Prompts**: 
   ```
   Now that we've implemented the schema, let's create the database connection file as shown in the plan.
   ```

3. **Customization Prompts**: 
   ```
   The migration plan shows an example implementation for the user table schema. Based on this pattern, 
   create additional schemas for projects and settings.
   ```

4. **Review Prompts**: 
   ```
   Review this implementation of the admin dashboard against the specifications in Phase 4.2. 
   Suggest any improvements or missing features.
   ```

### Implementation Strategy

1. Begin each phase by having Cursor AI review the relevant section of the plan
2. Ask Cursor AI to create a checklist of files to modify or create
3. Implement each file one by one, showing the relevant example from the plan
4. After completing a component or feature, ask Cursor AI to review for best practices
5. Use the plan's code examples as reference but encourage Cursor AI to adapt them to your specific requirements

By following this structured approach with Cursor AI, you'll be able to efficiently implement the jBoilerplate while maintaining high code quality and adherence to the plan.