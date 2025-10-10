<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'vue-sonner';
import {
  GripVertical, Edit, Save, X, Plus, Folder, FileText,
  LayoutDashboard, Settings, BookOpen, Wrench, Activity,
  Home, Users, Star, Heart, Bell, Calendar, Mail, Phone,
  Camera, Image, Music, Video, Download, Upload, Search,
  Filter, Trash2, Minus, Check, ChevronRight, ChevronLeft,
  ChevronUp, ChevronDown, Menu, Grid, List, Layout, Zap,
  Archive, Bookmark, Tag, Flag, Lock, Unlock, Eye, EyeOff,
  Sun, Moon, Cloud, CloudRain, Database, Server, Code,
  Terminal, Package, Cpu, HardDrive, Wifi, Bluetooth,
  Battery, ShoppingCart, CreditCard, DollarSign, TrendingUp,
  BarChart, PieChart, Award, Target, Gift, Coffee, Book,
  Briefcase, MapPin
} from 'lucide-vue-next';
import IconPicker from './IconPicker.vue';
import { useNavigationStore } from '@/stores/navigation';

// Icon component map for dynamic rendering
const iconMap: Record<string, any> = {
  LayoutDashboard, Settings, BookOpen, Wrench, Activity,
  Home, Users, FileText, Folder, Star, Heart, Bell,
  Calendar, Mail, Phone, Camera, Image, Music, Video,
  Download, Upload, Search, Filter, Edit, Trash2, Plus,
  Minus, Check, X, ChevronRight, ChevronLeft, ChevronUp,
  ChevronDown, Menu, Grid, List, Layout, Zap, Archive,
  Bookmark, Tag, Flag, Lock, Unlock, Eye, EyeOff, Sun,
  Moon, Cloud, CloudRain, Database, Server, Code, Terminal,
  Package, Cpu, HardDrive, Wifi, Bluetooth, Battery,
  ShoppingCart, CreditCard, DollarSign, TrendingUp,
  BarChart, PieChart, Award, Target, Gift, Coffee, Book,
  Briefcase, MapPin
};

const navigationStore = useNavigationStore();

const selectedRole = ref('admin');
const roles = ['admin', 'user'];

// All menu items (categories + items)
const menuStructure = ref<any[]>([]);

const editingId = ref<string | null>(null);
const editForm = ref({ label: '', icon: '', type: '' });

const draggedItem = ref<any>(null);
const dragOverIndex = ref<number | null>(null);

// System pages (protected, cannot be deleted)
const systemPages = [
  'admin-configuration',
  'admin-page-editor',
  'admin-menu-editor',
  'admin-system-status'
];

// Hardcoded static items that should appear in available list
const staticItems = [
  { id: 'admin-home', label: 'Home', path: '/admin/home', icon: 'LayoutDashboard', role: 'admin', type: 'item', pageType: 'static' },
  { id: 'admin-configuration', label: 'Configuration', path: '/configuration', icon: 'Settings', role: 'admin', type: 'item', pageType: 'system', protected: true },
  { id: 'admin-page-editor', label: 'Page Editor', path: '/admin/page-editor', icon: 'BookOpen', role: 'admin', type: 'item', pageType: 'system', protected: true },
  { id: 'admin-menu-editor', label: 'Menu Editor', path: '/admin/menu-editor', icon: 'Wrench', role: 'admin', type: 'item', pageType: 'system', protected: true },
  { id: 'admin-system-status', label: 'System Status', path: '/admin/system-status', icon: 'Activity', role: 'admin', type: 'item', pageType: 'system', protected: true },
  { id: 'user-home', label: 'Home', path: '/user/home', icon: 'LayoutDashboard', role: 'user', type: 'item', pageType: 'static' },
];

// Dynamic pages from page editor
const dynamicPages = ref<any[]>([]);
const pageEditorPages = ref<Set<string>>(new Set());

