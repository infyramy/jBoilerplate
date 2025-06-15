<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Users Management
        </h1>
        <p class="text-muted-foreground mt-1">
          Manage user accounts, roles and permissions
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex items-center gap-2">
          <Download class="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button size="sm" class="flex items-center gap-2" @click="openCreateUserDialog">
          <Plus class="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Find users by name, email, role or status</CardDescription>
          </div>
          <Button variant="ghost" size="sm" @click="resetFilters" class="flex items-center gap-1">
            <RotateCcw class="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <Label for="search" class="text-xs">Search</Label>
            <div class="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="search"
                placeholder="Name, email or ID..."
                class="pl-8"
                v-model="searchQuery"
              />
            </div>
          </div>
          
          <div>
            <Label for="role-filter" class="text-xs">Role</Label>
            <Select v-model="roleFilter" id="role-filter" class="mt-1">
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label for="status-filter" class="text-xs">Status</Label>
            <Select v-model="statusFilter" id="status-filter" class="mt-1">
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label for="created-filter" class="text-xs">Created Date</Label>
            <Select v-model="createdFilter" id="created-filter" class="mt-1">
              <SelectTrigger>
                <SelectValue placeholder="Any Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Users Data Table -->
    <DataTable
      :columns="columns"
      :data="filteredUsers"
      :loading="isLoading"
      showNumbering
      emptyStateTitle="No users found"
      emptyStateDescription="Try adjusting your filters or search query"
      @row:click="handleRowClick"
    >
      <!-- Custom cell renderers -->
      <template #cell-user="{ item }">
        <div class="flex items-center gap-3">
          <Avatar>
            <AvatarImage v-if="item.avatar" :src="item.avatar" :alt="item.name" />
            <AvatarFallback>{{ getUserInitials(item.name) }}</AvatarFallback>
          </Avatar>
          <div>
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-xs text-muted-foreground">ID: {{ item.id }}</div>
          </div>
        </div>
      </template>
      
      <template #cell-role="{ value }">
        <Badge :variant="getRoleBadgeVariant(value)">
          {{ value }}
        </Badge>
      </template>
      
      <template #cell-status="{ value }">
        <Badge :variant="getStatusBadgeVariant(value)">
          {{ value }}
        </Badge>
      </template>
      
      <template #cell-created="{ value }">
        {{ formatDate(value) }}
      </template>
      
      <template #cell-actions="{ item }">
        <div class="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger as="div">
              <Button variant="ghost" size="icon">
                <MoreHorizontal class="h-4 w-4" />
                <span class="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-[180px]">
              <DropdownMenuItem @click="editUser(item)">
                <Edit class="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="impersonateUser(item)">
                <UserIcon class="mr-2 h-4 w-4" />
                <span>Impersonate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="resetPassword(item)" class="text-amber-600">
                <KeyIcon class="mr-2 h-4 w-4" />
                <span>Reset Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                @click="toggleUserStatus(item)" 
                :class="item.status === 'active' ? 'text-amber-600' : 'text-green-600'"
              >
                <component :is="item.status === 'active' ? Ban : CheckCircle" class="mr-2 h-4 w-4" />
                <span>{{ item.status === 'active' ? 'Deactivate' : 'Activate' }}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="deleteUser(item)" class="text-red-600">
                <Trash class="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </template>
    </DataTable>

    <!-- Create User Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent class="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They'll receive a welcome email with login instructions.
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-5 py-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name" required>Full Name</Label>
              <Input
                id="name"
                v-model="newUser.name"
                placeholder="Enter full name"
              />
              <p v-if="validationErrors.name" class="text-xs text-destructive">{{ validationErrors.name }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="email" required>Email</Label>
              <Input
                id="email"
                type="email"
                v-model="newUser.email"
                placeholder="example@company.com"
              />
              <p v-if="validationErrors.email" class="text-xs text-destructive">{{ validationErrors.email }}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <Label for="password" required>Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="newUser.password"
                placeholder="Set a secure password"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                @click="showPassword = !showPassword"
                class="absolute right-2 top-0 h-full"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </Button>
            </div>
            <p v-if="validationErrors.password" class="text-xs text-destructive">{{ validationErrors.password }}</p>
            <PasswordStrength v-if="newUser.password" :password="newUser.password" />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="role" required>Role</Label>
              <Select v-model="newUser.role">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="validationErrors.role" class="text-xs text-destructive">{{ validationErrors.role }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="status" required>Status</Label>
              <Select v-model="newUser.status">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="validationErrors.status" class="text-xs text-destructive">{{ validationErrors.status }}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Checkbox id="send-welcome" v-model:checked="sendWelcomeEmail" />
              <Label for="send-welcome" class="text-sm">Send welcome email with login details</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="showCreateDialog = false">Cancel</Button>
          <Button type="submit" @click="createUser" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit User Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and permissions
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-5 py-4">
          <div class="flex items-center justify-center mb-2">
            <Avatar class="h-20 w-20">
              <AvatarImage v-if="editingUser.avatar" :src="editingUser.avatar" :alt="editingUser.name" />
              <AvatarFallback class="text-2xl">{{ getUserInitials(editingUser.name) }}</AvatarFallback>
            </Avatar>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-name" required>Full Name</Label>
              <Input
                id="edit-name"
                v-model="editingUser.name"
                placeholder="Enter full name"
              />
              <p v-if="validationErrors.name" class="text-xs text-destructive">{{ validationErrors.name }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="edit-email" required>Email</Label>
              <Input
                id="edit-email"
                type="email"
                v-model="editingUser.email"
                placeholder="example@company.com"
              />
              <p v-if="validationErrors.email" class="text-xs text-destructive">{{ validationErrors.email }}</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <Label for="edit-password">Password</Label>
            <div class="relative">
              <Input
                id="edit-password"
                :type="showPassword ? 'text' : 'password'"
                v-model="editingUser.password"
                placeholder="Leave blank to keep current password"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                @click="showPassword = !showPassword"
                class="absolute right-2 top-0 h-full"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </Button>
            </div>
            <p class="text-xs text-muted-foreground">Leave blank to keep the current password</p>
            <PasswordStrength v-if="editingUser.password" :password="editingUser.password" />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-role" required>Role</Label>
              <Select v-model="editingUser.role">
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="validationErrors.role" class="text-xs text-destructive">{{ validationErrors.role }}</p>
            </div>
            
            <div class="space-y-2">
              <Label for="edit-status" required>Status</Label>
              <Select v-model="editingUser.status">
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <p v-if="validationErrors.status" class="text-xs text-destructive">{{ validationErrors.status }}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 class="text-sm font-medium mb-2">User Information</h4>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <dt class="text-muted-foreground">User ID:</dt>
                <dd class="font-medium">{{ editingUser.id }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground">Created:</dt>
                <dd class="font-medium">{{ formatDate(editingUser.created) }}</dd>
              </div>
              <div>
                <dt class="text-muted-foreground">Last Login:</dt>
                <dd class="font-medium">{{ editingUser.last_login ? formatDate(editingUser.last_login) : 'Never' }}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <DialogFooter class="flex-col sm:flex-row gap-2 sm:gap-0">
          <div class="flex gap-2 sm:mr-auto">
            <Button 
              variant="outline" 
              size="sm"
              @click="resetPassword(editingUser)"
              class="flex items-center gap-1"
            >
              <KeyIcon class="h-4 w-4" />
              Reset Password
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              @click="impersonateUser(editingUser)"
              class="flex items-center gap-1"
            >
              <UserIcon class="h-4 w-4" />
              Impersonate
            </Button>
          </div>
          
          <div class="flex gap-2">
            <Button variant="outline" @click="showEditDialog = false">Cancel</Button>
            <Button type="submit" @click="saveUser" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            account and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmDeleteUser" class="bg-red-600 hover:bg-red-700">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { format, parseISO, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { DataTableColumn } from '@/components/ui/data-table/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { PasswordStrength } from '@/components/ui/password-strength';
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  Ban,
  CheckCircle,
  User as UserIcon,
  Key as KeyIcon,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2,
} from 'lucide-vue-next';
import { ToastOptions } from '@/composables/useToast';

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminUsers',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

// Define our User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  created: string;
  last_login: string | null;
}

// State
const isLoading = ref(false);
const users = ref<User[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'superadmin',
    status: 'active',
    avatar: '',
    created: '2023-01-10T09:00:00Z',
    last_login: '2023-06-15T14:30:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
    avatar: '',
    created: '2023-01-15T14:30:00Z',
    last_login: '2023-06-10T08:45:00Z',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    avatar: '',
    created: '2023-02-20T11:45:00Z',
    last_login: null,
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    avatar: '',
    created: '2023-03-05T08:15:00Z',
    last_login: '2023-05-20T16:15:00Z',
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'admin',
    status: 'pending',
    avatar: '',
    created: '2023-03-10T16:20:00Z',
    last_login: null,
  },
]);

