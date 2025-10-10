<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Rocket, Code, Zap, AlertCircle, PlayCircle } from 'lucide-vue-next';
import { useSystemConfigStore } from '@/stores/system-config';

const systemConfigStore = useSystemConfigStore();
</script>

<template>
  <div class="container mx-auto max-w-7xl space-y-8 p-6">
    <!-- Hero Header -->
    <div class="space-y-3 text-center">
      <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Build Faster, Ship Smarter
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        Everything you need to go from idea to production with {{ systemConfigStore.config.systemName }}
      </p>
    </div>

    <Separator />

    <!-- Vertical Tab Navigation -->
    <Tabs default-value="start" class="grid lg:grid-cols-[180px_1fr] gap-8">
      <TabsList class="flex flex-col h-fit space-y-2 bg-transparent">
        <TabsTrigger value="start" class="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <PlayCircle class="h-4 w-4" />
          <span>Start Here</span>
        </TabsTrigger>
        <TabsTrigger value="develop" class="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Code class="h-4 w-4" />
          <span>Development</span>
        </TabsTrigger>
        <TabsTrigger value="build" class="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Zap class="h-4 w-4" />
          <span>Architecture</span>
        </TabsTrigger>
        <TabsTrigger value="ship" class="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Rocket class="h-4 w-4" />
          <span>Deploy</span>
        </TabsTrigger>
        <TabsTrigger value="help" class="w-full justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <AlertCircle class="h-4 w-4" />
          <span>Troubleshoot</span>
        </TabsTrigger>
      </TabsList>

      <!-- Start Here Tab -->
      <TabsContent value="start" class="space-y-6 mt-0">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">Welcome Aboard</h2>
          <p class="text-muted-foreground">Get your development environment up and running in 3 minutes</p>
        </div>

        <!-- Quick Start Cards -->
        <div class="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <CardHeader>
              <div class="text-3xl font-bold text-primary">01</div>
              <CardTitle class="text-lg">Install</CardTitle>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-3 rounded text-xs font-mono"><code>pnpm install</code></pre>
              <p class="text-xs text-muted-foreground mt-2">Installs all dependencies in seconds</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <CardHeader>
              <div class="text-3xl font-bold text-primary">02</div>
              <CardTitle class="text-lg">Configure</CardTitle>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-3 rounded text-xs font-mono"><code>cp .env.example .env</code></pre>
              <p class="text-xs text-muted-foreground mt-2">Set your database credentials</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <CardHeader>
              <div class="text-3xl font-bold text-primary">03</div>
              <CardTitle class="text-lg">Launch</CardTitle>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-3 rounded text-xs font-mono"><code>pnpm dev</code></pre>
              <p class="text-xs text-muted-foreground mt-2">Opens at localhost:3001</p>
            </CardContent>
          </Card>
        </div>

        <!-- What's Included -->
        <Card>
          <CardHeader>
            <CardTitle>What You Get Out of the Box</CardTitle>
            <CardDescription>Production-ready features to accelerate your development</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="flex gap-3 items-start">
                <div class="rounded-full bg-green-500/10 p-2 mt-0.5">
                  <div class="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div class="font-medium">Authentication & RBAC</div>
                  <p class="text-sm text-muted-foreground">Secure login with role-based access control. Admin and user roles pre-configured.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <div class="rounded-full bg-blue-500/10 p-2 mt-0.5">
                  <div class="h-2 w-2 rounded-full bg-blue-500" />
                </div>
                <div>
                  <div class="font-medium">Beautiful UI Components</div>
                  <p class="text-sm text-muted-foreground">Shadcn UI library with dark mode, themes, and full accessibility support.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <div class="rounded-full bg-purple-500/10 p-2 mt-0.5">
                  <div class="h-2 w-2 rounded-full bg-purple-500" />
                </div>
                <div>
                  <div class="font-medium">Type-Safe Everything</div>
                  <p class="text-sm text-muted-foreground">Full TypeScript support with Vue 3 Composition API for better DX and fewer bugs.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <div class="rounded-full bg-orange-500/10 p-2 mt-0.5">
                  <div class="h-2 w-2 rounded-full bg-orange-500" />
                </div>
                <div>
                  <div class="font-medium">Database Ready</div>
                  <p class="text-sm text-muted-foreground">Knex.js with migrations, seeds, and support for MySQL, PostgreSQL, SQLite.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <div class="rounded-full bg-pink-500/10 p-2 mt-0.5">
                  <div class="h-2 w-2 rounded-full bg-pink-500" />
                </div>
                <div>
                  <div class="font-medium">Docker Deployment</div>
                  <p class="text-sm text-muted-foreground">Pre-configured for development and production with one command deployment.</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <div class="rounded-full bg-teal-500/10 p-2 mt-0.5">
                  <div class="h-2 w-2 rounded-full bg-teal-500" />
                </div>
                <div>
                  <div class="font-medium">State Management</div>
                  <p class="text-sm text-muted-foreground">Pinia stores for predictable, type-safe state across your application.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Login Credentials -->
        <Alert>
          <BookOpen class="h-4 w-4" />
          <AlertDescription>
            <strong>Test Credentials:</strong> Example users are available in <code>src/constants/example-users.ts</code> for quick testing with different roles.
          </AlertDescription>
        </Alert>
      </TabsContent>

      <!-- Development Tab -->
      <TabsContent value="develop" class="space-y-6 mt-0">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">Development Workflow</h2>
          <p class="text-muted-foreground">Commands and patterns for daily development</p>
        </div>

        <!-- Commands Grid -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Dev Commands -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Core Commands</CardTitle>
              <CardDescription>Your daily development toolkit</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">pnpm dev</code>
                  <Badge variant="secondary">Dev Server</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Start development with hot reload</p>
              </div>
              <Separator />
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">pnpm build</code>
                  <Badge variant="secondary">Production</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Build optimized for deployment</p>
              </div>
              <Separator />
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">pnpm lint</code>
                  <Badge variant="secondary">Quality</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Auto-fix code issues</p>
              </div>
              <Separator />
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">pnpm test:watch</code>
                  <Badge variant="secondary">Testing</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Run tests in watch mode</p>
              </div>
            </CardContent>
          </Card>

          <!-- Database Commands -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Database Operations</CardTitle>
              <CardDescription>Manage your database schema</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">migrate:make</code>
                  <Badge variant="outline">Create</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Generate new migration file</p>
              </div>
              <Separator />
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">migrate:latest</code>
                  <Badge variant="outline">Apply</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Run pending migrations</p>
              </div>
              <Separator />
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">migrate:rollback</code>
                  <Badge variant="outline">Undo</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Revert last migration batch</p>
              </div>
              <Separator />
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <code class="text-xs font-mono">seed:run</code>
                  <Badge variant="outline">Populate</Badge>
                </div>
                <p class="text-xs text-muted-foreground">Insert seed data</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Code Examples -->
        <div class="grid gap-4 lg:grid-cols-2">
          <!-- API Usage -->
          <Card>
            <CardHeader>
              <CardTitle>API Client Usage</CardTitle>
              <CardDescription>Making HTTP requests with built-in auth and caching</CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-4 rounded text-xs overflow-x-auto"><code>import { apiGet, apiPost } from '@/services/api';