async function loadDynamicPages() {
  try {
    // First, load pages created by Page Editor from database
    const pagesRes = await fetch('/api/pages');
    const pagesData = await pagesRes.json();

    if (pagesData.success && pagesData.pages) {
      // Store page paths created by Page Editor
      pagesData.pages.forEach((page: any) => {
        pageEditorPages.value.add(page.path);
      });
    }

    // Then load all routes from generated-routes.json
    const response = await fetch('/config/generated-routes.json');
    const routes = await response.json();

    dynamicPages.value = routes
      .filter((route: any) => {
        // Filter out /admin/test if /testpage exists in Page Editor pages
        if (route.path === '/admin/test' && pageEditorPages.value.has('/testpage')) {
          return false;
        }
        return true;
      })
      .map((route: any) => {
        // Determine role(s) for this page
        const roles = route.meta?.roles || [];
        let pageRole = 'admin'; // default

        if (roles.includes('all')) {
          pageRole = 'all'; // Available for all roles
        } else if (roles.includes('user')) {
          pageRole = 'user';
        } else if (roles.includes('admin')) {
          pageRole = 'admin';
        }

        // Determine page type: check if path exists in pageEditorPages
        const pageType = pageEditorPages.value.has(route.path) ? 'page-editor' : 'manual';

        return {
          id: route.name,
          label: route.meta?.title || route.name,
          path: route.path,
          icon: 'FileText', // Default icon for dynamic pages
          role: pageRole,
          type: 'item',
          pageType: pageType,
          componentPath: route.componentPath // Store for deletion purposes
        };
      });

    console.log('Loaded dynamic pages:', dynamicPages.value);
    console.log('Page Editor created pages:', Array.from(pageEditorPages.value));
  } catch (e) {
    console.error('Failed to load dynamic pages:', e);
  }
}

async function loadMenuStructure() {
  try {
    // Load from database
    const res = await fetch(`/api/menu-structure?role=${selectedRole.value}`);
    const data = await res.json();

    console.log('Menu structure API response:', data);

    if (data.success && data.structure && Array.isArray(data.structure) && data.structure.length > 0) {
      console.log('Using saved structure from database');
      menuStructure.value = data.structure;
    } else {
      console.log('No saved structure, creating default');
      // If no structure exists, create default based on current navigation
      if (selectedRole.value === 'admin') {
        menuStructure.value = [
          {
            id: 'cat-main',
            label: 'Main',
            type: 'category',
            order: 0,
            items: [
              { id: 'admin-home', label: 'Home', path: '/admin/home', icon: 'LayoutDashboard', type: 'item', order: 0 }
            ]
          },
          {
            id: 'cat-system',
            label: 'System',
            type: 'category',
            order: 1,
            items: [
              { id: 'admin-configuration', label: 'Configuration', path: '/configuration', icon: 'Settings', type: 'item', order: 0 },
              { id: 'admin-page-editor', label: 'Page Editor', path: '/admin/page-editor', icon: 'BookOpen', type: 'item', order: 1 },
              { id: 'admin-menu-editor', label: 'Menu Editor', path: '/admin/menu-editor', icon: 'Wrench', type: 'item', order: 2 },
              { id: 'admin-system-status', label: 'System Status', path: '/admin/system-status', icon: 'Activity', type: 'item', order: 3 }
            ]
          }
        ];
      } else {
        // User role
        menuStructure.value = [
          {
            id: 'cat-main',
            label: 'Main',
            type: 'category',
            order: 0,
            items: [
              { id: 'user-home', label: 'Home', path: '/user/home', icon: 'LayoutDashboard', type: 'item', order: 0 }
            ]
          }
        ];
      }

      // Auto-save the initial structure
      console.log('Saving initial default structure for', selectedRole.value);
      await saveMenuStructure();
    }

    console.log('Final menu structure loaded:', menuStructure.value);
    console.log('Number of categories:', menuStructure.value.length);
    menuStructure.value.forEach((cat, i) => {
      console.log(`Category ${i}:`, cat.label, `Items:`, cat.items?.length || 0);
    });
  } catch (e) {
    console.error('Failed to load menu structure:', e);
    toast.error('Failed to load menu structure');
  }
}

