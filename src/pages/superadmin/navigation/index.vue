<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Navigation Editor
        </h1>
        <p class="text-muted-foreground mt-1">
          Customize and manage the application navigation structure
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex items-center gap-2" @click="resetNavigation">
          <RotateCcw class="h-4 w-4" />
          <span>Reset</span>
        </Button>
        <Button size="sm" class="flex items-center gap-2" @click="saveNavigation">
          <Save class="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Menu Structure -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Menu Structure</CardTitle>
          <CardDescription>
            Drag and drop items to reorder. Click on an item to edit it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" @click="showAddCategoryDialog = true">
              <FolderPlus class="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button variant="outline" size="sm" @click="showAddItemDialog = true">
              <FilePlus class="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div class="space-y-4 mt-4">
            <div v-for="(group, groupIndex) in navigationStructure" :key="groupIndex">
              <!-- Category (Navigation Group) -->
              <div 
                class="flex items-center justify-between p-3 bg-muted/40 rounded-md mb-2 cursor-move"
                @click="editCategory(group, groupIndex)"
              >
                <div class="font-medium">{{ group.title }}</div>
                <div class="flex items-center">
                  <Button variant="ghost" size="icon" @click.stop="moveGroup(groupIndex, -1)" :disabled="groupIndex === 0">
                    <ChevronUp class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click.stop="moveGroup(groupIndex, 1)" :disabled="groupIndex === navigationStructure.length - 1">
                    <ChevronDown class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" class="text-destructive" @click.stop="deleteGroup(groupIndex)">
                    <Trash class="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="pl-6 space-y-1">
                <div 
                  v-for="(item, itemIndex) in group.menu" 
                  :key="itemIndex"
                  class="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-move"
                  @click="editMenuItem(item, groupIndex, itemIndex)"
                >
                  <div class="flex items-center">
                    <div class="w-6 h-6 flex items-center justify-center mr-2">
                      <component :is="item.icon" class="h-4 w-4" />
                    </div>
                    <div>
                      <div>{{ item.title }}</div>
                      <div class="text-xs text-muted-foreground">{{ item.url }}</div>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <Button variant="ghost" size="icon" @click.stop="moveMenuItem(groupIndex, itemIndex, -1)" :disabled="itemIndex === 0">
                      <ChevronUp class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" @click.stop="moveMenuItem(groupIndex, itemIndex, 1)" :disabled="itemIndex === group.menu.length - 1">
                      <ChevronDown class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" class="text-destructive" @click.stop="deleteMenuItem(groupIndex, itemIndex)">
                      <Trash class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <!-- Sub Menu Items (if any) -->
                <div 
                  v-for="(item, itemIndex) in group.menu" 
                  :key="`submenu-${itemIndex}`"
                  v-if="item.items && item.items.length > 0"
                  class="pl-6 mt-1 space-y-1"
                >
                  <div
                    v-for="(subItem, subItemIndex) in item.items"
                    :key="subItemIndex"
                    class="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-move"
                    @click="editSubMenuItem(subItem, groupIndex, itemIndex, subItemIndex)"
                  >
                    <div class="flex items-center">
                      <div class="w-6 h-6 flex items-center justify-center mr-2">
                        <component :is="subItem.icon" class="h-4 w-4" />
                      </div>
                      <div>
                        <div>{{ subItem.title }}</div>
                        <div class="text-xs text-muted-foreground">{{ subItem.url }}</div>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <Button variant="ghost" size="icon" @click.stop="moveSubMenuItem(groupIndex, itemIndex, subItemIndex, -1)" :disabled="subItemIndex === 0">
                        <ChevronUp class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" @click.stop="moveSubMenuItem(groupIndex, itemIndex, subItemIndex, 1)" :disabled="subItemIndex === item.items.length - 1">
                        <ChevronDown class="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" class="text-destructive" @click.stop="deleteSubMenuItem(groupIndex, itemIndex, subItemIndex)">
                        <Trash class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Item Editor -->
      <Card>
        <CardHeader>
          <CardTitle>
            {{ getEditorTitle() }}
          </CardTitle>
          <CardDescription>
            {{ getEditorDescription() }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="!editingItem && !editingCategory">
            <div class="py-8 text-center text-muted-foreground">
              Click on a menu item or category to edit it
            </div>
          </div>

          <!-- Menu Item Editor -->
          <div v-if="editingItem" class="space-y-4">
            <div>
              <Label for="item-title">Title</Label>
              <Input id="item-title" v-model="editingItem.title" placeholder="Dashboard" />
            </div>
            <div>
              <Label for="item-url">URL</Label>
              <Input id="item-url" v-model="editingItem.url" placeholder="/dashboard" />
            </div>
            <div>
              <Label>Icon</Label>
              <div class="grid grid-cols-6 gap-2 mt-2 border rounded-md p-2 max-h-[200px] overflow-y-auto">
                <Button 
                  v-for="icon in availableIcons" 
                  :key="icon.name"
                  variant="outline"
                  size="icon"
                  class="h-10 w-10"
                  :class="{ 'ring-2 ring-primary': getIconName(editingItem.icon) === icon.name }"
                  @click="setItemIcon(icon.component)"
                >
                  <component :is="icon.component" class="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Visible to Roles</Label>
              <div class="space-y-2 mt-2">
                <div v-for="role in availableRoles" :key="role.name" class="flex items-center space-x-2">
                  <Checkbox 
                    :id="`role-${role.name}`" 
                    :checked="isItemVisibleToRole(role.name)"
                    @update:checked="toggleItemRoleVisibility(role.name)"
                  />
                  <Label :for="`role-${role.name}`">{{ role.displayName }}</Label>
                </div>
              </div>
            </div>
            <div v-if="isEditingMenuItem && !isEditingSubMenuItem">
              <div class="flex items-center space-x-2">
                <Checkbox 
                  id="has-subitems" 
                  :checked="editingItem.items && editingItem.items.length > 0"
                  @update:checked="toggleHasSubItems"
                />
                <Label for="has-subitems">Has Sub Items</Label>
              </div>
            </div>
          </div>

          <!-- Category Editor -->
          <div v-if="editingCategory" class="space-y-4">
            <div>
              <Label for="category-title">Category Title</Label>
              <Input id="category-title" v-model="editingCategory.title" placeholder="Main" />
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="ghost" @click="cancelEdit">Cancel</Button>
          <Button @click="saveEdit">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Add Category Dialog -->
    <Dialog v-model:open="showAddCategoryDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Add a new navigation category
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div>
            <Label for="new-category-title">Category Title</Label>
            <Input id="new-category-title" v-model="newCategory.title" placeholder="Resources" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAddCategoryDialog = false">Cancel</Button>
          <Button @click="addCategory">Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Menu Item Dialog -->
    <Dialog v-model:open="showAddItemDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Add a new navigation menu item
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div>
            <Label for="new-item-category">Category</Label>
            <Select v-model="newItem.categoryIndex">
              <option 
                v-for="(group, index) in navigationStructure" 
                :key="index" 
                :value="index"
              >
                {{ group.title }}
              </option>
            </Select>
          </div>
          <div>
            <Label for="new-item-title">Title</Label>
            <Input id="new-item-title" v-model="newItem.title" placeholder="Dashboard" />
          </div>
          <div>
            <Label for="new-item-url">URL</Label>
            <Input id="new-item-url" v-model="newItem.url" placeholder="/dashboard" />
          </div>
          <div>
            <Label>Icon</Label>
            <div class="grid grid-cols-6 gap-2 mt-2 border rounded-md p-2 max-h-[200px] overflow-y-auto">
              <Button 
                v-for="icon in availableIcons" 
                :key="icon.name"
                variant="outline"
                size="icon"
                class="h-10 w-10"
                :class="{ 'ring-2 ring-primary': newItem.icon === icon.name }"
                @click="newItem.icon = icon.name"
              >
                <component :is="icon.component" class="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Visible to Roles</Label>
            <div class="space-y-2 mt-2">
              <div v-for="role in availableRoles" :key="role.name" class="flex items-center space-x-2">
                <Checkbox 
                  :id="`new-role-${role.name}`" 
                  :checked="newItem.roles.includes(role.name)"
                  @update:checked="toggleNewItemRole(role.name)"
                />
                <Label :for="`new-role-${role.name}`">{{ role.displayName }}</Label>
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <Checkbox 
                id="new-has-subitems" 
                v-model="newItem.hasSubItems"
              />
              <Label for="new-has-subitems">Add Sub Items Later</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAddItemDialog = false">Cancel</Button>
          <Button @click="addMenuItem">Add Menu Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import { useNavigationStore } from '@/stores/navigation';
import { storeToRefs } from 'pinia';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Save,
  Trash,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  FolderPlus,
  FilePlus,
  LayoutDashboard,
  Home,
  Settings,
  User,
  Users,
  FileText,
  Cog,
  Menu,
  Mail,
  Image,
  Palette,
  Code,
  Search,
  Activity,
  Bell,
  BookOpen,
  Bookmark,
  Calendar,
  Camera,
  Clock,
  Cloud,
  Command,
  CreditCard,
  Database,
  File,
  Folder,
  Globe,
  Heart,
  HelpCircle,
  Info,
  Link,
  Map,
  MessageSquare,
  Music,
  Package,
  Phone,
  PieChart,
  Play,
  Shield,
  ShoppingCart,
  Star,
  Terminal,
  ThumbsUp,
  Video,
} from 'lucide-vue-next';

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminNavigationEditor',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});

