<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Branding & UI
        </h1>
        <p class="text-muted-foreground mt-1">
          Customize your application's branding and appearance
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex items-center gap-2" @click="resetBranding">
          <RotateCcw class="h-4 w-4" />
          <span>Reset</span>
        </Button>
        <Button size="sm" class="flex items-center gap-2" @click="saveBranding">
          <Save class="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>

    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="login">Login Screen</TabsTrigger>
      </TabsList>
      
      <!-- General Tab -->
      <TabsContent value="general" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Identity</CardTitle>
            <CardDescription>
              Configure how your application identifies itself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-6">
              <div class="space-y-4">
                <div>
                  <Label for="app-name">Application Name</Label>
                  <Input id="app-name" v-model="branding.app.name" placeholder="My Application" />
                  <p class="text-sm text-muted-foreground mt-1">
                    The name displayed in the browser title and throughout the application
                  </p>
                </div>

                <div>
                  <Label for="app-description">Application Description</Label>
                  <Textarea id="app-description" v-model="branding.app.description" placeholder="A brief description of your application" />
                  <p class="text-sm text-muted-foreground mt-1">
                    Used in meta tags and for SEO purposes
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logos & Favicon</CardTitle>
            <CardDescription>
              Upload your organization's logos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Light Mode Logo</Label>
                <div class="mt-2 flex flex-col items-center justify-center border rounded-md p-6 bg-white">
                  <div class="h-24 flex items-center justify-center mb-4">
                    <img 
                      v-if="branding.ui.branding.logoLight" 
                      :src="branding.ui.branding.logoLight" 
                      alt="Light logo" 
                      class="max-h-24 max-w-full"
                    />
                    <div v-else class="text-muted-foreground text-center">
                      No logo uploaded
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="outline" size="sm" @click="selectLogoFile('light')">
                      <Upload class="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <Button v-if="branding.ui.branding.logoLight" variant="outline" size="sm" @click="removeLogo('light')">
                      <Trash class="h-4 w-4" />
                      <span class="sr-only">Remove Logo</span>
                    </Button>
                  </div>
                  <input
                    ref="lightLogoInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleLogoUpload('light', $event)"
                  />
                </div>
              </div>
              
              <div>
                <Label>Dark Mode Logo</Label>
                <div class="mt-2 flex flex-col items-center justify-center border rounded-md p-6 bg-slate-900">
                  <div class="h-24 flex items-center justify-center mb-4">
                    <img 
                      v-if="branding.ui.branding.logoDark" 
                      :src="branding.ui.branding.logoDark" 
                      alt="Dark logo" 
                      class="max-h-24 max-w-full"
                    />
                    <div v-else class="text-muted-foreground text-center">
                      No logo uploaded
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="outline" size="sm" @click="selectLogoFile('dark')">
                      <Upload class="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <Button v-if="branding.ui.branding.logoDark" variant="outline" size="sm" @click="removeLogo('dark')">
                      <Trash class="h-4 w-4" />
                      <span class="sr-only">Remove Logo</span>
                    </Button>
                  </div>
                  <input
                    ref="darkLogoInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleLogoUpload('dark', $event)"
                  />
                </div>
              </div>
            </div>

            <div class="mt-6">
              <Label>Favicon</Label>
              <div class="mt-2 flex flex-col items-center justify-center border rounded-md p-6">
                <div class="h-16 w-16 flex items-center justify-center mb-4 border">
                  <img 
                    v-if="branding.ui.branding.favicon" 
                    :src="branding.ui.branding.favicon" 
                    alt="Favicon" 
                    class="max-h-16 max-w-16"
                  />
                  <div v-else class="text-muted-foreground text-center text-xs">
                    No favicon
                  </div>
                </div>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="selectLogoFile('favicon')">
                    <Upload class="h-4 w-4 mr-2" />
                    Upload Favicon
                  </Button>
                  <Button v-if="branding.ui.branding.favicon" variant="outline" size="sm" @click="removeLogo('favicon')">
                    <Trash class="h-4 w-4" />
                    <span class="sr-only">Remove Favicon</span>
                  </Button>
                </div>
                <input
                  ref="faviconInput"
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  class="hidden"
                  @change="handleLogoUpload('favicon', $event)"
                />
                <p class="text-sm text-muted-foreground mt-4">
                  Recommended: 32x32 PNG or ICO file
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Layout Settings</CardTitle>
            <CardDescription>
              Configure the application layout preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <Label>Content Width</Label>
                <RadioGroup v-model="branding.ui.layout.contentWidth" class="mt-2">
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="content-full" />
                    <Label for="content-full">Full Width</Label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem value="boxed" id="content-boxed" />
                    <Label for="content-boxed">Boxed</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div class="flex items-center space-x-2">
                  <Checkbox id="sidebar-collapsed" v-model="branding.ui.layout.sidebarCollapsed" />
                  <Label for="sidebar-collapsed">Default Sidebar Collapsed</Label>
                </div>
                <p class="text-sm text-muted-foreground ml-6 mt-1">
                  When enabled, the sidebar will be collapsed by default for new users
                </p>
              </div>

              <div>
                <div class="flex items-center space-x-2">
                  <Checkbox id="default-dark" v-model="branding.ui.layout.defaultDarkMode" />
                  <Label for="default-dark">Default to Dark Mode</Label>
                </div>
                <p class="text-sm text-muted-foreground ml-6 mt-1">
                  When enabled, the application will default to dark mode for new users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <!-- Login Screen Tab -->
      <TabsContent value="login" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Login Screen</CardTitle>
            <CardDescription>
              Customize the login screen appearance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Settings Form -->
              <div class="space-y-6">
                <div>
                  <Label for="login-title">Login Title</Label>
                  <Input id="login-title" v-model="branding.auth.login.title" placeholder="Welcome to My App" />
                  <p class="text-sm text-muted-foreground mt-1">
                    The main heading shown on the login screen
                  </p>
                </div>
                
                <div>
                  <Label for="login-subtitle">Login Subtitle</Label>
                  <Input id="login-subtitle" v-model="branding.auth.login.subtitle" placeholder="Sign in to your account" />
                  <p class="text-sm text-muted-foreground mt-1">
                    Descriptive text shown below the title
                  </p>
                </div>
                
                <div>
                  <Label>Background Image</Label>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    <div 
                      v-for="image in backgroundImages" 
                      :key="image.id"
                      class="relative border rounded-md overflow-hidden cursor-pointer"
                      :class="{ 'ring-2 ring-primary': image.url === branding.auth.login.backgroundImage }"
                      @click="branding.auth.login.backgroundImage = image.url"
                    >
                      <img :src="image.url" :alt="image.name" class="w-full h-20 object-cover" />
                      <div class="absolute bottom-0 left-0 right-0 bg-background/80 p-1 text-xs text-center">
                        {{ image.name }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <Button variant="outline" type="button" class="w-full" @click="selectLogoFile('background')">
                      <Upload class="h-4 w-4 mr-2" />
                      Upload Custom Image
                    </Button>
                    <input
                      ref="backgroundInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleLogoUpload('background', $event)"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Preview -->
              <div>
                <div class="mb-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="previewDarkMode = !previewDarkMode"
                  >
                    {{ previewDarkMode ? 'Dark Mode' : 'Light Mode' }}
                  </Button>
                </div>
                <div 
                  class="border rounded-lg overflow-hidden h-96 relative flex items-center justify-center"
                  :class="previewDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'"
                >
                  <div class="absolute inset-0 opacity-50">
                    <img 
                      :src="branding.auth.login.backgroundImage" 
                      alt="Background" 
                      class="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div class="relative z-10 bg-background/80 p-8 rounded-lg max-w-sm mx-auto">
                    <h2 class="text-2xl font-bold text-center">{{ branding.auth.login.title }}</h2>
                    <p class="text-center text-muted-foreground mt-2">{{ branding.auth.login.subtitle }}</p>
                    
                    <div class="mt-6 space-y-4">
                      <div>
                        <Label>Email</Label>
                        <Input placeholder="example@mail.com" disabled />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input type="password" placeholder="********" disabled />
                      </div>
                      <Button class="w-full" disabled>Sign In</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from '@/composables/useToast';
import { useConfigStore } from '@/stores/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Save,
  Trash,
  RotateCcw,
  Upload,
} from 'lucide-vue-next';

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminBranding',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});

