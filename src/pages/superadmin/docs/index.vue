<template>
  <div class="container space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-bold text-gradient">jBoilerplate Docs</h1>
        <p class="text-muted-foreground mt-1">Your comprehensive guide to building with jBoilerplate</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="group">
          <FileText class="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
          Export as PDF
        </Button>
        <Button variant="default" size="sm" class="group">
          <span class="mr-2">⭐</span>
          Star on GitHub
        </Button>
      </div>
    </div>

    <div class="flex gap-4 items-center mt-4">
      <Badge variant="outline" class="px-3 py-1 text-xs font-medium">v1.0.0</Badge>
      <div class="flex gap-1">
        <Badge variant="secondary" class="px-3 py-1 text-xs font-medium">Vue 3</Badge>
        <Badge variant="secondary" class="px-3 py-1 text-xs font-medium">TypeScript</Badge>
        <Badge variant="secondary" class="px-3 py-1 text-xs font-medium">Shadcn UI</Badge>
      </div>
    </div>

    <div class="mt-8">
      <Tabs default-value="overview" class="w-full">
        <div class="border-b">
          <TabsList class="w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger 
              v-for="tab in docTabs" 
              :key="tab.id" 
              :value="tab.id"
              class="data-[state=active]:border-primary data-[state=active]:text-primary relative rounded-none border-b-2 border-transparent pb-3 pt-2 font-medium transition-none data-[state=active]:shadow-none"
            >
              <div class="flex items-center">
                <component :is="tab.icon" class="mr-3 h-4 w-4" />
                <span>{{ tab.name }}</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
      
        <!-- Overview Tab -->
        <TabsContent value="overview" class="space-y-6 pt-6 animate-in fade-in-50">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card class="bg-gradient-to-br from-background to-muted col-span-2 overflow-hidden">
              <CardHeader>
                <div class="flex items-center">
                  <div class="mr-4 rounded-full bg-primary/10 p-2">
                    <Sparkles class="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Welcome to jBoilerplate</CardTitle>
                    <CardDescription>
                      A modern, feature-rich Vue 3 boilerplate with everything you need
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-2 gap-8">
                  <div>
                    <h3 class="text-lg font-medium mb-2 flex items-center">
                      <Code2 class="mr-2 h-5 w-5 text-primary" />
                      Technology Stack
                    </h3>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <h4 class="font-medium text-primary">Frontend</h4>
                        <ul class="space-y-1 mt-1">
                          <li class="flex items-center text-sm">
                            <Check class="mr-1 h-3 w-3 text-green-500" />
                            Vue 3 Composition API
                          </li>
                          <li class="flex items-center text-sm">
                            <Check class="mr-1 h-3 w-3 text-green-500" />
                            TypeScript
                          </li>
                          <li class="flex items-center text-sm">
                            <Check class="mr-1 h-3 w-3 text-green-500" />
                            Shadcn UI + TailwindCSS
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 class="font-medium text-primary">Backend</h4>
                        <ul class="space-y-1 mt-1">
                          <li class="flex items-center text-sm">
                            <Check class="mr-1 h-3 w-3 text-green-500" />
                            Drizzle ORM
                          </li>
                          <li class="flex items-center text-sm">
                            <Check class="mr-1 h-3 w-3 text-green-500" />
                            Plunk Email Service
                          </li>
                          <li class="flex items-center text-sm">
                            <Check class="mr-1 h-3 w-3 text-green-500" />
                            Hono + Ofetch API
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium mb-2 flex items-center">
                      <Lightbulb class="mr-2 h-5 w-5 text-primary" />
                      Key Features
                    </h3>
                    <ul class="space-y-1">
                      <li class="flex items-center text-sm">
                        <ArrowRight class="mr-1 h-3 w-3 text-primary" />
                        Comprehensive UI component library
                      </li>
                      <li class="flex items-center text-sm">
                        <ArrowRight class="mr-1 h-3 w-3 text-primary" />
                        Authentication & Role-based access
                      </li>
                      <li class="flex items-center text-sm">
                        <ArrowRight class="mr-1 h-3 w-3 text-primary" />
                        Internationalization (i18n)
                      </li>
                      <li class="flex items-center text-sm">
                        <ArrowRight class="mr-1 h-3 w-3 text-primary" />
                        Dark mode with system preference
                      </li>
                      <li class="flex items-center text-sm">
                        <ArrowRight class="mr-1 h-3 w-3 text-primary" />
                        Optimized for performance
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card class="overflow-hidden">
              <CardHeader class="pb-2">
                <CardTitle class="flex items-center">
                  <Command class="mr-2 h-5 w-5 text-primary" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent class="p-0">
                <div class="bg-secondary p-4 font-mono text-sm">
                  <div class="flex items-center gap-2 text-primary pb-2 border-b border-border mb-2">
                    <Terminal class="h-4 w-4" />
                    <span class="font-medium">Create a new project</span>
                  </div>
                  <div class="space-y-2">
                    <div class="whitespace-nowrap">
                      <span class="text-muted-foreground">$</span> npx jboilerplate create <span class="text-blue-400">my-app</span>
                    </div>
                    <div class="pl-4 text-green-400 text-xs">
                      ✓ Project created successfully
                    </div>
                    <div class="whitespace-nowrap">
                      <span class="text-muted-foreground">$</span> cd <span class="text-blue-400">my-app</span>
                    </div>
                    <div class="whitespace-nowrap">
                      <span class="text-muted-foreground">$</span> npm run dev
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter class="pt-4">
                <Button variant="outline" size="sm" class="w-full group">
                  <ExternalLink class="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  See CLI Documentation
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle class="flex items-center">
                <FolderTree class="mr-2 h-5 w-5 text-primary" />
                Project Structure
              </CardTitle>
              <CardDescription>
                jBoilerplate follows a well-organized structure for better maintainability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="bg-secondary rounded-lg p-4 font-mono text-sm overflow-auto max-h-80">
                <pre class="text-xs">