// Get navigation store
const navigationStore = useNavigationStore();
const toast = useToast();

// Clone the navigation structure to make it editable
const navigationStructure = ref(JSON.parse(JSON.stringify(navigationStore.navigation)));

// Define interfaces for the navigation structure
interface NavigationItem {
  title: string;
  url: string;
  icon: any; // Component
  isActive: boolean;
  items?: NavigationItem[];
  roles?: string[]; // Added roles for visibility
}

interface NavigationGroup {
  title: string;
  menu: NavigationItem[];
}

// Editor state
const editingItem = ref<NavigationItem | null>(null);
const editingCategory = ref<NavigationGroup | null>(null);
const editingGroupIndex = ref<number | null>(null);
const editingItemIndex = ref<number | null>(null);
const editingSubItemIndex = ref<number | null>(null);
const isEditingMenuItem = ref(false);
const isEditingSubMenuItem = ref(false);

// Dialog state
const showAddCategoryDialog = ref(false);
const showAddItemDialog = ref(false);

// New item state
const newCategory = ref({
  title: '',
});

const newItem = ref({
  title: '',
  url: '',
  icon: 'LayoutDashboard',
  categoryIndex: 0,
  roles: ['superadmin', 'admin', 'user'], // Default visibility to all roles
  hasSubItems: false,
});

