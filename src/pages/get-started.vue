<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { clearSetupStatusCache } from '@/router/index';
import { useColorMode } from '@vueuse/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Database,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  Upload,
  FileText,
  Server,
  Shield,
  Palette,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Check,
  BookOpen,
  ExternalLink,
  Zap,
  Package
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useSystemConfigStore } from '@/stores/system-config';

const router = useRouter();
const mode = useColorMode();
const systemConfig = useSystemConfigStore();

// Step management
const currentStep = ref(1);
const completedSteps = ref<number[]>([]);

const steps = [
  {
    id: 1,
    title: 'Welcome',
    description: 'Getting started',
    icon: BookOpen,
    required: false
  },
  {
    id: 2,
    title: 'Database',
    description: 'Connect to MySQL',
    icon: Database,
    required: true
  },
  {
    id: 3,
    title: 'Configuration',
    description: 'System settings',
    icon: Settings,
    required: false
  },
  {
    id: 4,
    title: 'Branding & Theme',
    description: 'Visual identity',
    icon: Palette,
    required: false
  },
  {
    id: 5,
    title: 'Admin Account',
    description: 'Create admin user',
    icon: Shield,
    required: false
  }
];

// Theme selection - using existing jBoilerplate themes only
const selectedTheme = ref<string>('zinc');
const selectedRadius = ref<string>('0.5');

// Official Shadcn Themes (from ThemeCustomizer.vue)
const officialThemes = [
  { value: 'zinc', label: 'Zinc', description: 'Cool and modern', hsl: '240 5.9% 10%' },
  { value: 'blue', label: 'Blue', description: 'Trust and calm', hsl: '221.2 83.2% 53.3%' },
  { value: 'yellow', label: 'Yellow', description: 'Cheerful and bright', hsl: '47.9 95.8% 53.1%' },
  { value: 'orange', label: 'Orange', description: 'Vibrant and warm', hsl: '24.6 95% 53.1%' },
  { value: 'red', label: 'Red', description: 'Bold and energetic', hsl: '0 72.2% 50.6%' },
  { value: 'green', label: 'Green', description: 'Fresh and natural', hsl: '142.1 76.2% 36.3%' }
];

// Custom Themes (from ThemeCustomizer.vue)
const customThemes = [
  { value: 'claude', label: 'Claude', description: 'Warm professional', hsl: '35 68.0412% 38.0392%' },
  { value: 'starbucks', label: 'Starbucks', description: 'Natural green', hsl: '161.74 25% 44%' }
];

const themeOptions = [...officialThemes, ...customThemes];

const radiusOptions = [
  { value: '0', label: 'None', description: 'Sharp corners', variable: '0rem' },
  { value: '0.25', label: 'Small', description: 'Subtle', variable: '0.25rem' },
  { value: '0.5', label: 'Medium', description: 'Balanced', variable: '0.5rem' },
  { value: '0.75', label: 'Large', description: 'Rounded', variable: '0.75rem' },
  { value: '1', label: 'Extra Large', description: 'Very rounded', variable: '1rem' }
];

// Watch theme changes and apply immediately
watch(selectedTheme, (newTheme) => {
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme-color', newTheme);
});

watch(selectedRadius, (newRadius) => {
  document.documentElement.style.setProperty('--radius', `${newRadius}rem`);
  localStorage.setItem('theme-radius', newRadius);
});

// Database configuration
const dbConfig = ref({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'jboilerplate_dev',
  connectionString: '' // Connection string alternative
});

const useConnectionString = ref(false);

const dbTesting = ref(false);
const dbTestResult = ref<{ success: boolean; message: string } | null>(null);
const dbConnected = ref(false);
const dbMigrating = ref(false);
const dbStatus = ref<{
  hasConnection: boolean;
  hasTables: boolean;
  hasData: boolean;
  tableCount: number;
  existingTables: string[];
} | null>(null);
const showMigrationPrompt = ref(false);
const selectedMigrationAction = ref<'run' | 'overwrite' | 'skip'>('run');
const showOverwriteConfirmation = ref(false);

// System settings for setup wizard
const systemSettings = ref({
  systemName: 'jBoilerplate',
  loginTitle: 'Welcome Back',
  loginDescription: 'Sign in to your account to continue'
});

// Logo uploads
const logoLight = ref<string>('');
const logoDark = ref<string>('');

// Admin account
const adminAccount = ref({
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  confirmPassword: 'admin123'
});

const uploadingLogo = ref(false);
const schemaDownloading = ref(false);
const setupCompleting = ref(false);