// Get all items that are already in the menu
const usedItemIds = computed(() => {
  const ids = new Set<string>();
  menuStructure.value.forEach(cat => {
    if (cat.type === 'category' && cat.items) {
      cat.items.forEach((item: any) => ids.add(item.id));
    }
  });
  console.log('Used item IDs:', Array.from(ids));
  return ids;
});

// Available items to add (static + dynamic pages not yet in menu)
const availableItems = computed(() => {
  // Combine static items and dynamic pages
  const allItems = [...staticItems, ...dynamicPages.value];

  // Filter based on role and exclude items already in menu
  const available = allItems.filter(item => {
    // Check if item matches current role or is available for all roles
    const roleMatches = item.role === selectedRole.value || item.role === 'all';
    // Check if item is not already in the menu
    const notUsed = !usedItemIds.value.has(item.id);

    return roleMatches && notUsed;
  });

  console.log('Available items:', available);
  return available;
});

function onDragStart(item: any, source: 'available' | 'menu') {
  draggedItem.value = { ...item, source };
  console.log('Drag start:', draggedItem.value);
}

function onDragOver(e: DragEvent, categoryIndex: number, itemIndex?: number) {
  e.preventDefault();
  dragOverIndex.value = itemIndex !== undefined ? itemIndex : -1;
}

function onDragLeave() {
  dragOverIndex.value = null;
}

async function onDropToCategory(e: DragEvent, categoryIndex: number, itemIndex?: number) {
  e.preventDefault();
  dragOverIndex.value = null;

  if (!draggedItem.value) return;

  const structure = [...menuStructure.value];
  const targetCategory = structure[categoryIndex];

  if (!targetCategory.items) targetCategory.items = [];

  if (draggedItem.value.source === 'available') {
    // Check if item already exists in menu (prevent duplicates)
    const itemExists = structure.some(cat =>
      cat.type === 'category' && cat.items?.some((item: any) => item.id === draggedItem.value.id)
    );

    if (itemExists) {
      toast.error(`${draggedItem.value.label} is already in the menu`);
      draggedItem.value = null;
      return;
    }

    // Adding new item
    const newItem = {
      id: draggedItem.value.id,
      label: draggedItem.value.label,
      path: draggedItem.value.path,
      icon: draggedItem.value.icon,
      type: 'item',
      order: itemIndex !== undefined ? itemIndex : targetCategory.items.length,
      pageType: draggedItem.value.pageType, // Preserve page type
      protected: draggedItem.value.protected, // Preserve protected status
      componentPath: draggedItem.value.componentPath // For deletion
    };

    if (itemIndex !== undefined) {
      targetCategory.items.splice(itemIndex, 0, newItem);
    } else {
      targetCategory.items.push(newItem);
    }

    toast.success(`Added ${newItem.label} to ${targetCategory.label}`);
  } else {
    // Reordering - find and remove from source
    let sourceCategory = null;
    let sourceIndex = -1;

    for (let i = 0; i < structure.length; i++) {
      if (structure[i].type === 'category' && structure[i].items) {
        const idx = structure[i].items.findIndex((it: any) => it.id === draggedItem.value.id);
        if (idx !== -1) {
          sourceCategory = structure[i];
          sourceIndex = idx;
          break;
        }
      }
    }

    if (sourceCategory && sourceIndex !== -1) {
      const [movedItem] = sourceCategory.items.splice(sourceIndex, 1);

      const insertIndex = itemIndex !== undefined ? itemIndex : targetCategory.items.length;
      targetCategory.items.splice(insertIndex, 0, movedItem);

      toast.success('Item reordered');
    }
  }

  menuStructure.value = structure;
  await saveMenuStructure();

  draggedItem.value = null;
}

