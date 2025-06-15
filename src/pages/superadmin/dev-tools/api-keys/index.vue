<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { DialogDescription } from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { AlertTitle } from '@/components/ui/alert';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { TableHead } from '@/components/ui/table';
import { TableHeader } from '@/components/ui/table';
import { TableRow } from '@/components/ui/table';
import { Loader2, AlertTriangle, Key, Copy, Check, MoreHorizontal } from 'lucide-vue-next';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  expires: string | null;
  status: 'active' | 'inactive' | 'expired';
  lastUsed: string | null;
}

const configStore = useConfigStore();
const toast = useToast();

// State
const isLoading = ref(false);
const apiKeys = ref<ApiKey[]>([]);
const showNewKeyDialog = ref(false);
const showKeyDialog = ref(false);
const newKeyName = ref('');
const newKeyExpiry = ref('');
const generatedKey = ref<string | null>(null);
const selectedKey = ref<ApiKey | null>(null);
const copied = ref(false);
const searchTerm = ref('');

// Load API keys
const loadApiKeys = () => {
  isLoading.value = true;
  
  try {
    // In a real implementation, this would come from the config store
    // For now, we'll use mock data
    apiKeys.value = [
      {
        id: '1',
        name: 'Admin API',
        key: 'jb_admin_12345678',
        created: '2023-06-01T12:00:00Z',
        expires: null,
        status: 'active',
        lastUsed: '2023-06-05T14:30:00Z',
      },
      {
        id: '2',
        name: 'Import API',
        key: 'jb_import_87654321',
        created: '2023-06-02T10:00:00Z',
        expires: '2024-06-02T10:00:00Z',
        status: 'active',
        lastUsed: '2023-06-04T08:45:00Z',
      },
      {
        id: '3',
        name: 'Export API',
        key: 'jb_export_11223344',
        created: '2023-06-03T15:00:00Z',
        expires: '2023-07-03T15:00:00Z',
        status: 'inactive',
        lastUsed: null,
      },
    ];
  } catch (error) {
    console.error('Failed to load API keys:', error);
    toast.error('Failed to load API keys');
  } finally {
    isLoading.value = false;
  }
};

// Filter API keys based on search term
const filteredApiKeys = computed(() => {
  if (!searchTerm.value) {
    return apiKeys.value;
  }
  
  const term = searchTerm.value.toLowerCase();
  return apiKeys.value.filter(key => 
    key.name.toLowerCase().includes(term) || 
    key.key.toLowerCase().includes(term)
  );
});

// Generate new API key
const generateApiKey = () => {
  if (!newKeyName.value) {
    toast.error('Please enter a name for the API key');
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Generate a random key
    const keyPrefix = 'jb_' + newKeyName.value.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 10);
    const randomPart = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 36).toString(36)
    ).join('');
    
    const newKey = `${keyPrefix}_${randomPart}`;
    
    // Create expiry date if set
    let expiryDate = null;
    if (newKeyExpiry.value) {
      expiryDate = new Date(newKeyExpiry.value).toISOString();
    }
    
    // Create new API key object
    const apiKey: ApiKey = {
      id: (apiKeys.value.length + 1).toString(),
      name: newKeyName.value,
      key: newKey,
      created: new Date().toISOString(),
      expires: expiryDate,
      status: 'active',
      lastUsed: null,
    };
    
    // Add to the list
    apiKeys.value.push(apiKey);
    
    // Show the generated key
    generatedKey.value = newKey;
    showNewKeyDialog.value = false;
    showKeyDialog.value = true;
    
    // Reset form
    newKeyName.value = '';
    newKeyExpiry.value = '';
    
    // In a real implementation, this would update the config store
  } catch (error) {
    console.error('Failed to generate API key:', error);
    toast.error('Failed to generate API key');
  } finally {
    isLoading.value = false;
  }
};

// Copy API key to clipboard
const copyToClipboard = (key: string) => {
  navigator.clipboard.writeText(key).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
    toast.success('API key copied to clipboard');
  }).catch(() => {
    toast.error('Failed to copy API key');
  });
};

