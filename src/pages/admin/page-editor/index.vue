<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'vue-sonner';
import { FileCode, Plus, Trash2, Layout, Lock, Maximize, Code2, Wrench } from 'lucide-vue-next';

const router = useRouter();

const pages = ref<any[]>([]);
const allPages = ref<any[]>([]);
const pageEditorPages = ref<Set<string>>(new Set());
const form = ref({
  name: '',
  path: '',
  pathType: 'all', // all, role-based
  selectedRole: 'user',
  layout: 'dashboard'
});

// System pages that cannot be deleted
const systemPages = [
  '/configuration',
  '/admin/page-editor',
  '/admin/menu-editor',
  '/admin/system-status'
];

// Computed properties for categorized pages
const pageEditorCreatedPages = computed(() => {
  return allPages.value.filter(page => pageEditorPages.value.has(page.path));
});

const manuallyCreatedPages = computed(() => {
  return allPages.value.filter(page =>
    !pageEditorPages.value.has(page.path) &&
    !systemPages.includes(page.path)
  );
});

const systemPagesData = computed(() => {
  return allPages.value.filter(page => systemPages.includes(page.path));
});

const layoutOptions = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    description: 'With sidebar navigation and header',
    icon: Layout,
    preview: 'Full application layout with sidebar menu, top header, and content area'
  },
  {
    value: 'auth',
    label: 'Authentication',
    description: 'Clean layout for login/register',
    icon: Lock,
    preview: 'Centered content layout for login, register, and auth pages'
  },
  {
    value: 'blank',
    label: 'Blank',
    description: 'No sidebar or header',
    icon: Maximize,
    preview: 'Full page content with no navigation elements'
  }
];

const roles = ['admin', 'user'];

const finalPath = computed(() => {
  if (!form.value.path) return '';
  const cleanPath = form.value.path.replace(/^\/+/, '');
  if (form.value.pathType === 'all') {
    return `/${cleanPath}`;
  } else {
    return `/${form.value.selectedRole}/${cleanPath}`;
  }
});

const componentPath = computed(() => {
  if (!form.value.path) return '';
  const cleanPath = form.value.path.replace(/^\/+/, '');
  if (form.value.pathType === 'all') {
    return `@/pages/${cleanPath}/index.vue`;
  } else {
    return `@/pages/${form.value.selectedRole}/${cleanPath}/index.vue`;
  }
});

async function loadPages() {
  try {
    // Load Page Editor created pages from database
    const res = await fetch('/api/pages');
    const data = await res.json();
    if (data.success) {
      pages.value = data.pages || [];
      // Store page paths created by Page Editor
      pageEditorPages.value.clear();
      pages.value.forEach(page => {
        pageEditorPages.value.add(page.path);
      });
    }

    // Load all routes from generated-routes.json
    const routesRes = await fetch('/config/generated-routes.json');
    const routes = await routesRes.json();

    // Add static system routes that are defined in code
    const staticSystemRoutes = [
      {
        path: '/configuration',
        name: 'configuration',
        componentPath: '@/pages/configuration.vue',
        meta: { requiresAuth: true, roles: ['admin'], layout: 'dashboard', title: 'System Configuration' }
      },
      {
        path: '/admin/page-editor',
        name: 'admin-page-editor',
        componentPath: '@/pages/admin/page-editor/index.vue',
        meta: { requiresAuth: true, roles: ['admin'], layout: 'dashboard', title: 'Page Editor' }
      },
      {
        path: '/admin/menu-editor',
        name: 'admin-menu-editor',
        componentPath: '@/pages/admin/menu-editor/index.vue',
        meta: { requiresAuth: true, roles: ['admin'], layout: 'dashboard', title: 'Menu Editor' }
      },
      {
        path: '/admin/system-status',
        name: 'admin-system-status',
        componentPath: '@/pages/admin/system-status/index.vue',
        meta: { requiresAuth: true, roles: ['admin'], layout: 'dashboard', title: 'System Status' }
      }
    ];

    // Combine all routes, avoiding duplicates
    const allRoutes = [...routes];
    staticSystemRoutes.forEach(staticRoute => {
      if (!allRoutes.some(r => r.path === staticRoute.path)) {
        allRoutes.push(staticRoute);
      }
    });

    // Map routes to page objects
    allPages.value = allRoutes.map((route: any) => {
      // Determine page type
      let pageType = 'manual';
      if (systemPages.includes(route.path)) {
        pageType = 'system';
      } else if (pageEditorPages.value.has(route.path)) {
        pageType = 'page-editor';
      }

      return {
        id: route.name,
        name: route.meta?.title || route.name,
        path: route.path,
        componentPath: route.componentPath,
        layout: route.meta?.layout || 'dashboard',
        role: route.meta?.roles?.[0] || 'all',
        pageType: pageType
      };
    });

    console.log('Loaded all pages:', allPages.value);
    console.log('Page Editor pages:', Array.from(pageEditorPages.value));
  } catch (e) {
    console.error('Failed to load pages', e);
  }
}