// Available icons for selection
const availableIcons = [
  { name: 'LayoutDashboard', component: LayoutDashboard },
  { name: 'Home', component: Home },
  { name: 'Settings', component: Settings },
  { name: 'User', component: User },
  { name: 'Users', component: Users },
  { name: 'FileText', component: FileText },
  { name: 'Cog', component: Cog },
  { name: 'Menu', component: Menu },
  { name: 'Mail', component: Mail },
  { name: 'Image', component: Image },
  { name: 'Palette', component: Palette },
  { name: 'Code', component: Code },
  { name: 'Search', component: Search },
  { name: 'Activity', component: Activity },
  { name: 'Bell', component: Bell },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Bookmark', component: Bookmark },
  { name: 'Calendar', component: Calendar },
  { name: 'Camera', component: Camera },
  { name: 'Clock', component: Clock },
  { name: 'Cloud', component: Cloud },
  { name: 'Command', component: Command },
  { name: 'CreditCard', component: CreditCard },
  { name: 'Database', component: Database },
  { name: 'File', component: File },
  { name: 'Folder', component: Folder },
  { name: 'Globe', component: Globe },
  { name: 'Heart', component: Heart },
  { name: 'HelpCircle', component: HelpCircle },
  { name: 'Info', component: Info },
  { name: 'Link', component: Link },
  { name: 'Map', component: Map },
  { name: 'MessageSquare', component: MessageSquare },
  { name: 'Music', component: Music },
  { name: 'Package', component: Package },
  { name: 'Phone', component: Phone },
  { name: 'PieChart', component: PieChart },
  { name: 'Play', component: Play },
  { name: 'Shield', component: Shield },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Star', component: Star },
  { name: 'Terminal', component: Terminal },
  { name: 'ThumbsUp', component: ThumbsUp },
  { name: 'Video', component: Video },
];

// Available roles
const availableRoles = [
  { name: 'superadmin', displayName: 'Super Admin' },
  { name: 'admin', displayName: 'Admin' },
  { name: 'user', displayName: 'User' },
];

// Editor methods
function getEditorTitle() {
  if (editingItem.value) {
    return isEditingSubMenuItem.value 
      ? 'Edit Sub Menu Item' 
      : 'Edit Menu Item';
  }
  if (editingCategory.value) {
    return 'Edit Category';
  }
  return 'Menu Item Editor';
}

function getEditorDescription() {
  if (editingItem.value) {
    return 'Modify the selected menu item properties';
  }
  if (editingCategory.value) {
    return 'Modify the selected category properties';
  }
  return 'Select an item to edit';
}

function editMenuItem(item: NavigationItem, groupIndex: number, itemIndex: number) {
  editingItem.value = { ...item };
  editingCategory.value = null;
  editingGroupIndex.value = groupIndex;
  editingItemIndex.value = itemIndex;
  editingSubItemIndex.value = null;
  isEditingMenuItem.value = true;
  isEditingSubMenuItem.value = false;
}