// Filters
const searchQuery = ref('');
const roleFilter = ref('all');
const statusFilter = ref('all');
const createdFilter = ref('all');

// Table columns
const columns = [
  {
    key: 'user',
    title: 'User',
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
  },
  {
    key: 'created',
    title: 'Created',
    sortable: true,
  },
  {
    key: 'actions',
    title: '',
    align: 'right' as const,
  },
];

// Modals state
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const showPassword = ref(false);
const sendWelcomeEmail = ref(true);

// Form state
const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active',
  avatar: '',
});

interface EditingUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  avatar: string;
  created: string;
  last_login: string | null;
}

const editingUser = ref<EditingUser>({
  id: 0,
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active',
  avatar: '',
  created: '',
  last_login: null,
});

const userToDelete = ref<User | null>(null);

// Form validation errors interface
interface ValidationErrors {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

const validationErrors = reactive<ValidationErrors>({
  name: '',
  email: '',
  password: '',
  role: '',
  status: '',
});

// Computed properties
const filteredUsers = computed(() => {
  let result = [...users.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) ||
      user.id.toString().includes(query)
    );
  }
  
  // Apply role filter
  if (roleFilter.value !== 'all') {
    result = result.filter(user => user.role === roleFilter.value);
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(user => user.status === statusFilter.value);
  }
  