jboilerplate/
├── public/               <span class="text-primary"># Static assets</span>
├── src/
│   ├── assets/           <span class="text-primary"># Images, fonts, etc.</span>
│   ├── components/       <span class="text-primary"># UI components</span>
│   │   └── ui/           <span class="text-primary"># Shadcn components</span>
│   ├── composables/      <span class="text-primary"># Vue composables</span>
│   ├── constants/        <span class="text-primary"># Application constants</span>
│   ├── layouts/          <span class="text-primary"># Layout components</span>
│   ├── lib/              <span class="text-primary"># Library code</span>
│   │   └── db/           <span class="text-primary"># Database integration</span>
│   ├── locales/          <span class="text-primary"># i18n files</span>
│   ├── pages/            <span class="text-primary"># Page components</span>
│   │   ├── admin/        <span class="text-primary"># Admin pages</span>
│   │   └── superadmin/   <span class="text-primary"># SuperAdmin pages</span>
│   ├── plugins/          <span class="text-primary"># Vue plugins</span>
│   ├── router/           <span class="text-primary"># Vue Router config</span>
│   ├── services/         <span class="text-primary"># Service modules</span>
│   ├── stores/           <span class="text-primary"># Pinia stores</span>
│   └── types/            <span class="text-primary"># TypeScript types</span></pre>
              </div>
            </CardContent>
          </Card>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="flex items-center text-lg">
                  <Rocket class="mr-2 h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div class="flex">
                    <div class="mr-4 flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                      <span class="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 class="font-medium">Prerequisites</h4>
                      <p class="text-sm text-muted-foreground">Node.js v18+, npm or yarn, PostgreSQL</p>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="mr-4 flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                      <span class="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 class="font-medium">Installation</h4>
                      <p class="text-sm text-muted-foreground">Run <code>npx jboilerplate create my-app</code></p>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="mr-4 flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                      <span class="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 class="font-medium">Configuration</h4>
                      <p class="text-sm text-muted-foreground">Update <code>.env</code> with your environment settings</p>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="mr-4 flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                      <span class="text-sm font-semibold">4</span>
                    </div>
                    <div>
                      <h4 class="font-medium">Development</h4>
                      <p class="text-sm text-muted-foreground">Run <code>npm run dev</code> to start development server</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="flex items-center text-lg">
                  <HelpCircle class="mr-2 h-5 w-5 text-primary" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div class="rounded-lg border p-3">
                    <h4 class="flex items-center font-medium">
                      <GithubIcon class="mr-2 h-4 w-4" />
                      GitHub Repository
                    </h4>
                    <p class="text-sm text-muted-foreground mt-1">
                      Open issues, contribute, or explore the code
                    </p>
                    <Button variant="link" size="sm" class="px-0 mt-1">
                      Visit Repository →
                    </Button>
                  </div>
                  <div class="rounded-lg border p-3">
                    <h4 class="flex items-center font-medium">
                      <MessagesSquare class="mr-2 h-4 w-4" />
                      Discord Community
                    </h4>
                    <p class="text-sm text-muted-foreground mt-1">
                      Join our Discord for real-time help and discussions
                    </p>
                    <Button variant="link" size="sm" class="px-0 mt-1">
                      Join Discord →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      
        <!-- Components Tab -->
        <TabsContent value="components" class="pt-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center">
                <Box class="mr-2 h-5 w-5 text-primary" />
                UI Components
              </CardTitle>
              <CardDescription>
                A comprehensive set of accessible, reusable, and composable components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card v-for="component in uiComponents" :key="component.name" class="overflow-hidden">
                  <CardHeader class="p-4">
                    <div class="flex items-center">
                      <div class="mr-3 rounded bg-primary/10 p-2">
                        <component :is="component.icon" class="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle class="text-base">{{ component.name }}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent class="px-4 pb-4 pt-0">
                    <p class="text-sm text-muted-foreground">{{ component.description }}</p>
                    <Button variant="outline" size="sm" class="mt-3 w-full">
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- AI Development Tab -->
        <TabsContent value="ai" class="pt-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center">
                <Bot class="mr-2 h-5 w-5 text-primary" />
                AI Development with Cursor
              </CardTitle>
              <CardDescription>
                Build faster and smarter with AI-assisted development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium mb-2">Introduction to Cursor</h3>
                  <p class="text-muted-foreground">
                    Cursor is an AI-first code editor that helps you code faster and better. With integrated AI assistance, 
                    you can generate code, get explanations, refactor, and more with natural language commands.
                  </p>
                  <div class="mt-3">
                    <Button as="a" href="https://cursor.sh" target="_blank" rel="noopener noreferrer" variant="outline" class="group">
                      <ExternalLink class="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                      Visit Cursor Official Website
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 class="text-lg font-medium mb-2">Cursor Rules for This Project</h3>
                  <p class="text-muted-foreground mb-4">
                    Copy and paste these rules into Cursor to optimize AI assistance for this specific project.
                  </p>
                  
                  <Card class="bg-secondary/50">
                    <CardHeader class="pb-2">
                      <div class="flex justify-between items-center">
                        <CardTitle class="text-base">Cursor Configuration</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          class="h-8 w-8 p-0" 
                          title="Copy to clipboard"
                          @click="copyToClipboard(`You are a senior Laravel developer who writes clean, production-ready PHP code using Laravel 12, AdminLTE, Yajra DataTables, and SweetAlert2. You explain code step-by-step for beginners, write well-structured controllers, migrations, routes, Blade views, and JavaScript logic (including modals and AJAX). 

