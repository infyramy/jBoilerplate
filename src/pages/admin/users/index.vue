<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">User Management</h1>
        <p class="text-muted-foreground">Manage all system users and their permissions</p>
      </div>
      <div class="flex space-x-2">
        <Button @click="openCreateDialog">
          <UserPlus class="mr-2 h-4 w-4" />
          Add User
        </Button>
        <Button variant="outline" @click="router.push('/admin/users/bulk-operations')">
          <Upload class="mr-2 h-4 w-4" />
          Bulk Operations
        </Button>
        <Button variant="outline" @click="router.push('/admin/users/roles')">
          <Shield class="mr-2 h-4 w-4" />
          Manage Roles
        </Button>
      </div>
    </div>
    
    <Card>
      <CardHeader class="pb-3">
        <CardTitle>Users</CardTitle>
        <CardDescription>View and manage all system users</CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Use admin data table -->
        <AdminDataTable
          :columns="columns"
          :data="users"
          :loading="loading"
          :selectable="true"
          :actions="bulkActions"
          :items-per-page-options="[10, 25, 50, 100]"
          @view="openEditDialog"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
        />
      </CardContent>
    </Card>
    
    <!-- Create User Dialog -->
    <Dialog v-model:open="isCreateDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They'll receive a welcome email with login instructions.
          </DialogDescription>
        </DialogHeader>
        
        <AdminForm
          title=""
          :fields="userFormFields"
          submitLabel="Create User"
          :loading="loading"
          :form-values="formValues"
          @submit="handleCreateUser"
          @cancel="isCreateDialogOpen = false"
        />
      </DialogContent>
    </Dialog>
    
    <!-- Edit User Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>
        
        <AdminForm
          title=""
          :fields="userFormFields"
          submitLabel="Update User"
          :loading="loading"
          :form-values="formValues"
          @submit="handleUpdateUser"
          @cancel="isEditDialogOpen = false"
        />
        
        <DialogFooter class="border-t pt-4 mt-4">
          <Button 
            variant="outline"
            @click="sendPasswordReset(selectedUser)"
            class="mr-auto"
          >
            <Mail class="mr-2 h-4 w-4" />
            Send Password Reset
          </Button>
          <Button 
            variant="ghost"
            @click="impersonateUser(selectedUser)"
            class="ml-auto mr-2"
          >
            <UserSquare class="mr-2 h-4 w-4" />
            Impersonate User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- Delete User Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedUser" class="rounded-md border p-4 my-4">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <User class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ selectedUser.name }}</p>
              <p class="text-sm text-muted-foreground">{{ selectedUser.email }}</p>
              <div class="flex gap-2 mt-1">
                <Badge>{{ selectedUser.role }}</Badge>
                <Badge>{{ selectedUser.status }}</Badge>
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
            @click="handleDeleteUser"
            :disabled="loading"
          >
            <Trash2 v-if="!loading" class="mr-2 h-4 w-4" />
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, UserPlus, Trash2, Mail, UserSquare, Upload, Shield } from "lucide-vue-next";
import AdminForm from "@/components/ui/admin-form/AdminForm.vue";
import AdminDataTable from "@/components/ui/admin-data-table";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

// Toast service - temporary mock implementation until toast component is available
const useToast = () => {
  return {
    toast: (props: { title: string; description: string; variant: string }) => {
      console.log(`[Toast] ${props.title}: ${props.description} (${props.variant})`);
    }
  };
};

// Table schema
const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true, searchable: true },
  { key: 'email', label: 'Email', sortable: true, searchable: true },
  { key: 'role', label: 'Role', sortable: true, searchable: true,
    render: (user: any) => {
      const colorMap: Record<string, string> = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      };
      return h(Badge, { class: colorMap[user.role] || '' }, () => user.role);
    } 
  },
  { key: 'status', label: 'Status', sortable: true, 
    render: (user: any) => {
      const colorMap: Record<string, string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
      return h(Badge, { class: colorMap[user.status] || '' }, () => user.status);
    }
  },
  { key: 'created_at', label: 'Created', sortable: true },
];

// Mock data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', created_at: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active', created_at: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', created_at: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', created_at: '2023-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'manager', status: 'suspended', created_at: '2023-05-12' },
  { id: 6, name: 'David Miller', email: 'david@example.com', role: 'user', status: 'active', created_at: '2023-06-18' },
  { id: 7, name: 'Eva Garcia', email: 'eva@example.com', role: 'user', status: 'active', created_at: '2023-07-22' },
  { id: 8, name: 'Frank Thomas', email: 'frank@example.com', role: 'user', status: 'inactive', created_at: '2023-08-30' },
  { id: 9, name: 'Grace Lee', email: 'grace@example.com', role: 'manager', status: 'active', created_at: '2023-09-14' },
  { id: 10, name: 'Henry Wright', email: 'henry@example.com', role: 'user', status: 'active', created_at: '2023-10-05' },
  { id: 11, name: 'Irene Lopez', email: 'irene@example.com', role: 'user', status: 'suspended', created_at: '2023-11-11' },
  { id: 12, name: 'Jack Robinson', email: 'jack@example.com', role: 'user', status: 'active', created_at: '2023-12-03' },
];

// State
const users = ref(mockUsers);
const loading = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const selectedUser = ref<any>(null);
const formValues = ref<any>({});
const { toast } = useToast();
const authStore = useAuthStore();
const router = useRouter();