// Computed
const canProceed = computed(() => {
  if (currentStep.value === 2) {
    return dbConnected.value;
  }
  return true;
});

const isStepComplete = (stepId: number) => {
  return completedSteps.value.includes(stepId);
};

const isStepAvailable = (stepId: number) => {
  // Step 1 (Welcome) is always available
  if (stepId === 1) return true;
  // Step 2 (Database) is available after welcome or if currently on it
  if (stepId === 2) return true;
  // All other steps require database to be connected
  return dbConnected.value;
};

const passwordsMatch = computed(() => {
  return adminAccount.value.password === adminAccount.value.confirmPassword;
});

// Methods
function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}

async function testDatabaseConnection() {
  dbTesting.value = true;
  dbTestResult.value = null;
  dbStatus.value = null;

  try {
    const response = await fetch('/api/setup/test-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbConfig.value)
    });

    const result = await response.json();
    dbTestResult.value = result;
    dbConnected.value = result.success;

    if (result.success) {
      // Store database status
      dbStatus.value = result.status;

      // Save database configuration to localStorage for later use
      localStorage.setItem('setupWizardDbConfig', JSON.stringify(dbConfig.value));

      toast.success('Database connection successful!');

      // Always show migration prompt to let user choose what to do
      showMigrationPrompt.value = true;

      if (!completedSteps.value.includes(2)) {
        completedSteps.value.push(2);
      }
    } else {
      toast.error('Connection failed: ' + result.message);
    }
  } catch (error: any) {
    dbTestResult.value = {
      success: false,
      message: error.message || 'Connection test failed'
    };
    toast.error('Failed to test connection');
  } finally {
    dbTesting.value = false;
  }
}

async function downloadDatabaseSchema() {
  schemaDownloading.value = true;

  try {
    const response = await fetch('/api/setup/download-schema');
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jboilerplate_schema.sql';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success('Schema downloaded successfully!');
  } catch (error) {
    toast.error('Failed to download schema');
  } finally {
    schemaDownloading.value = false;
  }
}

async function proceedWithMigration(skipConfirmation = false) {
  const action = selectedMigrationAction.value;

  // Show confirmation for overwrite action (unless already confirmed)
  if (action === 'overwrite' && !skipConfirmation) {
    showOverwriteConfirmation.value = true;
    return false;
  }

  if (action === 'skip') {
    toast.success('Database connection saved. You can configure migrations later.');
    showMigrationPrompt.value = false;
    showOverwriteConfirmation.value = false;
    // Move to next step
    goToStep(3);
    return true;
  }

  dbMigrating.value = true;

  try {
    const response = await fetch('/api/setup/run-migrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dbConfig.value,
        adminAccount: adminAccount.value, // Pass admin account for user creation
        action: action  // 'run' or 'overwrite'
      })
    });

    const result = await response.json();

    if (result.success) {
      toast.success(result.message || 'Migrations completed successfully!');
      showMigrationPrompt.value = false;
      showOverwriteConfirmation.value = false;
      // Mark step as complete
      if (!completedSteps.value.includes(2)) {
        completedSteps.value.push(2);
      }
      // Move to next step
      goToStep(3);
      return true;
    } else {
      toast.error('Migration failed: ' + result.message);
      showOverwriteConfirmation.value = false;
      return false;
    }
  } catch (error: any) {
    toast.error('Failed to run migrations: ' + error.message);
    showOverwriteConfirmation.value = false;
    return false;
  } finally {
    dbMigrating.value = false;
  }
}

function cancelOverwrite() {
  showOverwriteConfirmation.value = false;
  selectedMigrationAction.value = 'run'; // Reset to safe option
}

async function confirmOverwrite() {
  showOverwriteConfirmation.value = false;
  // Proceed with the migration, skipping confirmation check
  await proceedWithMigration(true);
}

async function runMigrations(action: 'run' | 'overwrite' | 'skip' = 'run') {
  // This function is kept for backward compatibility with the direct button click
  selectedMigrationAction.value = action;
  return proceedWithMigration();
}

async function uploadLogo(type: 'light' | 'dark', event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file type
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'png' && ext !== 'svg') {
    toast.error('Only PNG and SVG files are allowed');
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('File size must be less than 2MB');
    return;
  }

  uploadingLogo.value = true;

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // Pass logo type to backend

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Store the local path reference
      if (type === 'light') {
        logoLight.value = result.path;
      } else {
        logoDark.value = result.path;
      }

      // Trigger immediate UI refresh by updating the logo cache
      systemConfig.refreshLogos();

      toast.success(`${type === 'light' ? 'Light' : 'Dark'} logo uploaded successfully!`);
    } else {
      toast.error('Upload failed: ' + result.message);
    }
  } catch (error) {
    toast.error('Failed to upload logo');
  } finally {
    uploadingLogo.value = false;
  }
}

