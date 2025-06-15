<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Roles Management
        </h1>
        <p class="text-muted-foreground mt-1">
          Manage roles and their permissions
        </p>
      </div>
      <div class="flex gap-2">
        <Button size="sm" class="flex items-center gap-2">
          <Plus class="h-4 w-4" />
          <span>Add Role</span>
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Roles List -->
      <Card class="lg:col-span-1">
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
          <CardDescription>
            Select a role to edit its permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="role in roles"
              :key="role.id"
              @click="selectRole(role)"
              class="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
              :class="{ 'bg-muted': selectedRole && selectedRole.id === role.id }"
            >
              <div class="flex items-center gap-3">
                <div class="rounded-full p-1.5" :class="getRoleBadgeColor(role.name)">
                  <Shield class="h-4 w-4" :class="getRoleTextColor(role.name)" />
                </div>
                <div>
                  <div class="font-medium">{{ role.displayName }}</div>
                  <div class="text-xs text-muted-foreground">{{ role.name }}</div>
                </div>
              </div>
              <div>
                <Badge>{{ role.usersCount }} users</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Role Details -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>{{ selectedRole ? `Edit ${selectedRole.displayName} Role` : 'Select a Role' }}</CardTitle>
          <CardDescription>
            {{ selectedRole ? 'Configure role details and permissions' : 'Click on a role to edit its details' }}
          </CardDescription>
        </CardHeader>
        <CardContent v-if="selectedRole">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="users">Assigned Users</TabsTrigger>
            </TabsList>
            <TabsContent value="details" class="space-y-4 pt-4">
              <div class="space-y-4">
                <div>
                  <Label for="role-name">Role Name</Label>
                  <Input id="role-name" v-model="selectedRole.name" :disabled="isDefaultRole(selectedRole)" />
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ isDefaultRole(selectedRole) ? 'Default roles cannot be renamed' : 'Internal name used by the system' }}
                  </p>
                </div>
                <div>
                  <Label for="role-display-name">Display Name</Label>
                  <Input id="role-display-name" v-model="selectedRole.displayName" />
                  <p class="text-xs text-muted-foreground mt-1">
                    User-friendly name displayed in the interface
                  </p>
                </div>
                <div>
                  <Label for="role-description">Description</Label>
                  <Textarea id="role-description" v-model="selectedRole.description" />
                </div>
                <div>
                  <div class="flex items-center space-x-2">
                    <Checkbox id="is-default" v-model="selectedRole.isDefault" :disabled="isDefaultRole(selectedRole)" />
                    <Label for="is-default">Default Role for New Users</Label>
                  </div>
                  <p class="text-xs text-muted-foreground mt-1 ml-6">
                    Assign this role automatically to newly registered users
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="permissions" class="pt-4">
              <div class="space-y-6">
                <div v-for="(group, index) in permissionGroups" :key="index" class="space-y-2">
                  <h3 class="font-medium">{{ group.name }}</h3>
                  <div class="space-y-2 pl-6">
                    <div v-for="permission in group.permissions" :key="permission.id" class="flex items-center space-x-2">
                      <Checkbox 
                        :id="permission.id" 
                        :checked="hasPermission(permission.id)"
                        @update:checked="togglePermission(permission.id)"
                        :disabled="isDefaultRole(selectedRole) && permission.required"
                      />
                      <Label :for="permission.id">{{ permission.name }}</Label>
                      <Info 
                        v-if="permission.description" 
                        class="h-4 w-4 text-muted-foreground cursor-help"
                        :data-tooltip-id="permission.id + '-tooltip'"
                        :data-tooltip-content="permission.description"
                      />
                      <Badge 
                        v-if="permission.required && isDefaultRole(selectedRole)" 
                        variant="outline"
                        class="ml-auto"
                      >
                        Required
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="users" class="pt-4">
              <div class="space-y-4">
                <div class="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    class="pl-8"
                    v-model="userSearchQuery"
                  />
                </div>
                <div class="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="user in usersWithRole" :key="user.id">
                        <TableCell>
                          <div class="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage :src="user.avatar" :alt="user.name" />
                              <AvatarFallback>{{ getUserInitials(user.name) }}</AvatarFallback>
                            </Avatar>
                            <div class="font-medium">{{ user.name }}</div>
                          </div>
                        </TableCell>
                        <TableCell>{{ user.email }}</TableCell>
                        <TableCell>
                          <Badge
                            :variant="getStatusBadgeVariant(user.status)"
                          >
                            {{ user.status }}
                          </Badge>
                        </TableCell>
                        <TableCell class="text-right">
                          <Button variant="ghost" size="sm" @click="removeUserFromRole(user)">
                            <X class="h-4 w-4" />
                            <span class="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow v-if="usersWithRole.length === 0">
                        <TableCell colspan="4" class="text-center py-6 text-muted-foreground">
                          No users assigned to this role
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" size="sm" class="w-full" @click="showAddUserDialog = true">
                  <Plus class="h-4 w-4 mr-2" />
                  Assign Users to Role
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardContent v-else class="py-10 text-center text-muted-foreground">
          Select a role from the list to view and edit its details
        </CardContent>
        <CardFooter v-if="selectedRole" class="flex justify-between">
          <Button 
            variant="destructive" 
            size="sm" 
            @click="showDeleteDialog = true" 
            :disabled="isDefaultRole(selectedRole)"
          >
            <Trash class="h-4 w-4 mr-2" />
            Delete Role
          </Button>
          <Button @click="saveRole">
            <Save class="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Add Role Dialog -->
    <Dialog v-model:open="showAddRoleDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Create a new role with custom permissions
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div>
            <Label for="new-role-name">Role Name</Label>
            <Input id="new-role-name" v-model="newRole.name" placeholder="e.g. editor" />
            <p class="text-xs text-muted-foreground mt-1">
              Internal name used by the system (lowercase, no spaces)
            </p>
          </div>
          <div>
            <Label for="new-role-display-name">Display Name</Label>
            <Input id="new-role-display-name" v-model="newRole.displayName" placeholder="e.g. Editor" />
            <p class="text-xs text-muted-foreground mt-1">
              User-friendly name displayed in the interface
            </p>
          </div>
          <div>
            <Label for="new-role-description">Description</Label>
            <Textarea id="new-role-description" v-model="newRole.description" placeholder="Describe the role's purpose and permissions" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAddRoleDialog = false">Cancel</Button>
          <Button @click="createRole">Create Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add User to Role Dialog -->
    <Dialog v-model:open="showAddUserDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Users to Role</DialogTitle>
          <DialogDescription>
            Select users to assign to the {{ selectedRole?.displayName }} role
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              class="pl-8"
              v-model="userDialogSearchQuery"
            />
          </div>
          <div class="border rounded-md h-[200px] overflow-y-auto p-2">
            <div 
              v-for="user in availableUsers" 
              :key="user.id"
              class="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md"
            >
              <Checkbox 
                :id="`user-${user.id}`" 
                :checked="selectedUsers.includes(user.id)"
                @update:checked="toggleUserSelection(user.id)"
              />
              <Label :for="`user-${user.id}`" class="flex items-center gap-2 cursor-pointer flex-1">
                <Avatar class="h-6 w-6">
                  <AvatarFallback>{{ getUserInitials(user.name) }}</AvatarFallback>
                </Avatar>
                <span>{{ user.name }}</span>
                <span class="text-muted-foreground text-xs">{{ user.email }}</span>
              </Label>
            </div>
            <div v-if="availableUsers.length === 0" class="py-8 text-center text-muted-foreground">
              No users found
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAddUserDialog = false">Cancel</Button>
          <Button @click="assignUsersToRole">Assign Users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Role Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            {{ selectedRole?.displayName }} role and remove it from all assigned users.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deleteRole" class="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Plus,
  Shield,
  Info,
  X,
  Save,
  Trash,
} from 'lucide-vue-next';

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminRoles',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});

