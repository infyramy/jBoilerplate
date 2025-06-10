<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Role Management</h1>
        <p class="text-muted-foreground">Manage roles and permissions</p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="mr-2 h-4 w-4" />
        Add Role
      </Button>
    </div>
    
    <Card>
      <CardHeader class="pb-3">
        <CardTitle>Roles</CardTitle>
        <CardDescription>Define user roles and their permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <AdminDataTable
          :columns="columns"
          :data="roles"
          :loading="loading"
          :selectable="false"
          :actions="[]"
          :items-per-page-options="[10, 25, 50]"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
          @view="viewPermissions"
        />
      </CardContent>
    </Card>
    
    <!-- Create Role Dialog -->
    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role with specific permissions
          </DialogDescription>
        </DialogHeader>
        
        <AdminForm
          title=""
          :fields="roleFormFields"
          submitLabel="Create Role"
          :loading="loading"
          :form-values="formValues"
          @submit="handleCreateRole"
          @cancel="isCreateDialogOpen = false"
        />
      </DialogContent>
    </Dialog>
    
    <!-- Edit Role Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role details and permissions
          </DialogDescription>
        </DialogHeader>
        
        <AdminForm
          title=""
          :fields="roleFormFields"
          submitLabel="Update Role"
          :loading="loading"
          :form-values="formValues"
          @submit="handleUpdateRole"
          @cancel="isEditDialogOpen = false"
        />
      </DialogContent>
    </Dialog>
    
    <!-- Delete Role Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this role? Users assigned to this role will be affected.
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedRole" class="rounded-md border p-4 my-4">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <Shield class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ selectedRole.name }}</p>
              <p class="text-sm text-muted-foreground">{{ selectedRole.description }}</p>
              <div class="flex gap-2 mt-1">
                <Badge>{{ selectedRole.userCount }} users</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            @click="isDeleteDialogOpen = false"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="handleDeleteRole"
            :disabled="loading || selectedRole?.isDefault"
          >
            <Trash2 v-if="!loading" class="mr-2 h-4 w-4" />
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
            Delete Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- View Permissions Dialog -->
    <Dialog v-model:open="isPermissionsDialogOpen">
      <DialogContent class="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Role Permissions: {{ selectedRole?.name }}</DialogTitle>
          <DialogDescription>
            View and manage permissions for this role
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-6 my-4">
          <div v-for="(section, index) in permissionSections" :key="index" class="space-y-4">
            <h3 class="text-lg font-medium">{{ section.name }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="permission in section.permissions" :key="permission.id" class="flex items-start space-x-2">
                <Checkbox
                  :id="`permission-${permission.id}`"
                  :checked="isPermissionSelected(permission.id)"
                  @update:checked="togglePermission(permission.id)"
                  :disabled="loading || selectedRole?.isSystem"
                />
                <div class="grid gap-1.5 leading-none">
                  <label
                    :for="`permission-${permission.id}`"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {{ permission.name }}
                  </label>
                  <p class="text-sm text-muted-foreground">
                    {{ permission.description }}
                  </p>
                </div>
              </div>
            </div>
            <Separator v-if="index < permissionSections.length - 1" />
          </div>
          
          <Alert v-if="selectedRole?.isSystem" variant="warning">
            <AlertTriangle class="h-4 w-4" />
            <AlertTitle>System Role</AlertTitle>
            <AlertDescription>
              This is a system role with fixed permissions. You cannot modify its permissions.
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            @click="isPermissionsDialogOpen = false"
            v-if="selectedRole?.isSystem"
          >
            Close
          </Button>
          <template v-else>
            <Button
              variant="outline"
              @click="isPermissionsDialogOpen = false"
            >
              Cancel
            </Button>
            <Button
              @click="savePermissions"
              :disabled="loading"
            >
              Save Permissions
            </Button>
          </template>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Trash2, Plus, AlertTriangle } from "lucide-vue-next";
