<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from 'lucide-vue-next';

const configStore = useConfigStore();
const toast = useToast();

const envVariables = ref<{key: string; value: string; description: string; isSecret: boolean}[]>([]);
const isLoading = ref(false);
const isAddingVariable = ref(false);
const newVariable = ref({ key: '', value: '', description: '', isSecret: false });
const searchTerm = ref('');
const showSecrets = ref(false);

// Environment categories
const categories = [
  { id: 'all', label: 'All' },
  { id: 'app', label: 'Application' },
  { id: 'api', label: 'API' },
  { id: 'database', label: 'Database' },
  { id: 'security', label: 'Security' },
  { id: 'integration', label: 'Integrations' }
];

const selectedCategory = ref('all');

// Filtered variables based on search and category
const filteredVariables = computed(() => {
  let filtered = envVariables.value;
  
  if (searchTerm.value) {
    filtered = filtered.filter(v => 
      v.key.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(v => v.key.toLowerCase().startsWith(selectedCategory.value.toLowerCase()));
  }
  
  return filtered;
});

// Load environment variables
async function loadEnvironmentVariables() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would come from an API
    // For now, we'll use mock data
    envVariables.value = [
      { key: 'APP_NAME', value: 'jBoilerplate', description: 'Application name', isSecret: false },
      { key: 'APP_URL', value: 'http://localhost:3000', description: 'Application URL', isSecret: false },
      { key: 'API_TIMEOUT', value: '30000', description: 'API request timeout in ms', isSecret: false },
      { key: 'DATABASE_HOST', value: 'localhost', description: 'Database host', isSecret: false },
      { key: 'DATABASE_PORT', value: '5432', description: 'Database port', isSecret: false },
      { key: 'DATABASE_NAME', value: 'jboilerplate', description: 'Database name', isSecret: false },
      { key: 'DATABASE_USER', value: 'db_user', description: 'Database username', isSecret: true },
      { key: 'DATABASE_PASSWORD', value: '********', description: 'Database password', isSecret: true },
      { key: 'JWT_SECRET', value: '********', description: 'JWT secret key', isSecret: true },
      { key: 'MAILGUN_API_KEY', value: '********', description: 'Mailgun API key', isSecret: true },
      { key: 'MAILGUN_DOMAIN', value: 'mail.example.com', description: 'Mailgun domain', isSecret: false },
    ];
  } catch (error) {
    console.error(error);
    toast.error('Failed to load environment variables');
  } finally {
    isLoading.value = false;
  }
}

// Add new environment variable
function addEnvironmentVariable() {
  if (!newVariable.value.key || !newVariable.value.value) {
    toast.error('Key and value are required');
    return;
  }
  
  // Check for duplicates
  if (envVariables.value.some(v => v.key === newVariable.value.key)) {
    toast.error(`Variable ${newVariable.value.key} already exists`);
    return;
  }
  
  envVariables.value.push({ ...newVariable.value });
  newVariable.value = { key: '', value: '', description: '', isSecret: false };
  isAddingVariable.value = false;
  
  toast.success('Environment variable added');
}

// Edit environment variable
function editVariable(variable: {key: string; value: string; description: string; isSecret: boolean}) {
  newVariable.value = { ...variable };
  isAddingVariable.value = true;
}

// Update environment variable
function updateEnvironmentVariable() {
  const index = envVariables.value.findIndex(v => v.key === newVariable.value.key);
  if (index !== -1) {
    envVariables.value[index] = { ...newVariable.value };
    newVariable.value = { key: '', value: '', description: '', isSecret: false };
    isAddingVariable.value = false;
    
    toast.success(`Variable ${newVariable.value.key} updated`);
  }
}

// Delete environment variable
function deleteEnvironmentVariable(key: string) {
  if (confirm(`Are you sure you want to delete the variable ${key}?`)) {
    const index = envVariables.value.findIndex(v => v.key === key);
    if (index !== -1) {
      envVariables.value.splice(index, 1);
      toast.success(`Variable ${key} deleted`);
    }
  }
}

// Save all environment variables
function saveEnvironmentVariables() {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would be an API call
    setTimeout(() => {
      toast.success('Environment variables saved');
      isLoading.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
    toast.error('Failed to save environment variables');
    isLoading.value = false;
  }
}

// Close dialog and reset form
function cancelAddVariable() {
  isAddingVariable.value = false;
  newVariable.value = { key: '', value: '', description: '', isSecret: false };
}

onMounted(() => {
  loadEnvironmentVariables();
});

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminEnvironmentVariables',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">Environment Variables</h1>
    <p class="text-muted-foreground mb-6">
      Manage environment variables for your application
    </p>
    
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-4 items-center">
        <Input 
          v-model="searchTerm" 
          placeholder="Search variables..." 
          class="w-64"
        />
        
        <Select v-model="selectedCategory">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.label }}
          </option>
        </Select>
        
        <div class="flex items-center space-x-2">
          <Checkbox 
            id="show-secrets"
            v-model="showSecrets"
          />
          <Label for="show-secrets">Show secret values</Label>
        </div>
      </div>
      
      <Button @click="isAddingVariable = true">
        Add Variable
      </Button>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>These variables configure the behavior of your application</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="variable in filteredVariables" :key="variable.key">
              <TableCell class="font-medium">{{ variable.key }}</TableCell>
              <TableCell>
                <span v-if="variable.isSecret && !showSecrets">********</span>
                <span v-else>{{ variable.value }}</span>
              </TableCell>
              <TableCell>{{ variable.description }}</TableCell>
              <TableCell>
                <Badge :variant="variable.isSecret ? 'destructive' : 'default'">
                  {{ variable.isSecret ? 'Secret' : 'Public' }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button variant="ghost" size="sm" @click="editVariable(variable)">Edit</Button>
                  <Button variant="ghost" size="sm" @click="deleteEnvironmentVariable(variable.key)">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="filteredVariables.length === 0">
              <TableCell colspan="5" class="text-center py-4 text-muted-foreground">
                No environment variables found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button @click="saveEnvironmentVariables" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
    
    <!-- Add/Edit Variable Dialog -->
    <Dialog v-model:open="isAddingVariable">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ newVariable.key ? 'Edit' : 'Add' }} Environment Variable</DialogTitle>
          <DialogDescription>
            {{ newVariable.key ? 'Edit an existing' : 'Add a new' }} environment variable to the application
          </DialogDescription>
        </DialogHeader>
        
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="key" class="text-right">Key</Label>
            <Input
              id="key"
              v-model="newVariable.key"
              placeholder="APP_NAME"
              class="col-span-3"
              :disabled="!!newVariable.key"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="value" class="text-right">Value</Label>
            <Input
              id="value"
              v-model="newVariable.value"
              :type="newVariable.isSecret ? 'password' : 'text'"
              placeholder="My App"
              class="col-span-3"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="description" class="text-right">Description</Label>
            <Input
              id="description"
              v-model="newVariable.description"
              placeholder="Application name"
              class="col-span-3"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="is-secret" class="text-right">Secret</Label>
            <div class="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="is-secret"
                v-model="newVariable.isSecret"
              />
              <Label for="is-secret">This is a sensitive value</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="cancelAddVariable">Cancel</Button>
          <Button @click="newVariable.key ? updateEnvironmentVariable() : addEnvironmentVariable()">
            {{ newVariable.key ? 'Update' : 'Add' }} Variable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template> 