const toast = useToast();

// Fix the type issues:
// Add TypeScript interfaces for the data structures
interface Permission {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface PermissionGroup {
  name: string;
  permissions: Permission[];
}

interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  isDefault: boolean;
  usersCount: number;
  permissions: string[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

// Update the refs with proper types
const roles = ref<Role[]>([
  {
    id: 1,
    name: 'superadmin',
    displayName: 'Super Admin',
    description: 'Full access to all system features and settings',
    isDefault: false,
    usersCount: 1,
    permissions: ['*'], // Wildcard for all permissions
  },
  {
    id: 2,
    name: 'admin',
    displayName: 'Administrator',
    description: 'Access to administrative features with some restrictions',
    isDefault: false,
    usersCount: 3,
    permissions: ['users.view', 'users.create', 'users.edit', 'content.manage', 'settings.view'],
  },
  {
    id: 3,
    name: 'user',
    displayName: 'User',
    description: 'Standard user with basic permissions',
    isDefault: true,
    usersCount: 45,
    permissions: ['profile.view', 'profile.edit', 'content.view'],
  },
  {
    id: 4,
    name: 'editor',
    displayName: 'Editor',
    description: 'Can create and edit content',
    isDefault: false,
    usersCount: 12,
    permissions: ['profile.view', 'profile.edit', 'content.view', 'content.create', 'content.edit'],
  },
]);

const users = ref<User[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'superadmin',
    status: 'active',
    avatar: '',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
    avatar: '',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    avatar: '',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    avatar: '',
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'admin',
    status: 'active',
    avatar: '',
  },
  {
    id: 6,
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'editor',
    status: 'active',
    avatar: '',
  },
]);