async function createPage() {
  if (!form.value.name || !form.value.path) {
    toast.error('Page name and path are required');
    return;
  }

  const payload = {
    name: form.value.name,
    path: finalPath.value,
    component_path: componentPath.value,
    layout: form.value.layout,
    role: form.value.pathType === 'all' ? 'all' : form.value.selectedRole
  };

  console.log('Creating page with payload:', payload);

  try {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Page creation response:', data);

    if (!data.success) throw new Error(data.error);

    const createdPath = finalPath.value;

    toast.success(`Page created successfully!`);

    await loadPages();

    // Reset form
    form.value = {
      name: '',
      path: '',
      pathType: 'all',
      selectedRole: 'user',
      layout: 'dashboard'
    };

    // Reload the page to pick up new routes, then navigate
    setTimeout(() => {
      window.location.href = createdPath;
    }, 1500);
  } catch (e: any) {
    console.error('Page creation error:', e);
    toast.error(e.message || 'Failed to create page');
  }
}

async function deletePage(id: number) {
  if (!confirm('Delete this page? This will also remove associated routes.')) return;

  try {
    const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    toast.success('Page deleted');
    await loadPages();
  } catch (e: any) {
    toast.error(e.message || 'Failed to delete page');
  }
}

async function deleteManualPage(page: any) {
  if (!confirm(
    `Delete "${page.name}"?\n\nThis will delete:\n- ${page.componentPath}\n- Route entry from generated-routes.json\n\nThis action cannot be undone.`
  )) return;

  try {
    const res = await fetch('/api/pages/delete-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: page.path,
        componentPath: page.componentPath
      })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    toast.success(`Page "${page.name}" deleted successfully`);

    // Reload after a short delay to allow file system changes to complete
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (e: any) {
    toast.error(e.message || 'Failed to delete manual page');
  }
}