async function completeSetup() {
  if (!dbConnected.value) {
    toast.error('Please connect to database first');
    return;
  }

  setupCompleting.value = true;

  try {
    const response = await fetch('/api/setup/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        database: dbConfig.value,
        system: {
          ...systemSettings.value,
          logoLight: logoLight.value,
          logoDark: logoDark.value
        },
        admin: adminAccount.value,
        theme: {
          color: selectedTheme.value,
          radius: selectedRadius.value
        }
      })
    });

    const result = await response.json();

    if (result.success) {
      toast.success('Setup completed successfully! Redirecting to login...');

      // Set setup completion flags immediately
      localStorage.setItem('jboilerplate_setup_complete', 'true');
      // Set the setup status cache to initialized so router knows setup is done
      localStorage.setItem('setup_status_cache', JSON.stringify({
        initialized: true,
        timestamp: Date.now()
      }));

      // The server will restart after .env is updated, causing the page to disconnect
      // We need to redirect immediately before the connection is lost, then reload
      setTimeout(() => {
        // Navigate to login
        window.location.href = '/login';
      }, 1500);
    } else {
      toast.error('Setup failed: ' + result.message);
      setupCompleting.value = false;
    }
  } catch (error: any) {
    // Check if it's a network error (server restarting)
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      // Server might be restarting, try to redirect anyway
      toast.success('Setup completed! Server is restarting. Redirecting...');

      // Set setup completion flags immediately
      localStorage.setItem('jboilerplate_setup_complete', 'true');
      // Set the setup status cache to initialized so router knows setup is done
      localStorage.setItem('setup_status_cache', JSON.stringify({
        initialized: true,
        timestamp: Date.now()
      }));

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      toast.error('Failed to complete setup: ' + error.message);
      setupCompleting.value = false;
    }
  }
}

