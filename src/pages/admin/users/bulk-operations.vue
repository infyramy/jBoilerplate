<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Bulk User Operations</h1>
        <p class="text-muted-foreground">Import, export, and manage users in bulk</p>
      </div>
    </div>
    
    <div class="grid gap-4 md:grid-cols-2">
      <!-- Import Users Card -->
      <Card>
        <CardHeader>
          <CardTitle>Import Users</CardTitle>
          <CardDescription>Upload a CSV or Excel file to create multiple users at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <Select v-model="importOptions.defaultRole">
                <SelectTrigger>
                  <SelectValue placeholder="Select default role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="role in roles" :key="role.value" :value="role.value">
                    {{ role.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select v-model="importOptions.sendWelcomeEmail">
                <SelectTrigger class="w-[200px]">
                  <SelectValue placeholder="Welcome email option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Send welcome email</SelectItem>
                  <SelectItem value="no">Don't send email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div class="grid w-full items-center gap-1.5">
              <Label for="csv-upload">Upload CSV</Label>
              <Input id="csv-upload" type="file" accept=".csv,.xlsx" @change="handleFileUpload" />
              <p class="text-xs text-muted-foreground">
                File must include headers: name, email, role (optional)
              </p>
            </div>
            
            <div v-if="importPreview.length > 0" class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="(user, index) in importPreview" :key="index">
                    <TableCell>{{ user.name }}</TableCell>
                    <TableCell>{{ user.email }}</TableCell>
                    <TableCell>{{ user.role }}</TableCell>
                    <TableCell>
                      <Badge v-if="user.status === 'valid'" class="bg-green-100 text-green-800">
                        Valid
                      </Badge>
                      <Badge v-else variant="destructive">
                        {{ user.status }}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button 
            variant="outline" 
            @click="resetImport"
            v-if="importPreview.length > 0"
          >
            Reset
          </Button>
          <Button 
            @click="processImport" 
            :disabled="loading || importPreview.length === 0 || !canImport"
          >
            <Upload v-if="!loading" class="mr-2 h-4 w-4" />
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
            Import Users
          </Button>
        </CardFooter>
      </Card>
      
      <!-- Export Users Card -->
      <Card>
        <CardHeader>
          <CardTitle>Export Users</CardTitle>
          <CardDescription>Download user data in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <Select v-model="exportOptions.format">
                <SelectTrigger>
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
              
              <Select v-model="exportOptions.userType">
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div class="space-y-2">
              <Label>Select Fields to Export</Label>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="field in exportFields" :key="field.value" class="flex items-center space-x-2">
                  <Checkbox 
                    :id="`field-${field.value}`" 
                    v-model:checked="field.selected"
                  />
                  <Label :for="`field-${field.value}`" class="text-sm">{{ field.label }}</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            class="w-full" 
            @click="exportUsers" 
            :disabled="loading || !canExport"
          >
            <Download v-if="!loading" class="mr-2 h-4 w-4" />
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
            Export Users
          </Button>
        </CardFooter>
      </Card>
    </div>
    
    <!-- Bulk Actions Card -->
    <Card>
      <CardHeader>
        <CardTitle>Bulk Actions</CardTitle>
        <CardDescription>Perform actions on multiple users at once</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Select v-model="bulkAction">
              <SelectTrigger class="w-[200px]">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">Activate Users</SelectItem>
                <SelectItem value="deactivate">Deactivate Users</SelectItem>
                <SelectItem value="changeRole">Change Role</SelectItem>
                <SelectItem value="delete">Delete Users</SelectItem>
                <SelectItem value="sendEmail">Send Email</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              v-if="bulkAction === 'changeRole'" 
              v-model="bulkActionRole"
              class="w-[200px]"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role.value" :value="role.value">
                  {{ role.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Input 
              v-if="bulkAction === 'sendEmail'" 
              v-model="bulkActionEmailSubject"
              placeholder="Email subject" 
              class="w-[300px]"
            />
          </div>
          
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[50px]">
                    <Checkbox 
                      id="select-all" 
                      :checked="selectAll" 
                      @update:checked="toggleSelectAll"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="user in users" :key="user.id">
                  <TableCell>
                    <Checkbox 
                      :id="`select-user-${user.id}`" 
                      v-model:checked="user.selected"
                      @update:checked="updateSelectAll"
                    />
                  </TableCell>
                  <TableCell>{{ user.name }}</TableCell>
                  <TableCell>{{ user.email }}</TableCell>
                  <TableCell>{{ user.role }}</TableCell>
                  <TableCell>
                    <Badge 
                      :class="{
                        'bg-green-100 text-green-800': user.status === 'active',
                        'bg-gray-100 text-gray-800': user.status === 'inactive',
                        'bg-yellow-100 text-yellow-800': user.status === 'suspended'
                      }"
                    >
                      {{ user.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          @click="applyBulkAction"
          :disabled="loading || selectedUsers.length === 0 || !bulkAction"
          class="ml-auto"
        >
          <CheckCircle v-if="!loading" class="mr-2 h-4 w-4" />
          <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
          Apply to {{ selectedUsers.length }} User{{ selectedUsers.length !== 1 ? 's' : '' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  CheckCircle, Download, Upload
} from "lucide-vue-next";

// Toast service - temporary mock implementation until toast component is available
const useToast = () => {
  return {
    toast: (props: { title: string; description: string; variant: string }) => {
      console.log(`[Toast] ${props.title}: ${props.description} (${props.variant})`);
    }
  };
};
const { toast } = useToast();

// Role options
const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'User', value: 'user' },
];

// Import options
const importOptions = ref({
  defaultRole: 'user',
  sendWelcomeEmail: 'yes'
});

const importPreview = ref<any[]>([]);
const loading = ref(false);

// Export options
const exportOptions = ref({
  format: 'csv',
  userType: 'all'
});

const exportFields = ref([
  { label: 'ID', value: 'id', selected: true },
  { label: 'Name', value: 'name', selected: true },
  { label: 'Email', value: 'email', selected: true },
  { label: 'Role', value: 'role', selected: true },
  { label: 'Status', value: 'status', selected: true },
  { label: 'Created Date', value: 'created_at', selected: true },
  { label: 'Last Login', value: 'last_login', selected: false },
  { label: 'Phone', value: 'phone', selected: false },
  { label: 'Address', value: 'address', selected: false },
]);

// Bulk action options
const bulkAction = ref('');
const bulkActionRole = ref('');
const bulkActionEmailSubject = ref('');

// Mock user data
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', created_at: '2023-01-15', selected: false },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active', created_at: '2023-02-20', selected: false },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', created_at: '2023-03-10', selected: false },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', created_at: '2023-04-05', selected: false },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'manager', status: 'suspended', created_at: '2023-05-12', selected: false },
  { id: 6, name: 'David Miller', email: 'david@example.com', role: 'user', status: 'active', created_at: '2023-06-18', selected: false },
  { id: 7, name: 'Eva Garcia', email: 'eva@example.com', role: 'user', status: 'active', created_at: '2023-07-22', selected: false },
  { id: 8, name: 'Frank Thomas', email: 'frank@example.com', role: 'user', status: 'inactive', created_at: '2023-08-30', selected: false },
]);