  // Apply created date filter
  if (createdFilter.value !== 'all') {
    const now = new Date();
    let dateThreshold;
    
    switch (createdFilter.value) {
      case 'today':
        dateThreshold = subDays(now, 1);
        break;
      case 'week':
        dateThreshold = startOfWeek(now);
        break;
      case 'month':
        dateThreshold = startOfMonth(now);
        break;
      case 'year':
        dateThreshold = startOfYear(now);
        break;
      default:
        dateThreshold = null;
    }
    
    if (dateThreshold) {
      result = result.filter(user => {
        const createdDate = parseISO(user.created);
        return createdDate >= dateThreshold;
      });
    }
  }
  
  return result;
});

// Methods
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM dd, yyyy');
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (role) {
    case 'superadmin':
      return 'destructive';
    case 'admin':
      return 'default';
    case 'user':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' {
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

function resetFilters(): void {
  searchQuery.value = '';
  roleFilter.value = 'all';
  statusFilter.value = 'all';
  createdFilter.value = 'all';
}

function handleRowClick(user: any): void {
  editUser(user);
}

function openCreateUserDialog(): void {
  newUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    avatar: '',
  };
  
  // Reset validation errors
  Object.keys(validationErrors).forEach((key: string) => {
    (validationErrors as any)[key] = '';
  });
  
  showCreateDialog.value = true;
}