const permissionGroups = ref<PermissionGroup[]>([
  {
    name: 'User Management',
    permissions: [
      { id: 'users.view', name: 'View Users', description: 'Can view user list and details', required: false },
      { id: 'users.create', name: 'Create Users', description: 'Can create new user accounts', required: false },
      { id: 'users.edit', name: 'Edit Users', description: 'Can edit user details and settings', required: false },
      { id: 'users.delete', name: 'Delete Users', description: 'Can delete user accounts', required: false },
    ],
  },
  {
    name: 'Content Management',
    permissions: [
      { id: 'content.view', name: 'View Content', description: 'Can view content items', required: true },
      { id: 'content.create', name: 'Create Content', description: 'Can create new content items', required: false },
      { id: 'content.edit', name: 'Edit Content', description: 'Can edit existing content items', required: false },
      { id: 'content.delete', name: 'Delete Content', description: 'Can delete content items', required: false },
      { id: 'content.publish', name: 'Publish Content', description: 'Can publish or unpublish content', required: false },
    ],
  },
  {
    name: 'Settings',
    permissions: [
      { id: 'settings.view', name: 'View Settings', description: 'Can view system settings', required: false },
      { id: 'settings.edit', name: 'Edit Settings', description: 'Can modify system settings', required: false },
    ],
  },
  {
    name: 'Profile',
    permissions: [
      { id: 'profile.view', name: 'View Profile', description: 'Can view own profile', required: true },
      { id: 'profile.edit', name: 'Edit Profile', description: 'Can edit own profile information', required: true },
    ],
  },
]);

const selectedRole = ref<Role | null>(null);
const newRole = ref({
  name: '',
  displayName: '',
  description: '',
  isDefault: false,
  permissions: [] as string[],
});
const showAddRoleDialog = ref(false);
const showDeleteDialog = ref(false);
const showAddUserDialog = ref(false);
const userSearchQuery = ref('');
const userDialogSearchQuery = ref('');
const selectedUsers = ref<number[]>([]);

// Computed properties
const usersWithRole = computed(() => {
  if (!selectedRole.value) return [];
  
  const filteredUsers = users.value.filter(user => user.role === selectedRole.value.name);
  
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase();
    return filteredUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  return filteredUsers;
});

const availableUsers = computed(() => {
  if (!selectedRole.value) return [];
  
  // Filter users who don't already have this role
  const availUsers = users.value.filter(user => user.role !== selectedRole.value.name);
  
  if (userDialogSearchQuery.value) {
    const query = userDialogSearchQuery.value.toLowerCase();
    return availUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  return availUsers;
});

// Methods
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();
}

function getRoleBadgeColor(roleName: string): string {
  switch (roleName) {
    case 'superadmin':
      return 'bg-red-500/10';
    case 'admin':
      return 'bg-blue-500/10';
    case 'editor':
      return 'bg-green-500/10';
    case 'user':
      return 'bg-slate-500/10';
    default:
      return 'bg-primary/10';
  }
}

function getRoleTextColor(roleName: string): string {
  switch (roleName) {
    case 'superadmin':
      return 'text-red-500';
    case 'admin':
      return 'text-blue-500';
    case 'editor':
      return 'text-green-500';
    case 'user':
      return 'text-slate-500';
    default:
      return 'text-primary';
  }
}

function getStatusBadgeVariant(status: string): string {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'secondary';
    case 'pending':
      return 'warning';
    default:
      return 'outline';
  }
}

function selectRole(role: Role): void {
  selectedRole.value = JSON.parse(JSON.stringify(role));
}

function isDefaultRole(role: Role): boolean {
  // Check if the role is one of the three default roles
  return ['superadmin', 'admin', 'user'].includes(role.name);
}

function hasPermission(permissionId: string) {
  if (!selectedRole.value) return false;
  
  // If the role has wildcard permission, they have all permissions
  if (selectedRole.value.permissions.includes('*')) return true;
  
  return selectedRole.value.permissions.includes(permissionId);
}

function togglePermission(permissionId: string) {
  if (!selectedRole.value) return;
  
  const permissions = [...selectedRole.value.permissions];
  
  if (permissions.includes(permissionId)) {
    // Remove permission
    selectedRole.value.permissions = permissions.filter(p => p !== permissionId);
  } else {
    // Add permission
    selectedRole.value.permissions.push(permissionId);
  }
}