function editSubMenuItem(
  item: NavigationItem, 
  groupIndex: number, 
  itemIndex: number, 
  subItemIndex: number
) {
  editingItem.value = { ...item };
  editingCategory.value = null;
  editingGroupIndex.value = groupIndex;
  editingItemIndex.value = itemIndex;
  editingSubItemIndex.value = subItemIndex;
  isEditingMenuItem.value = false;
  isEditingSubMenuItem.value = true;
}

function editCategory(category: NavigationGroup, groupIndex: number) {
  editingCategory.value = { ...category };
  editingItem.value = null;
  editingGroupIndex.value = groupIndex;
  editingItemIndex.value = null;
  editingSubItemIndex.value = null;
  isEditingMenuItem.value = false;
  isEditingSubMenuItem.value = false;
}

function cancelEdit() {
  editingItem.value = null;
  editingCategory.value = null;
  editingGroupIndex.value = null;
  editingItemIndex.value = null;
  editingSubItemIndex.value = null;
  isEditingMenuItem.value = false;
  isEditingSubMenuItem.value = false;
}

function saveEdit() {
  if (editingItem.value && editingGroupIndex.value !== null) {
    // Saving menu item
    if (isEditingMenuItem.value && editingItemIndex.value !== null) {
      navigationStructure.value[editingGroupIndex.value].menu[editingItemIndex.value] = { ...editingItem.value };
      toast.success('Menu item updated successfully');
    }
    // Saving sub menu item
    else if (isEditingSubMenuItem.value && editingItemIndex.value !== null && editingSubItemIndex.value !== null) {
      const parentItem = navigationStructure.value[editingGroupIndex.value].menu[editingItemIndex.value];
      if (parentItem.items) {
        parentItem.items[editingSubItemIndex.value] = { ...editingItem.value };
        toast.success('Sub menu item updated successfully');
      }
    }
  }
  else if (editingCategory.value && editingGroupIndex.value !== null) {
    // Saving category
    navigationStructure.value[editingGroupIndex.value].title = editingCategory.value.title;
    toast.success('Category updated successfully');
  }

  cancelEdit();
}

// Item manipulation methods
function getIconName(iconComponent: any) {
  const match = availableIcons.find(icon => icon.component === iconComponent);
  return match ? match.name : 'LayoutDashboard';
}

function getIconComponent(iconName: string) {
  const match = availableIcons.find(icon => icon.name === iconName);
  return match ? match.component : LayoutDashboard;
}

function setItemIcon(iconComponent: any) {
  if (editingItem.value) {
    editingItem.value.icon = iconComponent;
  }
}

function isItemVisibleToRole(roleName: string) {
  if (!editingItem.value) return false;
  
  // If the item has no roles property, create it with all roles
  if (!editingItem.value.roles) {
    editingItem.value.roles = ['superadmin', 'admin', 'user'];
  }
  
  return editingItem.value.roles.includes(roleName);
}

function toggleItemRoleVisibility(roleName: string) {
  if (!editingItem.value) return;
  
  // Initialize roles array if it doesn't exist
  if (!editingItem.value.roles) {
    editingItem.value.roles = [];
  }
  
  const roles = [...editingItem.value.roles];
  if (roles.includes(roleName)) {
    // Remove role (but ensure at least one role remains)
    if (roles.length > 1) {
      editingItem.value.roles = roles.filter(r => r !== roleName);
    } else {
      toast.error('Item must be visible to at least one role');
    }
  } else {
    // Add role
    editingItem.value.roles.push(roleName);
  }
}

function toggleHasSubItems(hasSubItems: boolean) {
  if (!editingItem.value) return;
  
  if (hasSubItems) {
    if (!editingItem.value.items) {
      editingItem.value.items = [];
    }
  } else {
    if (editingItem.value.items && editingItem.value.items.length > 0) {
      if (confirm('This will remove all sub items. Are you sure?')) {
        editingItem.value.items = undefined;
      } else {
        return;
      }
    } else {
      editingItem.value.items = undefined;
    }
  }
}

function toggleNewItemRole(roleName: string) {
  const roles = [...newItem.value.roles];
  if (roles.includes(roleName)) {
    // Remove role (but ensure at least one role remains)
    if (roles.length > 1) {
      newItem.value.roles = roles.filter(r => r !== roleName);
    } else {
      toast.error('Item must be visible to at least one role');
    }
  } else {
    // Add role
    newItem.value.roles.push(roleName);
  }
}