function validateUser(user: any, isNewUser = false): boolean {
  let isValid = true;
  
  // Reset validation errors
  Object.keys(validationErrors).forEach((key) => {
    if (key in validationErrors) {
      (validationErrors as Record<string, string>)[key] = '';
    }
  });
  
  // Validate name
  if (!user.name || user.name.trim().length < 3) {
    validationErrors.name = 'Name must be at least 3 characters';
    isValid = false;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || !emailRegex.test(user.email)) {
    validationErrors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Validate password (only required for new users)
  if (isNewUser && (!user.password || user.password.length < 8)) {
    validationErrors.password = 'Password must be at least 8 characters';
    isValid = false;
  }
  
  // Validate role
  if (!user.role) {
    validationErrors.role = 'Please select a role';
    isValid = false;
  }
  
  // Validate status
  if (!user.status) {
    validationErrors.status = 'Please select a status';
    isValid = false;
  }
  
  return isValid;
}

function createUser() {
  if (!validateUser(newUser.value, true)) {
    return;
  }
  
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const newId = Math.max(...users.value.map(u => u.id)) + 1;
    
    const user = {
      id: newId,
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      status: newUser.value.status,
      avatar: '',
      created: new Date().toISOString(),
      last_login: null,
    };
    
    users.value.push(user);
    
    toast.success('User created', {
      description: `User ${user.name} has been created successfully${sendWelcomeEmail.value ? ' and welcome email sent' : ''}`,
    });
    
    showCreateDialog.value = false;
    isLoading.value = false;
  }, 1000);
}

function editUser(user: User): void {
  editingUser.value = { 
    ...user,
    password: '', // Don't pre-fill password
  };
  
  // Reset validation errors
  Object.keys(validationErrors).forEach((key) => {
    if (key in validationErrors) {
      (validationErrors as Record<string, string>)[key] = '';
    }
  });
  
  showEditDialog.value = true;
}

function saveUser() {
  if (!validateUser(editingUser.value)) {
    return;
  }
  
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const index = users.value.findIndex(u => u.id === editingUser.value.id);
    
    if (index !== -1) {
      // Create updated user object, handling the password field
      const updatedUser = {
        ...users.value[index],
        name: editingUser.value.name,
        email: editingUser.value.email,
        role: editingUser.value.role,
        status: editingUser.value.status,
      };
      
      // Update the user in the array
      users.value[index] = updatedUser;
      
      toast.success('User updated', {
        description: `User ${updatedUser.name} has been updated successfully`,
      });
    }
    
    showEditDialog.value = false;
    isLoading.value = false;
  }, 1000);
}

function deleteUser(user: User): void {
  userToDelete.value = user;
  showDeleteDialog.value = true;
}

function confirmDeleteUser(): void {
  if (!userToDelete.value) {
    return;
  }
  
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    const index = users.value.findIndex(u => u.id === userToDelete.value!.id);
    
    if (index !== -1) {
      const deletedUser = users.value[index];
      users.value.splice(index, 1);
      
      toast.success('User deleted', {
        description: `User ${deletedUser.name} has been deleted successfully`,
      });
    }
    
    showDeleteDialog.value = false;
    userToDelete.value = null;
    isLoading.value = false;
  }, 1000);
}

function resetPassword(user: User): void {
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    toast.success('Password reset email sent', {
      description: `A password reset link has been sent to ${user.email}`,
    });
    
    isLoading.value = false;
  }, 1000);
}

function toggleUserStatus(user: User): void {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  const index = users.value.findIndex(u => u.id === user.id);
  
  if (index !== -1) {
    users.value[index].status = newStatus;
    
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`, {
      description: `User ${user.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
    });
  }
}

function impersonateUser(user: User): void {
  isLoading.value = true;
  
  try {
    // Convert the user data to the expected User type for the auth store
    const userToImpersonate = {
      id: user.id.toString(),
      email: user.email,
      fullname: user.name,
      user_type: user.role as 'superadmin' | 'admin' | 'user',
      avatar: user.avatar || '',
      created_at: user.created,
    };
    
    // Call the auth store impersonation method
    authStore.impersonateUser(userToImpersonate);
    
    toast.success('Impersonating user', {
      description: `You are now viewing the system as ${user.name}`,
    });
    
    // Close dialogs
    showEditDialog.value = false;
    
    // Redirect to the appropriate dashboard based on the role
    const redirectPath = user.role === 'admin' 
      ? '/admin/dashboard' 
      : user.role === 'user'
        ? '/user/home'
        : '/superadmin/dashboard';
    
    setTimeout(() => {
      router.push(redirectPath);
    }, 500);
  } catch (error: any) {
    toast.error('Impersonation failed', {
      description: error.message || 'Could not impersonate user',
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style> 