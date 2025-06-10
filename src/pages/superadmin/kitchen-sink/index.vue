<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'vue-sonner';
import ThemeCustomizer from '@/components/ThemeCustomizer.vue';

const showThemeCustomizer = ref(false);
const activeTab = ref('overview');

const toggleThemeCustomizer = () => {
  showThemeCustomizer.value = !showThemeCustomizer.value;
};

const showToast = (type: string) => {
  switch (type) {
    case 'success':
      toast.success('Success message', {
        description: 'This is a success message'
      });
      break;
    case 'error':
      toast.error('Error message', {
        description: 'This is an error message'
      });
      break;
    case 'warning':
      toast.warning('Warning message', {
        description: 'This is a warning message'
      });
      break;
    case 'info':
      toast.info('Info message', {
        description: 'This is an info message'
      });
      break;
    default:
      toast('Default message', {
        description: 'This is a default message'
      });
  }
};

const setTheme = (theme: string) => {
  window.localStorage.setItem('theme', theme);
  window.location.reload();
};

const setLocale = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  window.localStorage.setItem('locale', val);
  window.location.reload();
};
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-bold">Kitchen Sink</h1>
    <p class="text-muted-foreground">
      This page showcases various UI components and features available in the application.
    </p>

    <Tabs v-model:value="activeTab" class="w-full">
      <TabsList class="w-full max-w-2xl mx-auto gap-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
      </TabsList>

      <!-- Overview Tab -->
      <TabsContent value="overview" class="mt-6">
        <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Theme Customizer</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm">Click the button below to open the theme customizer</p>
            </CardContent>
            <CardFooter class="flex justify-end">
              <ThemeCustomizer v-model:open="showThemeCustomizer" />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Display toast notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col gap-2">
                <Button @click="showToast('default')" class="w-full">Default Toast</Button>
                <Button @click="showToast('success')" variant="default" class="w-full bg-green-500 hover:bg-green-600 text-white">Success Toast</Button>
                <Button @click="showToast('error')" variant="destructive" class="w-full">Error Toast</Button>
                <Button @click="showToast('warning')" variant="secondary" class="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Warning Toast</Button>
                <Button @click="showToast('info')" variant="secondary" class="w-full">Info Toast</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Components Demo</CardTitle>
              <CardDescription>Browse other components in their tabs</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm">
                This kitchen sink page demonstrates various UI components and their usage.
                Use the tabs above to explore different component categories.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Components Tab -->
      <TabsContent value="components" class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Button Demo -->
          <Card>
            <CardHeader><CardTitle>Button</CardTitle></CardHeader>
            <CardContent class="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </CardContent>
          </Card>
          <!-- Input Demo -->
          <Card>
            <CardHeader><CardTitle>Input</CardTitle></CardHeader>
            <CardContent>
              <input class="shadcn-input w-full" placeholder="Type here..." />
            </CardContent>
          </Card>
          <!-- Select Demo -->
          <Card>
            <CardHeader><CardTitle>Select</CardTitle></CardHeader>
            <CardContent>
              <select class="shadcn-input w-full">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </CardContent>
          </Card>
          <!-- Checkbox, Radio, Switch -->
          <Card>
            <CardHeader><CardTitle>Checkbox, Radio, Switch</CardTitle></CardHeader>
            <CardContent class="flex flex-col gap-2">
              <label class="flex items-center gap-2"><input type="checkbox" class="shadcn-checkbox" /> Checkbox</label>
              <label class="flex items-center gap-2"><input type="radio" name="demo-radio" class="shadcn-radio" /> Radio</label>
              <label class="flex items-center gap-2"><input type="checkbox" role="switch" class="shadcn-switch" /> Switch</label>
            </CardContent>
          </Card>
          <!-- Badge, Alert, Tooltip -->
          <Card>
            <CardHeader><CardTitle>Badge, Alert, Tooltip</CardTitle></CardHeader>
            <CardContent class="flex flex-col gap-2">
              <span class="shadcn-badge">Badge</span>
              <div class="shadcn-alert shadcn-alert-info">Info Alert</div>
              <div class="shadcn-alert shadcn-alert-warning">Warning Alert</div>
              <div class="shadcn-alert shadcn-alert-success">Success Alert</div>
              <div class="shadcn-alert shadcn-alert-error">Error Alert</div>
              <span class="shadcn-tooltip" title="Tooltip content">Hover me (Tooltip)</span>
            </CardContent>
          </Card>
          <!-- Card, Avatar -->
          <Card>
            <CardHeader><CardTitle>Card & Avatar</CardTitle></CardHeader>
            <CardContent class="flex items-center gap-4">
              <Card class="w-24 h-24 flex items-center justify-center">Mini Card</Card>
              <span class="shadcn-avatar w-10 h-10 rounded-full bg-muted flex items-center justify-center">A</span>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Features Tab -->
      <TabsContent value="features" class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Theme Switcher -->
          <Card>
            <CardHeader><CardTitle>Theme Switcher</CardTitle></CardHeader>
            <CardContent>
              <div class="flex gap-2">
                <Button @click="() => setTheme('light')">Light</Button>
                <Button @click="() => setTheme('dark')">Dark</Button>
                <Button @click="() => setTheme('system')">System</Button>
              </div>
            </CardContent>
          </Card>
          <!-- Language Switcher -->
          <Card>
            <CardHeader><CardTitle>Language Switcher</CardTitle></CardHeader>
            <CardContent>
              <select class="shadcn-input w-full" @change="setLocale">
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </CardContent>
          </Card>
          <!-- Toast Demo -->
          <Card>
            <CardHeader><CardTitle>Toast Notification</CardTitle></CardHeader>
            <CardContent>
              <Button @click="showToast('success')">Show Success Toast</Button>
            </CardContent>
          </Card>
          <!-- Modal/Dialog Demo -->
          <Card>
            <CardHeader><CardTitle>Modal/Dialog</CardTitle></CardHeader>
            <CardContent>
              <Button @click="showThemeCustomizer = true">Open Theme Customizer Modal</Button>
            </CardContent>
          </Card>
          <!-- Skeleton Loader Demo -->
          <Card>
            <CardHeader><CardTitle>Skeleton Loader</CardTitle></CardHeader>
            <CardContent>
              <div class="animate-pulse space-y-2">
                <div class="h-4 bg-muted rounded w-3/4"></div>
                <div class="h-4 bg-muted rounded w-1/2"></div>
                <div class="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Buttons Tab -->
      <TabsContent value="buttons" class="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Different button styles available in the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
              <Button variant="outline" class="gap-2">
                <span>With Icon</span>
                <span class="i-lucide-arrow-right h-4 w-4"></span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Cards Tab -->
      <TabsContent value="cards" class="mt-6">
        <div class="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>A basic card component</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a simple card with header, content, and footer sections.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" class="mr-2">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Card with interactive elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span>Enable feature</span>
                  <Button size="sm" variant="outline">Toggle</Button>
                </div>
                <div class="flex items-center justify-between">
                  <span>Send notifications</span>
                  <Button size="sm" variant="outline">Toggle</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <small class="text-muted-foreground">Last updated: Today</small>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <!-- Alerts Tab -->
      <TabsContent value="alerts" class="mt-6">
        <div class="space-y-4">
          <div class="p-4 bg-primary/10 text-primary border border-primary/20 rounded-md">
            <div class="font-medium">Primary Alert</div>
            <div class="text-sm mt-1">This is a primary alert message.</div>
          </div>
          
          <div class="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
            <div class="font-medium">Destructive Alert</div>
            <div class="text-sm mt-1">This is a destructive alert message.</div>
          </div>
          
          <div class="p-4 bg-warning/10 text-warning-foreground border border-warning/20 rounded-md">
            <div class="font-medium">Warning Alert</div>
            <div class="text-sm mt-1">This is a warning alert message.</div>
          </div>
          
          <div class="p-4 bg-secondary/10 text-secondary-foreground border border-secondary/20 rounded-md">
            <div class="font-medium">Info Alert</div>
            <div class="text-sm mt-1">This is an informational alert message.</div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template> 