function nextStep() {
  if (canProceed.value && currentStep.value < steps.length) {
    // Mark current step as complete if optional
    if (!steps[currentStep.value - 1].required && !completedSteps.value.includes(currentStep.value)) {
      completedSteps.value.push(currentStep.value);
    }
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function goToStep(stepId: number) {
  // Can only go to completed steps or next step
  if (stepId <= currentStep.value || (stepId === currentStep.value + 1 && canProceed.value)) {
    currentStep.value = stepId;
  }
}

// Load saved database configuration on mount
onMounted(() => {
  const savedDbConfig = localStorage.getItem('setupWizardDbConfig');
  if (savedDbConfig) {
    try {
      const parsed = JSON.parse(savedDbConfig);
      dbConfig.value = parsed;
      dbConnected.value = true; // If config was saved, connection was successful
      if (!completedSteps.value.includes(2)) {
        completedSteps.value.push(2);
      }
    } catch (error) {
      console.error('Failed to parse saved database config:', error);
    }
  }
});
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Setup Completing Overlay -->
    <div
      v-if="setupCompleting"
      class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center"
    >
      <Card class="w-[400px]">
        <CardContent class="pt-6">
          <div class="flex flex-col items-center space-y-4">
            <Loader2 class="h-12 w-12 animate-spin text-primary" />
            <div class="text-center">
              <h3 class="text-lg font-semibold">Completing Setup</h3>
              <p class="text-sm text-muted-foreground mt-1">
                Creating admin account and configuring system...
              </p>
              <p class="text-xs text-muted-foreground mt-2">
                Please wait, this may take a moment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Theme Toggle -->
    <button
      @click="toggleMode"
      class="fixed right-4 top-4 z-50 rounded-lg p-2 hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <Sun v-if="mode === 'dark'" class="h-5 w-5 text-yellow-500" />
      <Moon v-else class="h-5 w-5" />
    </button>

    <!-- Left Sidebar - Steps Navigation -->
    <div class="hidden lg:flex lg:w-80 xl:w-96 flex-col border-r bg-muted/10">
      <div class="p-8">
        <!-- Logo/Title -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold">jBoilerplate</h1>
          <p class="text-sm text-muted-foreground mt-1">Setup wizard</p>
        </div>

        <!-- Steps List -->
        <nav class="space-y-2">
          <div
            v-for="step in steps"
            :key="step.id"
            @click="isStepAvailable(step.id) ? goToStep(step.id) : null"
            class="group relative flex items-start p-4 rounded-lg transition-colors"
            :class="{
              'bg-primary text-primary-foreground cursor-pointer': currentStep === step.id,
              'hover:bg-accent cursor-pointer': currentStep !== step.id && isStepAvailable(step.id),
              'opacity-30 cursor-not-allowed': !isStepAvailable(step.id)
            }"
          >
            <!-- Step Number/Check -->
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 mr-4 transition-all"
              :class="{
                'border-primary-foreground bg-primary-foreground/10': currentStep === step.id,
                'border-primary bg-primary text-primary-foreground': isStepComplete(step.id),
                'border-muted-foreground/30': currentStep !== step.id && !isStepComplete(step.id)
              }"
            >
              <Check v-if="isStepComplete(step.id)" class="h-5 w-5" />
              <component v-else :is="step.icon" class="h-5 w-5" />
            </div>

            <!-- Step Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold">{{ step.title }}</p>
                <span
                  v-if="step.required"
                  class="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium"
                >
                  Required
                </span>
              </div>
              <p class="text-xs mt-0.5 opacity-80">{{ step.description }}</p>
            </div>
          </div>
        </nav>

        <!-- Progress Info -->
        <div class="mt-8 p-4 rounded-lg bg-muted">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">Progress</span>
            <span class="text-sm text-muted-foreground">
              {{ completedSteps.length }} / {{ steps.length }}
            </span>
          </div>
          <div class="h-2 bg-background rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-500"
              :style="{ width: `${(completedSteps.length / steps.length) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Right Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Header -->
      <div class="lg:hidden border-b px-6 py-4">
        <h1 class="text-xl font-bold">jBoilerplate Setup</h1>
        <p class="text-sm text-muted-foreground">Step {{ currentStep }} of {{ steps.length }}</p>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto p-6 lg:p-12">
          <!-- Step 1: Welcome -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div>
              <h2 class="text-3xl font-bold tracking-tight">Welcome to jBoilerplate</h2>
              <p class="text-muted-foreground mt-2">
                Let's get you started with your new application. This wizard will help you configure everything you need.
              </p>
            </div>

            <!-- What to Expect -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Zap class="h-5 w-5" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid gap-4">
                  <div class="flex gap-3">
                    <Database class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium">Database Setup (Required)</p>
                      <p class="text-sm text-muted-foreground">Connect to your MySQL database and run migrations to create the necessary tables.</p>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <Settings class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium">System Configuration (Optional)</p>
                      <p class="text-sm text-muted-foreground">Customize your system name and login page text.</p>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <Palette class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium">Branding & Theme (Optional)</p>
                      <p class="text-sm text-muted-foreground">Choose your theme colors and upload your logos.</p>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <Shield class="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p class="font-medium">Admin Account (Optional)</p>
                      <p class="text-sm text-muted-foreground">Create your administrator account for login.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Quick Links -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <BookOpen class="h-5 w-5" />
                  Documentation & Resources
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-3">
                <a href="https://github.com/yourusername/jboilerplate" target="_blank" class="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div class="flex items-center gap-3">
                    <Package class="h-5 w-5" />
                    <div>
                      <p class="font-medium">GitHub Repository</p>
                      <p class="text-sm text-muted-foreground">View source code and contribute</p>
                    </div>
                  </div>
                  <ExternalLink class="h-4 w-4 text-muted-foreground" />
                </a>

                <a href="https://docs.example.com" target="_blank" class="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div class="flex items-center gap-3">
                    <FileText class="h-5 w-5" />
                    <div>
                      <p class="font-medium">Documentation</p>
                      <p class="text-sm text-muted-foreground">Complete guides and API reference</p>
                    </div>
                  </div>
                  <ExternalLink class="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle class="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Only the database setup is required. All other steps can be skipped and configured later through the admin dashboard.
              </AlertDescription>
            </Alert>
          </div>

          <!-- Step 2: Database -->
          <div v-if="currentStep === 2" class="space-y-6">
            <div>
              <h2 class="text-3xl font-bold tracking-tight">Connect your database</h2>
              <p class="text-muted-foreground mt-2">
                jBoilerplate needs a MySQL database to store your data. First, download the schema to set up your database, then configure the connection.
              </p>
            </div>

            <!-- Download Schema Section -->
            <Card class="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Download class="h-5 w-5" />
                  Step 1: Download Database Schema
                </CardTitle>
                <CardDescription>
                  Download the SQL file and import it into your MySQL database
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <Button
                  @click="downloadDatabaseSchema"
                  :disabled="schemaDownloading"
                  size="lg"
                  variant="default"
                  class="w-full"
                >
                  <Loader2 v-if="schemaDownloading" class="mr-2 h-5 w-5 animate-spin" />
                  <Download v-else class="mr-2 h-5 w-5" />
                  {{ schemaDownloading ? 'Downloading...' : 'Download jboilerplate_schema.sql' }}
                </Button>
              </CardContent>
            </Card>

            <!-- Configure Connection Section -->
            <Card>
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Server class="h-5 w-5" />
                  Step 2: Configure Database Connection
                </CardTitle>
                <CardDescription>
                  Enter your MySQL credentials to connect
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- Connection Type Toggle -->
                <div class="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      :checked="!useConnectionString"
                      @change="useConnectionString = false"
                      class="w-4 h-4"
                    />
                    <span class="text-sm font-medium">Individual Fields</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      :checked="useConnectionString"
                      @change="useConnectionString = true"
                      class="w-4 h-4"
                    />
                    <span class="text-sm font-medium">Connection String</span>
                  </label>
                </div>

                <!-- Connection String Input -->
                <div v-if="useConnectionString" class="space-y-2">
                  <Label for="connection-string">Connection String</Label>
                  <Input
                    id="connection-string"
                    v-model="dbConfig.connectionString"
                    placeholder="mysql://user:password@localhost:3306/jboilerplate_dev"
                    class="font-mono text-sm"
                  />
                  <p class="text-xs text-muted-foreground">
                    Format: mysql://username:password@host:port/database
                  </p>
                </div>

                <!-- Individual Fields -->
                <div v-else class="grid gap-4 md:grid-cols-2">
                  <div class="space-y-2">
                    <Label for="db-host">Host</Label>
                    <Input
                      id="db-host"
                      v-model="dbConfig.host"
                      placeholder="localhost"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="db-port">Port</Label>
                    <Input
                      id="db-port"
                      v-model="dbConfig.port"
                      placeholder="3306"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="db-user">Username</Label>
                    <Input
                      id="db-user"
                      v-model="dbConfig.user"
                      placeholder="root"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="db-password">Password</Label>
                    <Input
                      id="db-password"
                      v-model="dbConfig.password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>

                  <div class="space-y-2 md:col-span-2">
                    <Label for="db-name">Database Name</Label>
                    <Input
                      id="db-name"
                      v-model="dbConfig.database"
                      placeholder="jboilerplate_dev"
                    />
                  </div>
                </div>

                <Alert v-if="dbTestResult" :variant="dbTestResult.success ? 'default' : 'destructive'">
                  <component :is="dbTestResult.success ? CheckCircle2 : AlertCircle" class="h-4 w-4" />
                  <AlertDescription>
                    {{ dbTestResult.message }}
                  </AlertDescription>
                </Alert>

                <div class="flex gap-3">
                  <Button
                    @click="testDatabaseConnection"
                    :disabled="dbTesting"
                    variant="outline"
                    class="flex-1"
                  >
                    <Loader2 v-if="dbTesting" class="mr-2 h-4 w-4 animate-spin" />
                    <Server v-else class="mr-2 h-4 w-4" />
                    {{ dbTesting ? 'Testing...' : 'Test Connection' }}
                  </Button>

                  <Button
                    @click="runMigrations"
                    :disabled="!dbConnected || dbMigrating"
                    class="flex-1"
                  >
                    <Loader2 v-if="dbMigrating" class="mr-2 h-4 w-4 animate-spin" />
                    <Database v-else class="mr-2 h-4 w-4" />
                    {{ dbMigrating ? 'Running...' : 'Run Migrations' }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Step 3: System Configuration -->
          <div v-if="currentStep === 3" class="space-y-6">
            <div>
              <h2 class="text-3xl font-bold tracking-tight">System configuration</h2>
              <p class="text-muted-foreground mt-2">
                Customize your system name and login page text. You can change these later in settings.
              </p>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="system-name">System Name</Label>
                <Input
                  id="system-name"
                  v-model="systemSettings.systemName"
                  placeholder="jBoilerplate"
                />
                <p class="text-sm text-muted-foreground">
                  Displayed in header and page titles
                </p>
              </div>

              <Separator />

              <div class="space-y-2">
                <Label for="login-title">Login Page Title</Label>
                <Input
                  id="login-title"
                  v-model="systemSettings.loginTitle"
                  placeholder="Welcome Back"
                />
              </div>

              <div class="space-y-2">
                <Label for="login-description">Login Page Description</Label>
                <Input
                  id="login-description"
                  v-model="systemSettings.loginDescription"
                  placeholder="Sign in to your account to continue"
                />
              </div>
            </div>
          </div>

          <!-- Step 4: Branding & Theme -->
          <div v-if="currentStep === 4" class="space-y-6">
            <div>
              <h2 class="text-3xl font-bold tracking-tight">Branding & Theme</h2>
              <p class="text-muted-foreground mt-2">
                Choose your theme colors and upload your logos. Changes apply instantly!
              </p>
            </div>

            <!-- Theme Selection -->
            <Card>
              <CardHeader>
                <CardTitle>Theme Selection</CardTitle>
                <CardDescription>
                  Choose a color scheme for your application
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Official Themes -->
                <div class="space-y-3">
                  <Label class="text-sm font-medium">Official Themes</Label>
                  <div class="grid grid-cols-3 gap-2">
                    <TooltipProvider>
                      <div v-for="theme in officialThemes" :key="theme.value">
                        <Tooltip>
                          <TooltipTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="[
                                'w-full flex items-center gap-2 justify-start',
                                selectedTheme === theme.value ? 'border-2 border-primary bg-primary/5' : ''
                              ]"
                              @click="selectedTheme = theme.value"
                            >
                              <span
                                class="h-5 w-5 rounded-full border border-border shrink-0"
                                :style="{ backgroundColor: `hsl(${theme.hsl})` }"
                              ></span>
                              <span class="capitalize text-xs truncate">{{ theme.label }}</span>
                              <Check v-if="selectedTheme === theme.value" class="h-3 w-3 ml-auto shrink-0" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{{ theme.label }}</p>
                            <p class="text-xs text-muted-foreground">{{ theme.description }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>

                <!-- Custom Themes -->
                <div class="space-y-3">
                  <Label class="text-sm font-medium">Custom Themes</Label>
                  <div class="grid grid-cols-2 gap-2">
                    <TooltipProvider>
                      <div v-for="theme in customThemes" :key="theme.value">
                        <Tooltip>
                          <TooltipTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="[
                                'w-full flex items-center gap-2 justify-start',
                                selectedTheme === theme.value ? 'border-2 border-primary bg-primary/5' : ''
                              ]"
                              @click="selectedTheme = theme.value"
                            >
                              <span
                                class="h-5 w-5 rounded-full border border-border shrink-0"
                                :style="{ backgroundColor: `hsl(${theme.hsl})` }"
                              ></span>
                              <span class="capitalize text-xs truncate">{{ theme.label }}</span>
                              <Check v-if="selectedTheme === theme.value" class="h-3 w-3 ml-auto shrink-0" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{{ theme.label }}</p>
                            <p class="text-xs text-muted-foreground">{{ theme.description }}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>

                <Separator />

                <!-- Border Radius -->
                <div class="space-y-3">
                  <Label class="text-sm font-medium">Border Radius</Label>
                  <div class="grid grid-cols-5 gap-2">
                    <TooltipProvider>
                      <div v-for="radius in radiusOptions" :key="radius.value">
                        <Tooltip>
                          <TooltipTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="[
                                'w-full flex flex-col items-center justify-center p-3 h-auto',
                                selectedRadius === radius.value ? 'border-2 border-primary bg-primary/5' : ''
                              ]"
                              @click="selectedRadius = radius.value"
                            >
                              <div
                                class="h-8 w-8 border-2 border-foreground/20 bg-muted mb-1"
                                :style="{ borderRadius: radius.variable }"
                              ></div>
                              <span class="text-xs">{{ radius.label }}</span>
                              <Check v-if="selectedRadius === radius.value" class="h-3 w-3 mt-1" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{{ radius.label }} ({{ radius.variable }})</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                </div>

                <Alert>
                  <Palette class="h-4 w-4" />
                  <AlertDescription>
                    Theme changes are applied immediately. Try switching themes to see the effect!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <!-- Logo Upload -->
            <Card>
              <CardHeader>
                <CardTitle>Upload Logos</CardTitle>
                <CardDescription>
                  Add your brand logos for light and dark modes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-3">
                    <Label>Light Mode Logo</Label>
                    <div
                      class="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      @click="() => ($refs.lightLogoInput as HTMLInputElement)?.click()"
                    >
                      <Upload class="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p class="text-sm font-medium">Click to upload</p>
                      <p class="text-xs text-muted-foreground mt-1">PNG, JPG, SVG (max 2MB)</p>
                      <p v-if="logoLight" class="text-xs text-primary mt-2">✓ Uploaded</p>
                    </div>
                    <input
                      ref="lightLogoInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="(e) => uploadLogo('light', e)"
                    />
                  </div>

                  <div class="space-y-3">
                    <Label>Dark Mode Logo</Label>
                    <div
                      class="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      @click="() => ($refs.darkLogoInput as HTMLInputElement)?.click()"
                    >
                      <Upload class="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p class="text-sm font-medium">Click to upload</p>
                      <p class="text-xs text-muted-foreground mt-1">PNG, JPG, SVG (max 2MB)</p>
                      <p v-if="logoDark" class="text-xs text-primary mt-2">✓ Uploaded</p>
                    </div>
                    <input
                      ref="darkLogoInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="(e) => uploadLogo('dark', e)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Step 5: Admin Account -->
          <div v-if="currentStep === 5" class="space-y-6">
            <div>
              <h2 class="text-3xl font-bold tracking-tight">Create admin account</h2>
              <p class="text-muted-foreground mt-2">
                Set up your administrator credentials. You'll use these to login after setup.
              </p>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="admin-name">Full Name</Label>
                <Input
                  id="admin-name"
                  v-model="adminAccount.name"
                  placeholder="Admin User"
                />
              </div>

              <div class="space-y-2">
                <Label for="admin-email">Email Address</Label>
                <Input
                  id="admin-email"
                  v-model="adminAccount.email"
                  type="email"
                  placeholder="admin@example.com"
                />
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    v-model="adminAccount.password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="admin-confirm">Confirm Password</Label>
                  <Input
                    id="admin-confirm"
                    v-model="adminAccount.confirmPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Alert v-if="adminAccount.password && !passwordsMatch" variant="destructive">
                <AlertCircle class="h-4 w-4" />
                <AlertDescription>
                  Passwords do not match
                </AlertDescription>
              </Alert>

              <Card class="bg-muted/50">
                <CardHeader>
                  <CardTitle class="text-base">Your Login Credentials</CardTitle>
                </CardHeader>
                <CardContent class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Email:</span>
                    <span class="font-mono font-medium">{{ adminAccount.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">Password:</span>
                    <span class="font-mono font-medium">{{ adminAccount.password }}</span>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Shield class="h-4 w-4" />
                <AlertDescription>
                  Make sure to save your credentials securely. You can change your password after logging in.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <!-- Navigation Footer -->
          <div class="flex items-center justify-between pt-8 mt-8 border-t">
            <Button
              variant="outline"
              @click="prevStep"
              :disabled="currentStep === 1"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div class="flex gap-3">
              <Button
                v-if="!steps[currentStep - 1].required && currentStep !== steps.length"
                variant="ghost"
                @click="nextStep"
              >
                Skip
              </Button>

              <Button
                v-if="currentStep < steps.length"
                @click="nextStep"
                :disabled="!canProceed"
              >
                Next
                <ArrowRight class="ml-2 h-4 w-4" />
              </Button>

              <Button
                v-else
                @click="completeSetup"
                :disabled="setupCompleting || !dbConnected"
              >
                <Loader2 v-if="setupCompleting" class="mr-2 h-4 w-4 animate-spin" />
                <CheckCircle2 v-else class="mr-2 h-4 w-4" />
                {{ setupCompleting ? 'Completing...' : 'Complete Setup' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Migration Prompt Dialog -->
    <Dialog v-model:open="showMigrationPrompt">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle class="text-center text-2xl">What would you like to do?</DialogTitle>
          <DialogDescription class="text-center">
            Choose how to proceed with your database setup
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-6">
          <!-- Database Status Info -->
          <div v-if="dbStatus" class="text-center text-sm mb-6">
            <div v-if="dbStatus.hasTables" class="text-muted-foreground">
              <p>Found {{ dbStatus.tableCount }} existing table{{ dbStatus.tableCount > 1 ? 's' : '' }} in database</p>
              <p v-if="dbStatus.hasData" class="text-orange-600 dark:text-orange-400 mt-1">
                • Contains existing data
              </p>
            </div>
            <div v-else class="text-muted-foreground">
              <p>✓ Database is empty and ready for setup</p>
            </div>
          </div>

          <!-- Big Toggle Buttons -->
          <div class="grid gap-4">
            <!-- Option 1: Run Migrations -->
            <button
              @click="selectedMigrationAction = 'run'"
              :disabled="dbMigrating"
              class="group relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all"
              :class="{
                'border-primary bg-primary/5': selectedMigrationAction === 'run',
                'border-border hover:border-primary/50 hover:bg-accent': selectedMigrationAction !== 'run',
                'opacity-50 cursor-not-allowed': dbMigrating
              }"
            >
              <div class="mb-3">
                <Database
                  class="h-12 w-12 transition-colors"
                  :class="selectedMigrationAction === 'run' ? 'text-primary' : 'text-muted-foreground'"
                />
              </div>
              <p class="font-semibold text-lg mb-1">Run Migrations</p>
              <p class="text-sm text-muted-foreground text-center">
                Add missing tables only (safe)
              </p>
              <div
                v-if="selectedMigrationAction === 'run'"
                class="absolute top-2 right-2"
              >
                <Check class="h-5 w-5 text-primary" />
              </div>
            </button>

            <!-- Option 2: Overwrite Database -->
            <button
              @click="selectedMigrationAction = 'overwrite'"
              :disabled="dbMigrating"
              class="group relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all"
              :class="{
                'border-destructive bg-destructive/5': selectedMigrationAction === 'overwrite',
                'border-border hover:border-destructive/50 hover:bg-accent': selectedMigrationAction !== 'overwrite',
                'opacity-50 cursor-not-allowed': dbMigrating
              }"
            >
              <div class="mb-3">
                <AlertCircle
                  class="h-12 w-12 transition-colors"
                  :class="selectedMigrationAction === 'overwrite' ? 'text-destructive' : 'text-muted-foreground'"
                />
              </div>
              <p class="font-semibold text-lg mb-1">Overwrite Database</p>
              <p class="text-sm text-muted-foreground text-center">
                ⚠️ Deletes all existing data
              </p>
              <div
                v-if="selectedMigrationAction === 'overwrite'"
                class="absolute top-2 right-2"
              >
                <Check class="h-5 w-5 text-destructive" />
              </div>
            </button>

            <!-- Option 3: Skip -->
            <button
              @click="selectedMigrationAction = 'skip'"
              :disabled="dbMigrating"
              class="group relative flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all"
              :class="{
                'border-primary bg-primary/5': selectedMigrationAction === 'skip',
                'border-border hover:border-primary/50 hover:bg-accent': selectedMigrationAction !== 'skip',
                'opacity-50 cursor-not-allowed': dbMigrating
              }"
            >
              <div class="mb-3">
                <ArrowRight
                  class="h-12 w-12 transition-colors"
                  :class="selectedMigrationAction === 'skip' ? 'text-primary' : 'text-muted-foreground'"
                />
              </div>
              <p class="font-semibold text-lg mb-1">Connect & Continue</p>
              <p class="text-sm text-muted-foreground text-center">
                Save connection and skip migrations
              </p>
              <div
                v-if="selectedMigrationAction === 'skip'"
                class="absolute top-2 right-2"
              >
                <Check class="h-5 w-5 text-primary" />
              </div>
            </button>
          </div>
        </div>

        <DialogFooter class="flex justify-center sm:justify-center">
          <Button
            @click="proceedWithMigration"
            :disabled="dbMigrating"
            size="lg"
            class="min-w-[200px]"
          >
            <Loader2 v-if="dbMigrating" class="mr-2 h-5 w-5 animate-spin" />
            {{ dbMigrating ? 'Processing...' : 'Continue' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Overwrite Confirmation Dialog -->
    <Dialog v-model:open="showOverwriteConfirmation">
      <DialogContent class="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-destructive">
            <AlertCircle class="h-6 w-6" />
            Confirm Overwrite
          </DialogTitle>
          <DialogDescription class="pt-2">
            This action will permanently delete all existing data and tables in your database.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This cannot be undone!
              <ul class="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>All tables will be dropped</li>
                <li>All data will be permanently deleted</li>
                <li>New schema will be created</li>
              </ul>
            </AlertDescription>
          </Alert>

          <p class="text-sm text-center font-medium">
            Are you absolutely sure you want to proceed?
          </p>
        </div>

        <DialogFooter class="gap-2">
          <Button
            @click="cancelOverwrite"
            variant="outline"
            class="flex-1"
          >
            Cancel
          </Button>
          <Button
            @click="confirmOverwrite"
            variant="destructive"
            class="flex-1"
          >
            <AlertCircle class="mr-2 h-4 w-4" />
            Yes, Overwrite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