// GET with type safety
const users = await apiGet&lt;User[]&gt;('/users');

// POST with auto auth headers
await apiPost('/users', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});</code></pre>
              <p class="text-xs text-muted-foreground mt-3">Auth tokens, caching, and error handling included automatically.</p>
            </CardContent>
          </Card>

          <!-- Auth Patterns -->
          <Card>
            <CardHeader>
              <CardTitle>Authentication Patterns</CardTitle>
              <CardDescription>Role-based access control in components</CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-4 rounded text-xs overflow-x-auto"><code>import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Check roles
if (authStore.hasRole('admin')) {
  // Admin-only logic
}

// Check permissions
if (authStore.hasPermission('users.create')) {
  // Show create button
}</code></pre>
              <p class="text-xs text-muted-foreground mt-3">Route guards automatically handle auth checks via meta fields.</p>
            </CardContent>
          </Card>

          <!-- Component Example -->
          <Card>
            <CardHeader>
              <CardTitle>UI Component Example</CardTitle>
              <CardDescription>Using Shadcn components with TypeScript</CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-4 rounded text-xs overflow-x-auto"><code>&lt;script setup lang="ts"&gt;
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
&lt;/script&gt;

&lt;template&gt;
  &lt;Card&gt;
    &lt;CardContent&gt;
      &lt;Button @click="handleClick"&gt;
        Click Me
      &lt;/Button&gt;
    &lt;/CardContent&gt;
  &lt;/Card&gt;