import AdminForm from "@/components/ui/admin-form/AdminForm.vue";
import AdminDataTable from "@/components/ui/admin-data-table";

// Table schema
const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true, searchable: true },
  { key: 'description', label: 'Description', sortable: false, searchable: true },
  { key: 'userCount', label: 'Users', sortable: true },
  { key: 'isSystem', label: 'Type', sortable: true, 
    render: (role: any) => {
      return h(Badge, { 
        variant: role.isSystem ? 'default' : 'outline' 
      }, () => role.isSystem ? 'System' : 'Custom');
    }
  }
];

// Mock data
const mockRoles = [
  { 
    id: 1, 
    name: 'Admin', 
    description: 'Full system access', 
    userCount: 5, 
    isSystem: true,
    isDefault: false,
    permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  },
  { 
    id: 2, 
    name: 'Manager', 
    description: 'Can manage users and content', 
    userCount: 12, 
    isSystem: true,
    isDefault: false,
    permissions: [1, 2, 3, 5, 6, 9, 10, 13, 14]
  },
  { 
    id: 3, 
    name: 'User', 
    description: 'Basic access', 
    userCount: 84, 
    isSystem: true,
    isDefault: true,
    permissions: [1, 5, 9, 13, 17]
  },
  { 
    id: 4, 
    name: 'Editor', 
    description: 'Can edit content but not users', 
    userCount: 7, 
    isSystem: false,
    isDefault: false,
    permissions: [1, 5, 9, 10, 13, 14, 17, 18]
  },
  { 
    id: 5, 
    name: 'Viewer', 
    description: 'Read-only access', 
    userCount: 23, 
    isSystem: false,
    isDefault: false,
    permissions: [1, 5, 9, 13, 17]
  },
];

// Permission sections
const permissionSections = [
  {
    name: 'User Management',
    permissions: [
      { id: 1, name: 'View Users', description: 'View user list and details' },
      { id: 2, name: 'Create Users', description: 'Create new user accounts' },
      { id: 3, name: 'Edit Users', description: 'Edit existing user accounts' },
      { id: 4, name: 'Delete Users', description: 'Delete user accounts' }
    ]
  },
  {
    name: 'Content Management',
    permissions: [
      { id: 5, name: 'View Content', description: 'View all content' },
      { id: 6, name: 'Create Content', description: 'Create new content' },
      { id: 7, name: 'Edit Content', description: 'Edit existing content' },
      { id: 8, name: 'Delete Content', description: 'Delete content' }
    ]
  },
  {
    name: 'Project Management',
    permissions: [
      { id: 9, name: 'View Projects', description: 'View project list and details' },
      { id: 10, name: 'Create Projects', description: 'Create new projects' },
      { id: 11, name: 'Edit Projects', description: 'Edit existing projects' },
      { id: 12, name: 'Delete Projects', description: 'Delete projects' }
    ]
  },
  {
    name: 'Settings',
    permissions: [
      { id: 13, name: 'View Settings', description: 'View system settings' },
      { id: 14, name: 'Edit Settings', description: 'Modify system settings' },
      { id: 15, name: 'Manage Roles', description: 'Create and edit roles' },
      { id: 16, name: 'System Configuration', description: 'Configure system parameters' }
    ]
  },
  {
    name: 'Reports',
    permissions: [
      { id: 17, name: 'View Reports', description: 'Access standard reports' },
      { id: 18, name: 'Export Reports', description: 'Export reports to various formats' },
      { id: 19, name: 'Create Custom Reports', description: 'Create and save custom reports' },
      { id: 20, name: 'Advanced Analytics', description: 'Access advanced analytics features' }
    ]
  }
];

// State
const roles = ref(mockRoles);
const loading = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isPermissionsDialogOpen = ref(false);
const selectedRole = ref<any>(null);
const formValues = ref<any>({});
const selectedPermissions = ref<number[]>([]);