// Toggle API key status
const toggleKeyStatus = (key: ApiKey) => {
  key.status = key.status === 'active' ? 'inactive' : 'active';
  toast.success(`API key ${key.status === 'active' ? 'activated' : 'deactivated'}`);
};

// Delete API key
const deleteKey = (key: ApiKey) => {
  apiKeys.value = apiKeys.value.filter(k => k.id !== key.id);
  toast.success('API key deleted');
};

// Format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// View key details
const viewKeyDetails = (key: ApiKey) => {
  selectedKey.value = key;
  showKeyDialog.value = true;
  generatedKey.value = key.key;
};

onMounted(() => {
  loadApiKeys();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">API Keys</h1>
    
    <div class="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
      <p class="text-muted-foreground max-w-xl">
        Manage API keys for external services to interact with your application.
        Each key should be used for a specific purpose and can be revoked at any time.
      </p>
      
      <Button @click="showNewKeyDialog = true" class="whitespace-nowrap">
        <Key class="mr-2 h-4 w-4" />
        Generate API Key
      </Button>
    </div>
    
    <Card>
      <CardHeader>
        <div class="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <CardTitle>API Keys</CardTitle>
          <Input 
            v-model="searchTerm"
            placeholder="Search keys..."
            class="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="filteredApiKeys.length === 0">
              <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
                No API keys found
              </TableCell>
            </TableRow>
            
            <TableRow v-for="key in filteredApiKeys" :key="key.id">
              <TableCell class="font-medium">{{ key.name }}</TableCell>
              <TableCell>{{ formatDate(key.created) }}</TableCell>
              <TableCell>{{ key.expires ? formatDate(key.expires) : 'Never' }}</TableCell>
              <TableCell>{{ key.lastUsed ? formatDate(key.lastUsed) : 'Never' }}</TableCell>
              <TableCell>
                <Badge 
                  :variant="key.status === 'active' ? 'default' : 'secondary'"
                  class="capitalize"
                >
                  {{ key.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span class="sr-only">Open menu</span>
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="viewKeyDetails(key)">
                      View Key
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="toggleKeyStatus(key)">
                      {{ key.status === 'active' ? 'Deactivate' : 'Activate' }}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      @click="deleteKey(key)"
                      class="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    
    <!-- New API Key Dialog -->
    <Dialog v-model:open="showNewKeyDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for external service integrations.
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="key-name">Key Name</Label>
            <Input
              id="key-name"
              v-model="newKeyName"
              placeholder="Admin API"
            />
            <p class="text-sm text-muted-foreground">
              A descriptive name to identify this API key's purpose
            </p>
          </div>
          
          <div class="space-y-2">
            <Label for="key-expiry">Expiration (Optional)</Label>
            <Input
              id="key-expiry"
              type="date"
              v-model="newKeyExpiry"
            />
            <p class="text-sm text-muted-foreground">
              Set an expiration date or leave blank for a non-expiring key
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" @click="showNewKeyDialog = false">
            Cancel
          </Button>
          <Button @click="generateApiKey" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Generate Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- API Key Dialog -->
    <Dialog v-model:open="showKeyDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
          <DialogDescription>
            {{ selectedKey ? 'Details for ' + selectedKey.name : 'Your new API key has been generated' }}
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4 py-4">
          <Alert variant="default" class="border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle class="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This key will only be shown once. Please copy it now and store it securely.
            </AlertDescription>
          </Alert>
          
          <div class="space-y-2">
            <Label>API Key</Label>
            <div class="flex items-center gap-2">
              <Input
                value="••••••••••••••••••••••••••••••"
                disabled
                class="font-mono flex-1"
              />
              <Button variant="outline" size="icon" @click="copyToClipboard(generatedKey!)">
                <span class="sr-only">Copy</span>
                <Copy v-if="!copied" class="h-4 w-4" />
                <Check v-else class="h-4 w-4" />
              </Button>
            </div>
            <p class="text-sm text-muted-foreground">
              Keep this key secure. Anyone with this key can access your API.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button @click="showKeyDialog = false">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template> 