// Category and item movement methods
function moveGroup(groupIndex: number, direction: number) {
  if (groupIndex + direction < 0 || groupIndex + direction >= navigationStructure.value.length) {
    return;
  }
  
  const groups = [...navigationStructure.value];
  const temp = groups[groupIndex];
  groups[groupIndex] = groups[groupIndex + direction];
  groups[groupIndex + direction] = temp;
  navigationStructure.value = groups;
}

function moveMenuItem(groupIndex: number, itemIndex: number, direction: number) {
  const group = navigationStructure.value[groupIndex];
  if (itemIndex + direction < 0 || itemIndex + direction >= group.menu.length) {
    return;
  }
  
  const items = [...group.menu];
  const temp = items[itemIndex];
  items[itemIndex] = items[itemIndex + direction];
  items[itemIndex + direction] = temp;
  group.menu = items;
}

function moveSubMenuItem(
  groupIndex: number, 
  itemIndex: number, 
  subItemIndex: number, 
  direction: number
) {
  const item = navigationStructure.value[groupIndex].menu[itemIndex];
  if (!item.items) return;
  
  if (subItemIndex + direction < 0 || subItemIndex + direction >= item.items.length) {
    return;
  }
  
  const subItems = [...item.items];
  const temp = subItems[subItemIndex];
  subItems[subItemIndex] = subItems[subItemIndex + direction];
  subItems[subItemIndex + direction] = temp;
  item.items = subItems;
}

// Deletion methods
function deleteGroup(groupIndex: number) {
  if (confirm('Are you sure you want to delete this category and all its items?')) {
    navigationStructure.value.splice(groupIndex, 1);
    toast.success('Category deleted successfully');
  }
}

function deleteMenuItem(groupIndex: number, itemIndex: number) {
  if (confirm('Are you sure you want to delete this menu item?')) {
    navigationStructure.value[groupIndex].menu.splice(itemIndex, 1);
    toast.success('Menu item deleted successfully');
  }
}

function deleteSubMenuItem(groupIndex: number, itemIndex: number, subItemIndex: number) {
  const item = navigationStructure.value[groupIndex].menu[itemIndex];
  if (!item.items) return;
  
  if (confirm('Are you sure you want to delete this sub menu item?')) {
    item.items.splice(subItemIndex, 1);
    
    // If no more sub items, remove the items array
    if (item.items.length === 0) {
      item.items = undefined;
    }
    
    toast.success('Sub menu item deleted successfully');
  }
}

// Add methods
function addCategory() {
  if (!newCategory.value.title) {
    toast.error('Category title is required');
    return;
  }
  
  navigationStructure.value.push({
    title: newCategory.value.title,
    menu: []
  });
  
  // Reset form and close dialog
  newCategory.value.title = '';
  showAddCategoryDialog.value = false;
  
  toast.success('Category added successfully');
}

function addMenuItem() {
  if (!newItem.value.title || !newItem.value.url) {
    toast.error('Title and URL are required');
    return;
  }
  
  const categoryIndex = newItem.value.categoryIndex;
  if (categoryIndex < 0 || categoryIndex >= navigationStructure.value.length) {
    toast.error('Invalid category');
    return;
  }
  
  const iconComponent = getIconComponent(newItem.value.icon);
  
  const newMenuItem: NavigationItem = {
    title: newItem.value.title,
    url: newItem.value.url,
    icon: iconComponent,
    isActive: false,
    roles: [...newItem.value.roles]
  };
  
  if (newItem.value.hasSubItems) {
    newMenuItem.items = [];
  }
  
  navigationStructure.value[categoryIndex].menu.push(newMenuItem);
  
  // Reset form and close dialog
  newItem.value = {
    title: '',
    url: '',
    icon: 'LayoutDashboard',
    categoryIndex: 0,
    roles: ['superadmin', 'admin', 'user'],
    hasSubItems: false
  };
  showAddItemDialog.value = false;
  
  toast.success('Menu item added successfully');
}

// Save/Reset methods
function saveNavigation() {
  if (confirm('Are you sure you want to save these navigation changes? This will affect all users.')) {
    // In a real implementation, this would call an API to save the navigation
    // For now, we'll just show a success message
    toast.success('Navigation saved successfully');
  }
}

function resetNavigation() {
  if (confirm('Are you sure you want to reset the navigation to its original state? All changes will be lost.')) {
    navigationStructure.value = JSON.parse(JSON.stringify(navigationStore.navigation));
    toast.success('Navigation reset to default');
  }
}
</script> 