function saveRole() {
  if (!selectedRole.value) return;
  
  const index = roles.value.findIndex(r => r.id === selectedRole.value.id);
  if (index !== -1) {
    roles.value[index] = { ...selectedRole.value };
    
    // If this role is set as default, make sure no other role is default
    if (selectedRole.value.isDefault) {
      roles.value.forEach((r, i) => {
        if (i !== index && r.isDefault) {
          r.isDefault = false;
        }
      });
    }
    
    toast.success(`Role ${selectedRole.value.displayName} updated successfully`);
  }
}

function createRole() {
  // Validate role name
  if (!newRole.value.name || !newRole.value.displayName) {
    toast.error('Role name and display name are required');
    return;
  }
  
  // Ensure role name is unique
  if (roles.value.some(r => r.name === newRole.value.name)) {
    toast.error(`Role with name '${newRole.value.name}' already exists`);
    return;
  }
  
  // Create new role
  const newId = Math.max(...roles.value.map(r => r.id)) + 1;
  const role = {
    id: newId,
    name: newRole.value.name.toLowerCase().replace(/\s+/g, '-'),
    displayName: newRole.value.displayName,
    description: newRole.value.description,
    isDefault: newRole.value.isDefault,
    usersCount: 0,
    permissions: ['profile.view', 'profile.edit', 'content.view'], // Default permissions
  };
  
  roles.value.push(role);
  
  // If this role is set as default, make sure no other role is default
  if (role.isDefault) {
    roles.value.forEach(r => {
      if (r.id !== newId && r.isDefault) {
        r.isDefault = false;
      }
    });
  }
  
  // Reset form and close dialog
  newRole.value = {
    name: '',
    displayName: '',
    description: '',
    isDefault: false,
    permissions: [],
  };
  showAddRoleDialog.value = false;
  
  // Select the new role
  selectRole(role);
  
  toast.success(`Role ${role.displayName} created successfully`);
}

function deleteRole() {
  if (!selectedRole.value) return;
  
  // Don't allow deletion of default roles
  if (isDefaultRole(selectedRole.value)) {
    toast.error('Default roles cannot be deleted');
    showDeleteDialog.value = false;
    return;
  }
  
  const index = roles.value.findIndex(r => r.id === selectedRole.value.id);
  if (index !== -1) {
    const roleName = selectedRole.value.name;
    
    // Update users with this role to have the default role
    const defaultRole = roles.value.find(r => r.isDefault) || roles.value.find(r => r.name === 'user');
    
    if (defaultRole) {
      users.value.forEach(user => {
        if (user.role === roleName) {
          user.role = defaultRole.name;
        }
      });
    }
    
    // Delete the role
    roles.value.splice(index, 1);
    
    toast.success(`Role ${selectedRole.value.displayName} deleted successfully`);
    selectedRole.value = null;
    showDeleteDialog.value = false;
  }
}

function toggleUserSelection(userId: number) {
  const index = selectedUsers.value.indexOf(userId);
  
  if (index === -1) {
    selectedUsers.value.push(userId);
  } else {
    selectedUsers.value.splice(index, 1);
  }
}

function assignUsersToRole() {
  if (!selectedRole.value || selectedUsers.value.length === 0) return;
  
  // Assign selected users to the role
  selectedUsers.value.forEach(userId => {
    const user = users.value.find(u => u.id === userId);
    if (user) {
      user.role = selectedRole.value.name;
    }
  });
  
  // Update the users count for the role
  const index = roles.value.findIndex(r => r.id === selectedRole.value.id);
  if (index !== -1) {
    roles.value[index].usersCount = users.value.filter(u => u.role === selectedRole.value.name).length;
    selectedRole.value.usersCount = roles.value[index].usersCount;
  }
  
  toast.success(`${selectedUsers.value.length} users assigned to ${selectedRole.value.displayName} role`);
  
  // Reset and close dialog
  selectedUsers.value = [];
  showAddUserDialog.value = false;
}

function removeUserFromRole(user: User) {
  if (!selectedRole.value) return;
  
  // Find default role
  const defaultRole = roles.value.find(r => r.isDefault) || roles.value.find(r => r.name === 'user');
  
  if (defaultRole) {
    // Update user's role
    const userIndex = users.value.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users.value[userIndex].role = defaultRole.name;
      
      // Update role user counts
      const currentRoleIndex = roles.value.findIndex(r => r.id === selectedRole.value.id);
      if (currentRoleIndex !== -1) {
        roles.value[currentRoleIndex].usersCount--;
        selectedRole.value.usersCount = roles.value[currentRoleIndex].usersCount;
      }
      
      const defaultRoleIndex = roles.value.findIndex(r => r.id === defaultRole.id);
      if (defaultRoleIndex !== -1) {
        roles.value[defaultRoleIndex].usersCount++;
      }
      
      toast.success(`User ${user.name} removed from ${selectedRole.value.displayName} role`);
    }
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style> 