function removeItem(categoryIndex: number, itemIndex: number) {
  const structure = [...menuStructure.value];
  const item = structure[categoryIndex].items[itemIndex];

  structure[categoryIndex].items.splice(itemIndex, 1);
  menuStructure.value = structure;

  toast.success(`Removed ${item.label}`);
  saveMenuStructure();
}

function startEdit(item: any) {
  editingId.value = item.id;
  editForm.value = {
    label: item.label,
    icon: item.icon || 'FileText',
    type: item.type
  };
}

function cancelEdit() {
  editingId.value = null;
}

function saveEdit(categoryIndex: number, itemIndex?: number) {
  const structure = [...menuStructure.value];

  if (itemIndex !== undefined) {
    structure[categoryIndex].items[itemIndex].label = editForm.value.label;
    structure[categoryIndex].items[itemIndex].icon = editForm.value.icon;
  } else {
    structure[categoryIndex].label = editForm.value.label;
  }

  menuStructure.value = structure;
  editingId.value = null;

  toast.success('Updated');
  saveMenuStructure();
}

function addCategory() {
  const newId = `cat-${Date.now()}`;
  menuStructure.value.push({
    id: newId,
    label: 'New Category',
    type: 'category',
    order: menuStructure.value.length,
    items: []
  });

  // Auto-edit new category
  editingId.value = newId;
  editForm.value = { label: 'New Category', icon: '', type: 'category' };
}

function removeCategory(index: number) {
  if (menuStructure.value[index].items && menuStructure.value[index].items.length > 0) {
    if (!confirm('This category has items. Remove anyway?')) return;
  }

  menuStructure.value.splice(index, 1);
  toast.success('Category removed');
  saveMenuStructure();
}

async function saveMenuStructure() {
  try {
    const payload = {
      role: selectedRole.value,
      structure: menuStructure.value
    };

    console.log('Saving menu structure:', payload);

    const res = await fetch('/api/menu-structure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Save response:', data);

    if (!data.success) throw new Error(data.error);

    console.log('Menu structure saved successfully');

    // Reload navigation to reflect changes in sidebar
    await navigationStore.load();
    console.log('Navigation reloaded');
  } catch (e: any) {
    console.error('Failed to save:', e);
    toast.error('Failed to save menu structure');
  }
}

// Watch for role changes and reload menu structure
watch(selectedRole, async () => {
  await loadMenuStructure();
});