const configStore = useConfigStore();
const toast = useToast();

// File upload references
const lightLogoInput = ref<HTMLInputElement | null>(null);
const darkLogoInput = ref<HTMLInputElement | null>(null);
const faviconInput = ref<HTMLInputElement | null>(null);
const backgroundInput = ref<HTMLInputElement | null>(null);

// UI state
const previewDarkMode = ref(false);
const isLoading = ref(false);

// Clone the config to make it editable
const branding = ref(JSON.parse(JSON.stringify({
  app: configStore.config.app,
  ui: configStore.config.ui,
  auth: configStore.config.auth
})));

// Sample background images
const backgroundImages = ref([
  { id: 1, url: '/images/auth-background.jpg', name: 'Default' },
  { id: 2, url: '/images/auth-background-2.jpg', name: 'Mountains' },
  { id: 3, url: '/images/auth-background-3.jpg', name: 'Abstract' },
  { id: 4, url: '/images/auth-background-4.jpg', name: 'Cityscape' },
]);

// Methods
function selectLogoFile(type: 'light' | 'dark' | 'favicon' | 'background') {
  switch (type) {
    case 'light':
      lightLogoInput.value?.click();
      break;
    case 'dark':
      darkLogoInput.value?.click();
      break;
    case 'favicon':
      faviconInput.value?.click();
      break;
    case 'background':
      backgroundInput.value?.click();
      break;
  }
}