&lt;/template&gt;</code></pre>
              <p class="text-xs text-muted-foreground mt-3">All components support dark mode and custom themes automatically.</p>
            </CardContent>
          </Card>

          <!-- Database Usage -->
          <Card>
            <CardHeader>
              <CardTitle>Database Queries</CardTitle>
              <CardDescription>Using Knex query builder for type-safe SQL</CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-4 rounded text-xs overflow-x-auto"><code>import { db } from '@/lib/db';

// Query builder
const active = await db('users')
  .where('active', true)
  .select('*');

// Raw queries when needed
await db.raw('SELECT 1');</code></pre>
              <p class="text-xs text-muted-foreground mt-3">Configure database in <code>knexfile.js</code> and <code>.env</code> file.</p>
            </CardContent>
          </Card>
        </div>

        <!-- Environment Variables -->
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
            <CardDescription>All environment variables must have VITE_ prefix to be accessible in client-side code</CardDescription>
          </CardHeader>
          <CardContent>
            <pre class="bg-muted p-4 rounded text-xs overflow-x-auto"><code># Database
VITE_DB_CLIENT=mysql
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=your_user
VITE_DB_PASSWORD=your_password
VITE_DB_NAME=your_database

# API
VITE_API_URL=http://localhost:3000/api</code></pre>
            <Alert class="mt-4">
              <AlertCircle class="h-4 w-4" />
              <AlertDescription>
                Access in code: <code>import.meta.env.VITE_DB_HOST</code> • Restart dev server after changes
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Architecture Tab -->
      <TabsContent value="build" class="space-y-6 mt-0">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">System Architecture</h2>
          <p class="text-muted-foreground">Understanding the structure and patterns</p>
        </div>

        <!-- Tech Stack -->
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>Modern, battle-tested technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div class="space-y-2">
                <Badge className="mb-2">Frontend</Badge>
                <ul class="space-y-1 text-sm">
                  <li><strong>Vue 3.3+</strong> - Composition API</li>
                  <li><strong>TypeScript 5</strong> - Type safety</li>
                  <li><strong>Vite 5.4</strong> - Fast builds</li>
                  <li><strong>Tailwind CSS</strong> - Utility styling</li>
                </ul>
              </div>
              <div class="space-y-2">
                <Badge className="mb-2">State & Routing</Badge>
                <ul class="space-y-1 text-sm">
                  <li><strong>Pinia</strong> - State management</li>
                  <li><strong>Vue Router 4</strong> - SPA routing</li>
                  <li><strong>VueUse</strong> - Composition utils</li>
                </ul>
              </div>
              <div class="space-y-2">
                <Badge className="mb-2">Backend & DB</Badge>
                <ul class="space-y-1 text-sm">
                  <li><strong>Knex.js</strong> - SQL migrations</li>
                  <li><strong>MySQL/PostgreSQL</strong> - Databases</li>
                  <li><strong>Docker</strong> - Containers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Project Structure -->
        <div class="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Folder Structure</CardTitle>
              <CardDescription>Organized by feature and responsibility</CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-4 rounded text-xs overflow-x-auto leading-relaxed"><code>src/