// Computed
const roleOptions = computed(() => [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'User', value: 'user' },
]);

const statusOptions = computed(() => [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
]);

// Form fields
const userFormFields = computed(() => [
  { 
    id: 'name', 
    label: 'Full Name', 
    type: 'text' as const, 
    required: true, 
    placeholder: 'Enter full name',
    validation: (value: string) => value.length >= 3 || 'Name must be at least 3 characters'
  },
  { 
    id: 'email', 
    label: 'Email Address', 
    type: 'email' as const, 
    required: true,
    placeholder: 'Enter email address',
    validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email format'
  },
  { 
    id: 'password', 
    label: 'Password', 
    type: 'text' as const, 
    required: !selectedUser.value,
    placeholder: selectedUser.value ? 'Leave blank to keep current password' : 'Enter password',
    helperText: selectedUser.value ? 'Leave blank to keep current password' : 'Minimum 8 characters',
    validation: (value: string) => {
      if (!value && selectedUser.value) return true; // Allow empty for edit mode
      return value.length >= 8 || 'Password must be at least 8 characters';
    }
  },
  { 
    id: 'role', 
    label: 'Role', 
    type: 'select' as const, 
    required: true,
    options: roleOptions.value
  },
  { 
    id: 'status', 
    label: 'Status', 
    type: 'select' as const, 
    required: true,
    options: statusOptions.value
  },
]);

// Methods
function openCreateDialog() {
  selectedUser.value = null;
  formValues.value = {
    role: 'user',
    status: 'active'
  };
  isCreateDialogOpen.value = true;
}

function openEditDialog(user: any) {
  selectedUser.value = user;
  formValues.value = { ...user };
  isEditDialogOpen.value = true;
}

function openDeleteDialog(user: any) {
  selectedUser.value = user;
  isDeleteDialogOpen.value = true;
}

function handleCreateUser(values: any) {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const newUser = {
      id: users.value.length + 1,
      ...values,
      created_at: new Date().toISOString().split('T')[0]
    };
    
    users.value = [...users.value, newUser];
    loading.value = false;
    isCreateDialogOpen.value = false;
    
    toast({
      title: "User Created",
      description: `${newUser.name} has been successfully created.`,
      variant: "success"
    });
  }, 1000);
}

function handleUpdateUser(values: any) {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    users.value = users.value.map(user => 
      user.id === selectedUser.value.id ? { ...user, ...values } : user
    );
    
    loading.value = false;
    isEditDialogOpen.value = false;
    
    toast({
      title: "User Updated",
      description: `${values.name} has been successfully updated.`,
      variant: "success"
    });
  }, 1000);
}

function handleDeleteUser() {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    users.value = users.value.filter(user => user.id !== selectedUser.value.id);
    loading.value = false;
    isDeleteDialogOpen.value = false;
    
    toast({
      title: "User Deleted",
      description: `${selectedUser.value.name} has been successfully deleted.`,
      variant: "success"
    });
  }, 1000);
}

function sendPasswordReset(user: any) {
  toast({
    title: "Password Reset Email Sent",
    description: `A password reset link has been sent to ${user.email}.`,
    variant: "info"
  });
}

function impersonateUser(user: any) {
  loading.value = true;
  
  try {
    // Convert the mock user data to the expected User type
    const userToImpersonate = {
      id: user.id,
      uuid: `user-${user.id}`,
      email: user.email,
      user_type: user.role as 'admin' | 'manager' | 'user',
      fullname: user.name,
      // Add any other required fields from your User interface
    };
    
    // Call the auth store's impersonateUser method
    authStore.impersonateUser(userToImpersonate);
    
    // Close the dialog
    isEditDialogOpen.value = false;
    
    toast({
      title: "Impersonation Started",
      description: `You are now viewing the system as ${user.name}`,
      variant: "info"
    });
    
    // Redirect to the appropriate dashboard based on the user's role
    setTimeout(() => {
      const route = user.role === 'admin' 
        ? '/admin/dashboard' 
        : user.role === 'manager'
          ? '/manager/home'
          : '/user/home';
      
      router.push(route);
    }, 1000);
  } catch (error: any) {
    toast({
      title: "Impersonation Failed",
      description: error.message || "Could not impersonate user",
      variant: "destructive"
    });
  } finally {
    loading.value = false;
  }
}

// Bulk actions
const bulkActions = [
  { 
    label: 'Delete Selected', 
    variant: 'destructive' as const, 
    onClick: (selectedItems: any[]) => {
      // Simulate bulk delete
      users.value = users.value.filter(user => 
        !selectedItems.some(selected => selected.id === user.id)
      );
      
      toast({
        title: "Users Deleted",
        description: `${selectedItems.length} users have been successfully deleted.`,
        variant: "success"
      });
    }
  },
  { 
    label: 'Mark as Active', 
    variant: 'outline' as const, 
    onClick: (selectedItems: any[]) => {
      // Simulate bulk status update
      users.value = users.value.map(user => 
        selectedItems.some(selected => selected.id === user.id)
          ? { ...user, status: 'active' }
          : user
      );
      
      toast({
        title: "Users Updated",
        description: `${selectedItems.length} users have been marked as active.`,
        variant: "success"
      });
    }
  }
];
</script> 