// Computed properties
const selectedUsers = computed(() => {
  return users.value.filter(user => user.selected);
});

const selectAll = ref(false);

const canImport = computed(() => {
  return importPreview.value.length > 0 && 
    importPreview.value.every(user => user.status === 'valid');
});

const canExport = computed(() => {
  return exportFields.value.some(field => field.selected);
});

// Methods
function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // In a real app, you would parse the CSV/Excel file
  // For this demo, we'll simulate a parsed result
  
  // Simulate file parsing delay
  loading.value = true;
  setTimeout(() => {
    // Mock parsed data
    const parsedData = [
      { name: 'Michael Scott', email: 'michael@dundermifflin.com', role: 'manager', status: 'valid' },
      { name: 'Jim Halpert', email: 'jim@dundermifflin.com', role: 'user', status: 'valid' },
      { name: 'Dwight Schrute', email: 'dwight@dundermifflin.com', role: 'user', status: 'valid' },
      { name: 'Pam Beesly', email: 'pam@dundermifflin.com', role: '', status: 'valid' },
      { name: 'Invalid User', email: 'invalid-email', role: 'user', status: 'Invalid email format' }
    ];
    
    importPreview.value = parsedData;
    loading.value = false;
  }, 1000);
}

function resetImport() {
  importPreview.value = [];
  // Reset file input (would need a ref to the input element in a real implementation)
}