onMounted(async () => {
  await loadDynamicPages();
  await loadMenuStructure();
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-7xl space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Menu Editor</h1>
        <p class="text-muted-foreground">Organize navigation with categories and items</p>
      </div>

      <div class="flex items-center gap-2">
        <Label>Role:</Label>
        <Select v-model="selectedRole" @update:model-value="loadMenuStructure">
          <SelectTrigger class="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="r in roles" :key="r" :value="r">
              {{ r }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Available Items -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Available Items</CardTitle>
          <CardDescription>Drag to add to menu</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="item in availableItems"
              :key="item.id"
              draggable="true"
              @dragstart="onDragStart(item, 'available')"
              class="flex items-center gap-2 border rounded-lg p-3 bg-card hover:bg-accent/50 cursor-grab active:cursor-grabbing"
            >
              <GripVertical class="h-4 w-4 text-muted-foreground" />
              <div class="flex-1 flex items-center gap-2">
                <span class="text-sm">{{ item.label }}</span>
                <Badge v-if="item.pageType === 'system'" variant="secondary" class="text-xs">System</Badge>
                <Badge v-else-if="item.pageType === 'page-editor'" variant="default" class="text-xs">Page Editor</Badge>
                <Badge v-else-if="item.pageType === 'manual'" variant="outline" class="text-xs">Manual</Badge>
              </div>
            </div>

            <p v-if="availableItems.length === 0" class="text-center text-sm text-muted-foreground py-6">
              All items added to menu
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Menu Structure -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-lg">{{ selectedRole }} Menu</CardTitle>
              <CardDescription>Categories and navigation items</CardDescription>
            </div>
            <Button @click="addCategory" size="sm" variant="outline">
              <Plus class="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(category, catIndex) in menuStructure"
              :key="category.id"
              class="border rounded-lg overflow-hidden"
            >
              <!-- Category Header -->
              <div class="bg-muted/30 p-3 border-b flex items-center justify-between">
                <div v-if="editingId !== category.id" class="flex items-center gap-2">
                  <Folder class="h-5 w-5 text-muted-foreground" />
                  <span class="font-medium">{{ category.label }}</span>
                </div>

                <div v-else class="flex items-center gap-2 flex-1">
                  <Input v-model="editForm.label" class="h-8" />
                  <Button size="sm" @click="saveEdit(catIndex)">
                    <Save class="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" @click="cancelEdit">
                    <X class="h-4 w-4" />
                  </Button>
                </div>

                <div v-if="editingId !== category.id" class="flex items-center gap-1">
                  <Button variant="ghost" size="sm" @click="startEdit(category)" class="h-8 w-8 p-0">
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="removeCategory(catIndex)" class="h-8 w-8 p-0 text-destructive">
                    <X class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <!-- Category Items -->
              <div
                class="p-2 min-h-[60px]"
                @dragover="onDragOver($event, catIndex)"
                @drop="onDropToCategory($event, catIndex)"
              >
                <div class="space-y-1">
                  <div
                    v-for="(item, itemIndex) in category.items"
                    :key="item.id"
                    draggable="true"
                    @dragstart="onDragStart(item, 'menu')"
                    @dragover="onDragOver($event, catIndex, itemIndex)"
                    @drop="onDropToCategory($event, catIndex, itemIndex)"
                    class="flex items-center gap-2 p-2 rounded hover:bg-accent/50 cursor-grab active:cursor-grabbing"
                    :class="{ 'bg-accent': dragOverIndex === itemIndex }"
                  >
                    <GripVertical class="h-4 w-4 text-muted-foreground" />

                    <div v-if="editingId !== item.id" class="flex-1 flex items-center gap-2">
                      <component v-if="iconMap[item.icon]" :is="iconMap[item.icon]" class="h-4 w-4" />
                      <span class="text-sm">{{ item.label }}</span>
                      <code class="text-xs text-muted-foreground">{{ item.path }}</code>
                      <Badge v-if="item.pageType === 'system'" variant="secondary" class="text-xs">System</Badge>
                      <Badge v-else-if="item.pageType === 'page-editor'" variant="default" class="text-xs">Page Editor</Badge>
                      <Badge v-else-if="item.pageType === 'manual'" variant="outline" class="text-xs">Manual</Badge>
                    </div>

                    <div v-else class="flex-1 flex items-center gap-2">
                      <Input v-model="editForm.label" class="h-8 flex-1" />
                      <div class="w-48">
                        <IconPicker v-model="editForm.icon" />
                      </div>
                    </div>

                    <div class="flex items-center gap-1">
                      <Button
                        v-if="editingId !== item.id"
                        variant="ghost"
                        size="sm"
                        @click="startEdit(item)"
                        class="h-7 w-7 p-0"
                      >
                        <Edit class="h-3 w-3" />
                      </Button>
                      <Button
                        v-if="editingId === item.id"
                        size="sm"
                        @click="saveEdit(catIndex, itemIndex)"
                        class="h-7 px-2"
                      >
                        <Save class="h-3 w-3" />
                      </Button>
                      <Button
                        v-if="editingId === item.id"
                        variant="ghost"
                        size="sm"
                        @click="cancelEdit"
                        class="h-7 w-7 p-0"
                      >
                        <X class="h-3 w-3" />
                      </Button>
                      <Button
                        v-if="editingId !== item.id"
                        variant="ghost"
                        size="sm"
                        @click="removeItem(catIndex, itemIndex)"
                        class="h-7 w-7 p-0 text-destructive"
                      >
                        <X class="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div
                  v-if="!category.items || category.items.length === 0"
                  class="text-center text-sm text-muted-foreground py-4 border-2 border-dashed rounded"
                >
                  Drag items here
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