├── components/ui/  # Shadcn components
├── layouts/        # Dashboard, auth layouts
├── pages/          # Route components
│   ├── admin/      # Admin pages
│   └── user/       # User pages
├── router/         # Routes + guards
├── stores/         # Pinia stores
├── services/       # API client
└── lib/            # Database client

migrations/         # SQL migrations
seeds/              # Database seeds
knexfile.js         # DB config</code></pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Configuration</CardTitle>
              <CardDescription>Auth guards and layouts via route meta</CardDescription>
            </CardHeader>
            <CardContent>
              <pre class="bg-muted p-4 rounded text-xs overflow-x-auto"><code>{
  path: '/admin/dashboard',
  component: () => import(
    '@/pages/admin/dashboard.vue'
  ),
  meta: {
    requiresAuth: true,
    roles: ['admin'],
    layout: 'dashboard',
    title: 'Dashboard'
  }
}</code></pre>
              <div class="mt-4 space-y-2">
                <p class="text-xs text-muted-foreground"><strong>requiresAuth:</strong> Redirects to login if not authenticated</p>
                <p class="text-xs text-muted-foreground"><strong>roles:</strong> Array of allowed user roles</p>
                <p class="text-xs text-muted-foreground"><strong>layout:</strong> Wraps page in 'dashboard' or 'auth' layout</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Design Patterns -->
        <Card>
          <CardHeader>
            <CardTitle>Key Design Patterns</CardTitle>
            <CardDescription>Architectural decisions that make the codebase maintainable</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex gap-4">
                <div class="rounded-lg bg-primary/10 p-3 h-fit">
                  <Code class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1">Composition API First</h4>
                  <p class="text-sm text-muted-foreground">All components use script setup with TypeScript for better code organization, reusability, and type inference. No Options API.</p>
                </div>
              </div>
              <Separator />
              <div class="flex gap-4">
                <div class="rounded-lg bg-primary/10 p-3 h-fit">
                  <Zap class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1">Centralized State Management</h4>
                  <p class="text-sm text-muted-foreground">Pinia stores handle global state (auth, config, notifications). Components stay lean by delegating state logic to stores with full TypeScript support.</p>
                </div>
              </div>
              <Separator />
              <div class="flex gap-4">
                <div class="rounded-lg bg-primary/10 p-3 h-fit">
                  <BookOpen class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1">Route-Level Code Splitting</h4>
                  <p class="text-sm text-muted-foreground">Pages are lazy-loaded with dynamic imports. Vite automatically creates optimized chunks for admin, user, and auth sections to minimize initial bundle size.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Deploy Tab -->
      <TabsContent value="ship" class="space-y-6 mt-0">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">Deployment Guide</h2>
          <p class="text-muted-foreground">Get your app to production safely and efficiently</p>
        </div>

        <!-- Deployment Options -->
        <div class="grid gap-4 md:grid-cols-2">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div class="flex items-center justify-between mb-2">
                <CardTitle>Docker Full Stack</CardTitle>
                <Badge>Recommended Dev</Badge>
              </div>
              <CardDescription>App + Database in containers</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <pre class="bg-muted p-3 rounded text-xs font-mono"><code>pnpm run docker:full</code></pre>
              <div class="space-y-2 text-sm">
                <p className="text-muted-foreground">✓ Includes MySQL/PostgreSQL container</p>
                <p className="text-muted-foreground">✓ Perfect for local development</p>
                <p className="text-muted-foreground">✓ Zero database setup required</p>
                <p className="text-muted-foreground">✓ Access at localhost:3000</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20">
            <CardHeader>
              <div class="flex items-center justify-between mb-2">
                <CardTitle>Docker App Only</CardTitle>
                <Badge variant="outline">Recommended Prod</Badge>
              </div>
              <CardDescription>Connect to external database</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <pre class="bg-muted p-3 rounded text-xs font-mono"><code>pnpm run docker:app-only</code></pre>
              <div class="space-y-2 text-sm">
                <p className="text-muted-foreground">✓ Production-ready setup</p>
                <p className="text-muted-foreground">✓ Uses managed database service</p>
                <p className="text-muted-foreground">✓ Configure via .env</p>
                <p className="text-muted-foreground">✓ Better for scaling</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Production Build -->
        <Card>
          <CardHeader>
            <CardTitle>Production Build Process</CardTitle>
            <CardDescription>Optimized assets for deployment</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-3">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                  <h4 class="font-medium">Build Optimized Bundle</h4>
                </div>
                <pre class="bg-muted p-3 rounded text-xs font-mono ml-8"><code>pnpm build</code></pre>
                <p class="text-xs text-muted-foreground mt-2 ml-8">Generates production build in <code>./dist</code> directory with minification, tree-shaking, and code splitting</p>
              </div>
              <Separator />
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                  <h4 class="font-medium">Test Production Build Locally</h4>
                </div>
                <pre class="bg-muted p-3 rounded text-xs font-mono ml-8"><code>pnpm preview</code></pre>
                <p class="text-xs text-muted-foreground mt-2 ml-8">Serves production build locally to verify everything works before deploying</p>
              </div>
              <Separator />
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <div class="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                  <h4 class="font-medium">Deploy to Server</h4>
                </div>
                <p class="text-xs text-muted-foreground ml-8">Serve <code>./dist</code> with nginx, Apache, or any static file server. See <code>DEPLOYMENT.md</code> for platform-specific guides.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Pre-Deploy Checklist -->
        <Card>
          <CardHeader>
            <CardTitle>Pre-Deployment Checklist</CardTitle>
            <CardDescription>Verify these before going live</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="rounded-sm bg-green-500/10 p-1 mt-0.5">
                  <div class="h-3 w-3 rounded-sm bg-green-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Environment variables configured correctly</p>
                  <p class="text-xs text-muted-foreground">All VITE_* variables set for production environment</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-sm bg-green-500/10 p-1 mt-0.5">
                  <div class="h-3 w-3 rounded-sm bg-green-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Database migrations applied</p>
                  <p class="text-xs text-muted-foreground">Run <code>pnpm migrate:latest</code> on production database</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-sm bg-green-500/10 p-1 mt-0.5">
                  <div class="h-3 w-3 rounded-sm bg-green-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">API endpoints tested</p>
                  <p class="text-xs text-muted-foreground">Verify VITE_API_URL points to production backend</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-sm bg-green-500/10 p-1 mt-0.5">
                  <div class="h-3 w-3 rounded-sm bg-green-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">SSL certificates installed</p>
                  <p class="text-xs text-muted-foreground">HTTPS required for production deployment</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="rounded-sm bg-green-500/10 p-1 mt-0.5">
                  <div class="h-3 w-3 rounded-sm bg-green-500" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">Error monitoring configured</p>
                  <p class="text-xs text-muted-foreground">Set up logging and error tracking service</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Rocket class="h-4 w-4" />
          <AlertDescription>
            <strong>Need detailed deployment guides?</strong> Check <code>DEPLOYMENT.md</code> for platform-specific instructions (Vercel, Netlify, AWS, DigitalOcean, etc.)
          </AlertDescription>
        </Alert>
      </TabsContent>

      <!-- Troubleshoot Tab -->
      <TabsContent value="help" class="space-y-6 mt-0">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">Common Issues & Solutions</h2>
          <p class="text-muted-foreground">Quick fixes for the most frequent problems</p>
        </div>

        <!-- Issues Grid -->
        <div class="space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <AlertCircle class="h-5 w-5 text-red-500" />
                Database Connection Failed
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <p class="text-sm text-muted-foreground">Most common causes and how to fix them:</p>
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p class="font-medium">Check .env credentials</p>
                    <p class="text-xs text-muted-foreground">Verify VITE_DB_USER, VITE_DB_PASSWORD, VITE_DB_NAME match your database</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p class="font-medium">Database server not running</p>
                    <p class="text-xs text-muted-foreground">Start MySQL/PostgreSQL service or use Docker: <code>pnpm run docker:full</code></p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p class="font-medium">Database doesn't exist</p>
                    <p class="text-xs text-muted-foreground">Create database manually or let Docker handle it automatically</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <AlertCircle class="h-5 w-5 text-orange-500" />
                API Requests Return 404
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Fix</Badge>
                  <div>
                    <p class="font-medium">Verify VITE_API_URL in .env</p>
                    <p class="text-xs text-muted-foreground">Should point to your backend server (e.g., http://localhost:3000/api)</p>
                    <pre class="bg-muted p-2 rounded text-xs font-mono mt-2"><code>VITE_API_URL=http://localhost:3000/api</code></pre>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Check</Badge>
                  <div>
                    <p class="font-medium">Backend server is running</p>
                    <p class="text-xs text-muted-foreground">Make sure your API server is started and accessible</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <AlertCircle class="h-5 w-5 text-yellow-500" />
                CORS Errors in Browser
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <p class="text-sm text-muted-foreground">Browser blocks requests due to CORS policy</p>
              <div class="bg-muted p-4 rounded text-sm space-y-2">
                <p class="font-medium">Solution: Configure backend CORS</p>
                <p class="text-xs text-muted-foreground">Your backend must allow requests from your frontend origin. Add CORS middleware with your frontend URL (e.g., http://localhost:3001) to the allowed origins list.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <AlertCircle class="h-5 w-5 text-blue-500" />
                Environment Variables Undefined
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Rule</Badge>
                  <div>
                    <p class="font-medium">Must use VITE_ prefix</p>
                    <p class="text-xs text-muted-foreground">Vite only exposes variables starting with VITE_ to client code</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Action</Badge>
                  <div>
                    <p class="font-medium">Restart dev server after .env changes</p>
                    <p class="text-xs text-muted-foreground">Environment variables are loaded at build time, not runtime</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <AlertCircle class="h-5 w-5 text-purple-500" />
                Migrations Not Applied
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <pre class="bg-muted p-3 rounded text-xs font-mono"><code>pnpm run migrate:latest</code></pre>
              <p class="text-sm text-muted-foreground">Ensure knexfile.js has correct database credentials from .env. Migrations run against the database specified in your current NODE_ENV (development/production).</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <AlertCircle class="h-5 w-5 text-teal-500" />
                Port Already in Use
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <p class="text-sm text-muted-foreground">Another process is using port 3001</p>
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Option 1</Badge>
                  <div>
                    <p class="font-medium">Kill the existing process</p>
                    <pre class="bg-muted p-2 rounded text-xs font-mono mt-1"><code>lsof -ti:3001 | xargs kill -9</code></pre>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Option 2</Badge>
                  <div>
                    <p class="font-medium">Change port in vite.config.mts</p>
                    <p class="text-xs text-muted-foreground">Update the port number in server configuration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Additional Resources -->
        <Card>
          <CardHeader>
            <CardTitle>Still Stuck?</CardTitle>
            <CardDescription>Additional resources for help</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="p-3 rounded-lg border">
                <h4 class="font-medium mb-2 flex items-center gap-2">
                  <BookOpen class="h-4 w-4 text-primary" />
                  Documentation
                </h4>
                <ul class="space-y-1 text-xs text-muted-foreground">
                  <li><a href="https://vuejs.org" target="_blank" class="hover:text-primary">Vue 3 Docs</a></li>
                  <li><a href="https://ui.shadcn.com" target="_blank" class="hover:text-primary">Shadcn UI</a></li>
                  <li><a href="https://knexjs.org" target="_blank" class="hover:text-primary">Knex.js</a></li>
                </ul>
              </div>
              <div class="p-3 rounded-lg border">
                <h4 class="font-medium mb-2 flex items-center gap-2">
                  <Code class="h-4 w-4 text-primary" />
                  Project Files
                </h4>
                <ul class="space-y-1 text-xs text-muted-foreground">
                  <li><code>docs/DEPLOYMENT.md</code></li>
                  <li><code>docs/README.md</code></li>
                  <li><code>.env.example</code></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