// Toast service - temporary mock implementation until toast component is available
const useToast = () => {
  return {
    toast: (props: { title: string; description: string; variant: string }) => {
      console.log(`[Toast] ${props.title}: ${props.description} (${props.variant})`);
    }
  };
};
const { toast } = useToast();

// Form fields
const roleFormFields = computed(() => [
  { 
    id: 'name', 
    label: 'Role Name', 
    type: 'text' as const, 
    required: true, 
    placeholder: 'Enter role name',
    validation: (value: string) => value.length >= 2 || 'Name must be at least 2 characters'
  },
  { 
    id: 'description', 
    label: 'Description', 
    type: 'textarea' as const, 
    required: true,
    placeholder: 'Describe the purpose of this role',
    validation: (value: string) => value.length >= 5 || 'Description must be at least 5 characters'
  },
  {
    id: 'isDefault',
    label: 'Default Role',
    type: 'checkbox' as const,
    helperText: 'Make this the default role for new users',
  }
]);

// Methods
function openCreateDialog() {
  selectedRole.value = null;
  formValues.value = {
    isDefault: false
  };
  isCreateDialogOpen.value = true;
}

function openEditDialog(role: any) {
  selectedRole.value = role;
  formValues.value = { ...role };
  isEditDialogOpen.value = true;
}

function openDeleteDialog(role: any) {
  selectedRole.value = role;
  isDeleteDialogOpen.value = true;
}

function viewPermissions(role: any) {
  selectedRole.value = role;
  selectedPermissions.value = [...role.permissions];
  isPermissionsDialogOpen.value = true;
}

function isPermissionSelected(permissionId: number) {
  return selectedPermissions.value.includes(permissionId);
}

function togglePermission(permissionId: number) {
  if (isPermissionSelected(permissionId)) {
    selectedPermissions.value = selectedPermissions.value.filter(id => id !== permissionId);
  } else {
    selectedPermissions.value.push(permissionId);
  }
}

function savePermissions() {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // Update role permissions
    if (selectedRole.value) {
      const updatedRoles = roles.value.map(role => 
        role.id === selectedRole.value.id 
          ? { ...role, permissions: [...selectedPermissions.value] } 
          : role
      );
      
      roles.value = updatedRoles;
    }
    
    loading.value = false;
    isPermissionsDialogOpen.value = false;
    
    toast({
      title: "Permissions Updated",
      description: `Permissions for ${selectedRole.value?.name} have been updated.`,
      variant: "success"
    });
  }, 1000);
}

function handleCreateRole(values: any) {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const newRole = {
      id: roles.value.length + 1,
      ...values,
      userCount: 0,
      isSystem: false,
      permissions: []
    };
    
    // If this is set as default, update other roles
    if (newRole.isDefault) {
      roles.value = roles.value.map(role => ({ ...role, isDefault: false }));
    }
    
    roles.value = [...roles.value, newRole];
    loading.value = false;
    isCreateDialogOpen.value = false;
    
    toast({
      title: "Role Created",
      description: `${newRole.name} role has been successfully created.`,
      variant: "success"
    });
  }, 1000);
}

function handleUpdateRole(values: any) {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // If this is set as default, update other roles
    if (values.isDefault) {
      roles.value = roles.value.map(role => ({ ...role, isDefault: false }));
    }
    
    roles.value = roles.value.map(role => 
      role.id === selectedRole.value.id ? { ...role, ...values } : role
    );
    
    loading.value = false;
    isEditDialogOpen.value = false;
    
    toast({
      title: "Role Updated",
      description: `${values.name} role has been successfully updated.`,
      variant: "success"
    });
  }, 1000);
}

function handleDeleteRole() {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    roles.value = roles.value.filter(role => role.id !== selectedRole.value.id);
    loading.value = false;
    isDeleteDialogOpen.value = false;
    
    toast({
      title: "Role Deleted",
      description: `${selectedRole.value.name} role has been successfully deleted.`,
      variant: "success"
    });
  }, 1000);
}
</script> 