You always integrate functionality with Laravel best practices, including form validation, PDF generation using DomPDF, server-side DataTables, role-permission control using Spatie, and third-party APIs like Telegram and courier tracking systems.

All your responses include full working code when needed, clear folder paths, and comments for learning. Your goal is to help users build modular and scalable Laravel applications.`)"
                        >
                          <Copy class="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre class="overflow-auto text-xs p-4 rounded-md bg-secondary max-h-60 whitespace-pre-wrap">
You are a senior Laravel developer who writes clean, production-ready PHP code using Laravel 12, AdminLTE, Yajra DataTables, and SweetAlert2. You explain code step-by-step for beginners, write well-structured controllers, migrations, routes, Blade views, and JavaScript logic (including modals and AJAX). 

You always integrate functionality with Laravel best practices, including form validation, PDF generation using DomPDF, server-side DataTables, role-permission control using Spatie, and third-party APIs like Telegram and courier tracking systems.

All your responses include full working code when needed, clear folder paths, and comments for learning. Your goal is to help users build modular and scalable Laravel applications.</pre>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator />
                
                <div>
                  <h3 class="text-lg font-medium mb-2">How to Apply Cursor Rules</h3>
                  <div class="space-y-3">
                    <div class="flex">
                      <div class="mr-3 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                        <span class="text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h4 class="font-medium">Open Cursor Settings</h4>
                        <p class="text-sm text-muted-foreground">Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux) and type "Custom Instructions"</p>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="mr-3 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                        <span class="text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h4 class="font-medium">Paste the Rules</h4>
                        <p class="text-sm text-muted-foreground">Copy the rules above and paste them into the Custom Instructions field</p>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="mr-3 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                        <span class="text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <h4 class="font-medium">Save and Start Using</h4>
                        <p class="text-sm text-muted-foreground">Save your changes and start interacting with the AI using / commands</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 class="text-lg font-medium mb-2">AI Development Workflow</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader class="pb-2">
                        <CardTitle class="text-base">Generation Workflow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul class="space-y-2 text-sm">
                          <li class="flex items-start">
                            <ArrowRight class="mr-2 h-4 w-4 text-primary mt-0.5" />
                            <span>Start with a clear request: "Create a controller for user management with CRUD operations"</span>
                          </li>
                          <li class="flex items-start">
                            <ArrowRight class="mr-2 h-4 w-4 text-primary mt-0.5" />
                            <span>Review the generated code and ask for refinements</span>
                          </li>
                          <li class="flex items-start">
                            <ArrowRight class="mr-2 h-4 w-4 text-primary mt-0.5" />
                            <span>Save the final code to appropriate files</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader class="pb-2">
                        <CardTitle class="text-base">Tips for Better Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul class="space-y-2 text-sm">
                          <li class="flex items-start">
                            <ArrowRight class="mr-2 h-4 w-4 text-primary mt-0.5" />
                            <span>Be specific about framework, versions, and patterns</span>
                          </li>
                          <li class="flex items-start">
                            <ArrowRight class="mr-2 h-4 w-4 text-primary mt-0.5" />
                            <span>Provide context about existing code structure</span>
                          </li>
                          <li class="flex items-start">
                            <ArrowRight class="mr-2 h-4 w-4 text-primary mt-0.5" />
                            <span>Break complex tasks into smaller, focused requests</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <!-- Other tabs content -->
        <TabsContent 
          v-for="tab in docTabs.filter(t => !['overview', 'components', 'ai'].includes(t.id))" 
          :key="tab.id" 
          :value="tab.id" 
          class="pt-6 animate-in fade-in-50"
        >
          <Card>
            <CardContent class="pt-6">
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <component :is="tab.icon" class="mr-3 h-6 w-6 text-primary" />
                {{ tab.name }}
              </h2>
              <p>This tab content will be updated with detailed information about {{ tab.name.toLowerCase() }}.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, FileCode, Box, Database, Server, Mail, Calendar, User, Settings2, Layout, CreditCard, BarChart3, ChevronRight, Sparkles, Check, Code2, Command, Terminal, ExternalLink, Rocket, Lightbulb, ArrowRight, HelpCircle, MessagesSquare, FolderTree, GithubIcon, Bot, Copy } from "lucide-vue-next";
import { onMounted } from "vue";

// Define tabs structure
const docTabs = [
  { id: 'overview', name: 'Overview', icon: Layout },
  { id: 'components', name: 'Components', icon: Box },
  { id: 'features', name: 'Features', icon: Sparkles },
  { id: 'api', name: 'API Integration', icon: FileCode },
  { id: 'database', name: 'Database', icon: Database },
  { id: 'deployment', name: 'Deployment', icon: Server },
  { id: 'cli', name: 'CLI Tool', icon: Terminal },
  { id: 'ai', name: 'AI Development', icon: Bot },
];

// Define UI component list for the documentation
const uiComponents = [
  { name: 'Accordion', path: 'accordion', icon: ChevronRight, description: 'A vertically stacked set of interactive headings.' },
  { name: 'Alert', path: 'alert', icon: FileText, description: 'Displays important messages in a prominent way.' },
  { name: 'Button', path: 'button', icon: Box, description: 'Interactive button with multiple variants and sizes.' },
  { name: 'Card', path: 'card', icon: Layout, description: 'Container for displaying content in a clear layout.' },
  { name: 'Data Table', path: 'data-table', icon: Database, description: 'Advanced table with sorting, filtering, and pagination.' },
  { name: 'Dialog', path: 'dialog', icon: FileCode, description: 'Modal dialog for important content and actions.' },
  { name: 'Form', path: 'form', icon: FileText, description: 'Collection of form components with validation.' },
  { name: 'Calendar', path: 'calendar', icon: Calendar, description: 'Date picker component for selecting dates.' },
  { name: 'Avatar', path: 'avatar', icon: User, description: 'Image component for user avatars with fallback.' },
];

// Function to copy text to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  });
};

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminDocumentation',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});
</script>

<style scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500;
}
</style>