function handleLogoUpload(type: 'light' | 'dark' | 'favicon' | 'background', event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    
    // In a real implementation, this would upload the file to a server
    // and return a URL. For now, we'll create a fake URL using FileReader.
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        switch (type) {
          case 'light':
            branding.value.ui.branding.logoLight = e.target.result as string;
            break;
          case 'dark':
            branding.value.ui.branding.logoDark = e.target.result as string;
            break;
          case 'favicon':
            branding.value.ui.branding.favicon = e.target.result as string;
            break;
          case 'background':
            // Add the new image to the list and select it
            const newImage = {
              id: backgroundImages.value.length + 1,
              url: e.target.result as string,
              name: 'Custom'
            };
            backgroundImages.value.push(newImage);
            branding.value.auth.login.backgroundImage = newImage.url;
            break;
        }
        
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
      }
    };
    reader.readAsDataURL(file);
  }
}

function removeLogo(type: 'light' | 'dark' | 'favicon') {
  switch (type) {
    case 'light':
      branding.value.ui.branding.logoLight = '';
      break;
    case 'dark':
      branding.value.ui.branding.logoDark = '';
      break;
    case 'favicon':
      branding.value.ui.branding.favicon = '';
      break;
  }
  toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} logo removed`);
}

function saveBranding() {
  isLoading.value = true;
  
  try {
    // Update application configuration
    configStore.updateConfig('app', branding.value.app);
    configStore.updateConfig('ui', branding.value.ui);
    configStore.updateConfig('auth', branding.value.auth);
    
    toast.success('Branding settings saved successfully');
  } catch (error) {
    console.error('Failed to save branding settings:', error);
    toast.error('Failed to save branding settings');
  } finally {
    isLoading.value = false;
  }
}

function resetBranding() {
  if (confirm('Are you sure you want to reset branding to default settings? All changes will be lost.')) {
    branding.value = JSON.parse(JSON.stringify({
      app: configStore.getConfig.app,
      ui: configStore.getConfig.ui,
      auth: configStore.getConfig.auth
    }));
    
    toast.success('Branding settings reset to default');
  }
}

onMounted(() => {
  // Load initial branding settings from config store
  branding.value = JSON.parse(JSON.stringify({
    app: configStore.config.app,
    ui: configStore.config.ui,
    auth: configStore.config.auth
  }));
});
</script> 