function processImport() {
  if (!canImport.value) return;
  
  loading.value = true;
  
  // Simulate API call to import users
  setTimeout(() => {
    const validUsers = importPreview.value.filter(user => user.status === 'valid');
    
    toast({
      title: "Users Imported",
      description: `Successfully imported ${validUsers.length} users.`,
      variant: "success"
    });
    
    resetImport();
    loading.value = false;
  }, 1500);
}

function exportUsers() {
  if (!canExport.value) return;
  
  loading.value = true;
  
  // Simulate export generation
  setTimeout(() => {
    const format = exportOptions.value.format;
    const userType = exportOptions.value.userType;
    
    // In a real app, you would generate the file and trigger a download
    
    toast({
      title: "Export Complete",
      description: `Users exported as ${format.toUpperCase()}. The download should start automatically.`,
      variant: "success"
    });
    
    loading.value = false;
  }, 1000);
}

function toggleSelectAll(value: boolean) {
  selectAll.value = value;
  users.value.forEach(user => user.selected = value);
}

function updateSelectAll() {
  selectAll.value = users.value.length > 0 && users.value.every(user => user.selected);
}

function applyBulkAction() {
  if (selectedUsers.value.length === 0 || !bulkAction.value) return;
  
  loading.value = true;
  
  // Simulate API call for bulk action
  setTimeout(() => {
    const action = bulkAction.value;
    const count = selectedUsers.value.length;
    
    let successMessage = '';
    
    switch (action) {
      case 'activate':
        // Update user status in the UI
        selectedUsers.value.forEach(user => {
          const index = users.value.findIndex(u => u.id === user.id);
          if (index !== -1) {
            users.value[index].status = 'active';
          }
        });
        successMessage = `${count} users activated successfully.`;
        break;
        
      case 'deactivate':
        // Update user status in the UI
        selectedUsers.value.forEach(user => {
          const index = users.value.findIndex(u => u.id === user.id);
          if (index !== -1) {
            users.value[index].status = 'inactive';
          }
        });
        successMessage = `${count} users deactivated successfully.`;
        break;
        
      case 'changeRole':
        if (!bulkActionRole.value) {
          toast({
            title: "Error",
            description: "Please select a role.",
            variant: "destructive"
          });
          loading.value = false;
          return;
        }
        
        // Update user roles in the UI
        selectedUsers.value.forEach(user => {
          const index = users.value.findIndex(u => u.id === user.id);
          if (index !== -1) {
            users.value[index].role = bulkActionRole.value;
          }
        });
        successMessage = `${count} users updated to role: ${bulkActionRole.value}.`;
        break;
        
      case 'delete':
        // Remove users from the UI
        const userIds = selectedUsers.value.map(user => user.id);
        users.value = users.value.filter(user => !userIds.includes(user.id));
        successMessage = `${count} users deleted successfully.`;
        break;
        
      case 'sendEmail':
        if (!bulkActionEmailSubject.value) {
          toast({
            title: "Error",
            description: "Please enter an email subject.",
            variant: "destructive"
          });
          loading.value = false;
          return;
        }
        
        successMessage = `Email sent to ${count} users with subject: "${bulkActionEmailSubject.value}".`;
        break;
    }
    
    // Reset selection
    toggleSelectAll(false);
    bulkAction.value = '';
    bulkActionRole.value = '';
    bulkActionEmailSubject.value = '';
    
    toast({
      title: "Bulk Action Completed",
      description: successMessage,
      variant: "success"
    });
    
    loading.value = false;
  }, 1500);
}
</script> 