onMounted(loadPages);
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Page Editor</h1>
      <p class="text-muted-foreground">Create and manage application pages</p>
    </div>

    <!-- Create Page Form -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FileCode class="h-5 w-5" />
          Create New Page
        </CardTitle>
        <CardDescription>Add a new page to your application</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Page Name <span class="text-destructive">*</span></Label>
            <Input
              v-model="form.name"
              placeholder="e.g., Settings, Dashboard, Profile"
            />
            <p class="text-xs text-muted-foreground">Display name for the page</p>
          </div>

        </div>

        <div class="space-y-3">
          <Label>Layout <span class="text-destructive">*</span></Label>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="layout in layoutOptions"
              :key="layout.value"
              @click="form.layout = layout.value"
              class="relative rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              :class="{ 'border-primary bg-accent/30 border-2': form.layout === layout.value }"
            >
              <div class="text-center space-y-2">
                <component :is="layout.icon" class="h-8 w-8 mx-auto" />
                <div class="font-medium">{{ layout.label }}</div>
                <p class="text-xs text-muted-foreground">{{ layout.description }}</p>
                <div v-if="form.layout === layout.value" class="text-primary text-xs font-semibold">✓ Selected</div>
              </div>
            </div>
          </div>
          <div class="bg-muted/50 rounded-lg p-3 text-sm">
            <span class="font-medium">Preview:</span>
            <span class="text-muted-foreground ml-2">{{ layoutOptions.find(l => l.value === form.layout)?.preview }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <Label>Path Configuration <span class="text-destructive">*</span></Label>

          <RadioGroup v-model="form.pathType">
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label for="all" class="font-normal cursor-pointer">
                Global Path - Accessible to all roles
              </Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="role-based" id="role" />
              <Label for="role" class="font-normal cursor-pointer">
                Role-Based Path - Prefix with role
              </Label>
            </div>
          </RadioGroup>

          <div class="grid md:grid-cols-2 gap-4 pt-2">
            <div v-if="form.pathType === 'role-based'" class="space-y-2">
              <Label>Select Role</Label>
              <Select v-model="form.selectedRole">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="r in roles" :key="r" :value="r">
                    {{ r }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2" :class="{ 'md:col-span-2': form.pathType === 'all' }">
              <Label>Path <span class="text-destructive">*</span></Label>
              <Input
                v-model="form.path"
                placeholder="e.g., settings, profile, help"
              />
            </div>
          </div>

          <!-- Preview -->
          <div v-if="finalPath" class="bg-muted rounded-lg p-4 space-y-2">
            <div class="text-sm">
              <span class="text-muted-foreground">Final URL:</span>
              <code class="ml-2 font-mono font-semibold">{{ finalPath }}</code>
            </div>
            <div class="text-sm">
              <span class="text-muted-foreground">Component:</span>
              <code class="ml-2 font-mono text-xs">{{ componentPath }}</code>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <Button @click="createPage">
            <Plus class="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Page Editor Created Pages -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Wrench class="h-5 w-5" />
          Pages Created by Page Editor
        </CardTitle>
        <CardDescription>
          {{ pageEditorCreatedPages.length }} page(s) created via Page Editor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div
            v-for="page in pageEditorCreatedPages"
            :key="page.id"
            class="flex items-center justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ page.name }}</span>
                <Badge variant="default" class="text-xs">Page Editor</Badge>
              </div>
              <div class="flex items-center gap-3 text-sm text-muted-foreground">
                <code class="bg-muted px-2 py-0.5 rounded text-xs">{{ page.path }}</code>
                <span class="text-xs">{{ page.layout }}</span>
                <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{{ page.role }}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="deletePage(pages.find(p => p.path === page.path)?.id)"
              class="text-destructive hover:text-destructive"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>

          <p v-if="pageEditorCreatedPages.length === 0" class="text-center text-muted-foreground py-8">
            No pages created via Page Editor yet
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Manually Created Pages -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Code2 class="h-5 w-5" />
          Manually Created Pages
        </CardTitle>
        <CardDescription>
          {{ manuallyCreatedPages.length }} page(s) created manually in code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div
            v-for="page in manuallyCreatedPages"
            :key="page.id"
            class="flex items-center justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ page.name }}</span>
                <Badge variant="outline" class="text-xs">Manual</Badge>
              </div>
              <div class="flex flex-col gap-1 text-sm text-muted-foreground">
                <div class="flex items-center gap-3">
                  <code class="bg-muted px-2 py-0.5 rounded text-xs">{{ page.path }}</code>
                  <span class="text-xs">{{ page.layout }}</span>
                  <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{{ page.role }}</span>
                </div>
                <code class="text-xs text-muted-foreground">{{ page.componentPath }}</code>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="deleteManualPage(page)"
              class="text-destructive hover:text-destructive"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>

          <p v-if="manuallyCreatedPages.length === 0" class="text-center text-muted-foreground py-8">
            No manually created pages
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- System Pages (Protected) -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Lock class="h-5 w-5" />
          System Pages
        </CardTitle>
        <CardDescription>
          {{ systemPagesData.length }} protected system page(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div
            v-for="page in systemPagesData"
            :key="page.id"
            class="flex items-center justify-between border rounded-lg p-4 bg-muted/30"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ page.name }}</span>
                <Badge variant="secondary" class="text-xs">System</Badge>
              </div>
              <div class="flex items-center gap-3 text-sm text-muted-foreground">
                <code class="bg-muted px-2 py-0.5 rounded text-xs">{{ page.path }}</code>
                <span class="text-xs">{{ page.layout }}</span>
                <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{{ page.role }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <Lock class="h-4 w-4" />
              <span class="text-xs">Protected</span>
            </div>
          </div>

          <p v-if="systemPagesData.length === 0" class="text-center text-muted-foreground py-8">
            No system pages found
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
