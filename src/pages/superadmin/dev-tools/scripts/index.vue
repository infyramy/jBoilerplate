<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from '@/composables/useToast';
import { Tabs } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import { TabsList } from '@/components/ui/tabs';
import { TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AlertDescription } from '@/components/ui/alert';
import { AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Code } from 'lucide-vue-next';

const configStore = useConfigStore();
const toast = useToast();

// State
const isLoading = ref(false);
const headScripts = ref<string>('');
const bodyScripts = ref<string>('');
const activeTab = ref('head');
const scriptStatus = ref<{ head: boolean; body: boolean }>({ head: false, body: false });
const scriptError = ref<{ head: string | null; body: string | null }>({ head: null, body: null });

// Load scripts from config store
const loadScripts = () => {
  isLoading.value = true;
  
  try {
    // Get scripts from config store
    const injectScripts = configStore.config.developer.injectScripts;
    headScripts.value = injectScripts.head.join('\n');
    bodyScripts.value = injectScripts.body.join('\n');
    
    // Initialize status based on script content
    scriptStatus.value = {
      head: injectScripts.head.length > 0,
      body: injectScripts.body.length > 0
    };
    
    scriptError.value = { head: null, body: null };
  } catch (error) {
    console.error('Failed to load scripts:', error);
    toast.error('Failed to load custom scripts');
  } finally {
    isLoading.value = false;
  }
};

// Save scripts to config store
const saveScripts = async (type: 'head' | 'body') => {
  isLoading.value = true;
  scriptError.value[type] = null;
  
  try {
    // Validate scripts
    if (type === 'head' && !validateScript(headScripts.value)) {
      scriptError.value.head = 'Invalid script syntax. Please check your code.';
      toast.error('Invalid script syntax');
      return;
    }
    
    if (type === 'body' && !validateScript(bodyScripts.value)) {
      scriptError.value.body = 'Invalid script syntax. Please check your code.';
      toast.error('Invalid script syntax');
      return;
    }
    
    // Split scripts by line and filter out empty ones
    const scripts = type === 'head' 
      ? headScripts.value.split('\n').filter(s => s.trim() !== '')
      : bodyScripts.value.split('\n').filter(s => s.trim() !== '');
    
    // Update config store
    await configStore.updateConfig('developer', {
      injectScripts: {
        ...configStore.config.developer.injectScripts,
        [type]: scripts
      }
    });
    
    // Update status
    scriptStatus.value[type] = scripts.length > 0;
    
    toast.success(`${type === 'head' ? 'Head' : 'Body'} scripts saved successfully`);
  } catch (error) {
    console.error(`Failed to save ${type} scripts:`, error);
    scriptError.value[type] = 'Failed to save scripts. Please try again.';
    toast.error(`Failed to save ${type} scripts`);
  } finally {
    isLoading.value = false;
  }
};

// Validate script syntax (basic validation)
const validateScript = (script: string): boolean => {
  try {
    // Look for unbalanced script tags, which is a common error
    const openTags = (script.match(/<script/g) || []).length;
    const closeTags = (script.match(/<\/script>/g) || []).length;
    
    if (openTags !== closeTags) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Script validation error:', error);
    return false;
  }
};

// Reset scripts
const resetScripts = (type: 'head' | 'body') => {
  if (type === 'head') {
    headScripts.value = '';
  } else {
    bodyScripts.value = '';
  }
  
  scriptError.value[type] = null;
};

onMounted(() => {
  loadScripts();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Custom Scripts</h1>
    
    <p class="text-muted-foreground mb-6">
      Add custom JavaScript or CSS scripts to be injected into the application. 
      Head scripts will be injected in the <code>&lt;head&gt;</code> section, 
      while body scripts will be injected at the end of the <code>&lt;body&gt;</code> section.
    </p>
    
    <Alert variant="default" class="mb-6 border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
      <AlertTriangle class="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Adding custom scripts can potentially cause conflicts or security issues.
        Only add scripts from trusted sources and make sure they don't interfere with the application's functionality.
      </AlertDescription>
    </Alert>
    
    <Tabs defaultValue="head" v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="head">
          Head Scripts
          <span v-if="scriptStatus.head" class="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </TabsTrigger>
        <TabsTrigger value="body">
          Body Scripts
          <span v-if="scriptStatus.body" class="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="head">
        <Card>
          <CardHeader>
            <CardTitle>Head Scripts</CardTitle>
            <CardDescription>
              These scripts will be injected in the <code>&lt;head&gt;</code> section of the application.
              Useful for adding third-party libraries, analytics, or custom CSS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="scriptError.head" class="mb-4">
              <Alert variant="destructive">
                <AlertTriangle class="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{{ scriptError.head }}</AlertDescription>
              </Alert>
            </div>
            
            <div class="relative">
              <Code class="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
              <textarea
                v-model="headScripts"
                class="min-h-[300px] w-full resize-y rounded-md border border-input bg-transparent pl-10 py-3 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="<!-- Add your custom head scripts here -->"
                :disabled="isLoading"
              ></textarea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" @click="resetScripts('head')" :disabled="isLoading">
              Reset
            </Button>
            <Button @click="saveScripts('head')" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Head Scripts
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="body">
        <Card>
          <CardHeader>
            <CardTitle>Body Scripts</CardTitle>
            <CardDescription>
              These scripts will be injected at the end of the <code>&lt;body&gt;</code> section of the application.
              Useful for adding tracking codes, widgets, or other scripts that should load after the page content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="scriptError.body" class="mb-4">
              <Alert variant="destructive">
                <AlertTriangle class="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{{ scriptError.body }}</AlertDescription>
              </Alert>
            </div>
            
            <div class="relative">
              <Code class="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
              <textarea
                v-model="bodyScripts"
                class="min-h-[300px] w-full resize-y rounded-md border border-input bg-transparent pl-10 py-3 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="<!-- Add your custom body scripts here -->"
                :disabled="isLoading"
              ></textarea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" @click="resetScripts('body')" :disabled="isLoading">
              Reset
            </Button>
            <Button @click="saveScripts('body')" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Save Body Scripts
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template> 