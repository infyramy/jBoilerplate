<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useSystemConfigStore } from '@/stores/system-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'vue-sonner';
import { Settings, Image, Type, FileImage, RotateCcw, Upload, Sun, Moon, Database, FileText, AlertCircle, CheckCircle2, Palette, Plus, Trash2, Save, Lock, Table as TableIcon, Search, ChevronLeft, ChevronRight, Eye, EyeOff, Copy, Download, ChevronDown } from 'lucide-vue-next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const systemConfigStore = useSystemConfigStore();

const form = ref({
  systemName: '',
  logoLight: '',
  logoDark: '',
  loginImage: '',
  loginTitle: '',
  loginDescription: '',
  loginLogoMode: 'theme' as 'light' | 'dark' | 'theme',
  loginLogoSize: 'large' as 'small' | 'medium' | 'large' | 'custom',
  loginLogoCustomSize: 200,
});

const dbConfig = ref({
  host: '',
  port: 3306,
  user: '',
  password: '',
  database: '',
});

const dbStatus = ref({
  connected: false,
  hasRequiredTables: false,
  missingTables: [] as string[],
  hasData: false,
  requiresMigration: false,
  tables: [] as string[]
});

const showMigrationDialog = ref(false);
const isMigratingDatabase = ref(false);

const envVars = ref<Record<string, string>>({});
const isLoadingEnv = ref(false);
const newEnvKey = ref('');
const newEnvValue = ref('');

// Database Viewer State
interface TableInfo {
  name: string;
  rows: number;
}

interface ColumnInfo {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

const dbTables = ref<TableInfo[]>([]);
const selectedDbTable = ref<string>('');
const dbColumns = ref<ColumnInfo[]>([]);
const dbRows = ref<any[]>([]);
const isLoadingDbViewer = ref(false);
const dbSearchQuery = ref('');
const dbCurrentPage = ref(1);
const dbPageSize = ref(10);
const dbTotalRows = ref(0);
const showConnectionString = ref(false);
const connectionStringInput = ref('');
const isUpdatingFromString = ref(false);

// Computed connection string from individual fields
const connectionString = computed(() => {
  if (isUpdatingFromString.value) return connectionStringInput.value;
  if (!dbConfig.value.host || !dbConfig.value.database) return '';
  return `mysql://${dbConfig.value.user}:${dbConfig.value.password}@${dbConfig.value.host}:${dbConfig.value.port}/${dbConfig.value.database}`;
});

// Displayed connection string (masked or visible)
const displayedConnectionString = computed(() => {
  const str = connectionString.value;
  if (!str) return '';
  if (showConnectionString.value) {
    return str;
  }
  // Return masked version with dots
  return '•'.repeat(str.length);
});

// Parse connection string to individual fields
const parseConnectionString = (connStr: string) => {
  try {
    // Format: mysql://user:password@host:port/database
    const regex = /^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
    const match = connStr.match(regex);

    if (match) {
      isUpdatingFromString.value = true;
      dbConfig.value.user = match[1];
      dbConfig.value.password = match[2];
      dbConfig.value.host = match[3];
      dbConfig.value.port = parseInt(match[4]);
      dbConfig.value.database = match[5];
      connectionStringInput.value = connStr;
      setTimeout(() => {
        isUpdatingFromString.value = false;
      }, 100);
      toast.success('Connection string parsed successfully');
      return true;
    } else {
      toast.error('Invalid connection string format. Use: mysql://user:password@host:port/database');
      return false;
    }
  } catch (error: any) {
    toast.error('Failed to parse connection string');
    return false;
  }
};

// Watch individual fields to update connection string
watch([() => dbConfig.value.host, () => dbConfig.value.port, () => dbConfig.value.user, () => dbConfig.value.password, () => dbConfig.value.database], () => {
  if (!isUpdatingFromString.value) {
    connectionStringInput.value = connectionString.value;
  }
});

// Computed properties for database viewer
const dbTotalPages = computed(() => Math.ceil(dbTotalRows.value / dbPageSize.value));
const dbPaginatedRows = computed(() => {
  const start = (dbCurrentPage.value - 1) * dbPageSize.value;
  const end = start + dbPageSize.value;
  return dbRows.value.slice(start, end);
});

const dbFilteredRows = computed(() => {
  if (!dbSearchQuery.value) return dbPaginatedRows.value;
  return dbPaginatedRows.value.filter(row => {
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(dbSearchQuery.value.toLowerCase())
    );
  });
});

onMounted(async () => {
  form.value = {
    systemName: systemConfigStore.config.systemName,
    logoLight: systemConfigStore.config.logoLight,
    logoDark: systemConfigStore.config.logoDark,
    loginImage: systemConfigStore.config.loginImage,
    loginTitle: systemConfigStore.config.loginTitle,
    loginDescription: systemConfigStore.config.loginDescription,
    loginLogoMode: systemConfigStore.config.loginLogoMode,
    loginLogoSize: systemConfigStore.config.loginLogoSize,
    loginLogoCustomSize: systemConfigStore.config.loginLogoCustomSize,
  };
  await loadEnvVars();
  await loadDbConfig();

  // Initialize connection string from loaded config
  if (dbConfig.value.host && dbConfig.value.database) {
    connectionStringInput.value = `mysql://${dbConfig.value.user}:${dbConfig.value.password}@${dbConfig.value.host}:${dbConfig.value.port}/${dbConfig.value.database}`;
  }

  // Silently verify database is properly configured on load (don't show dialog on mount)
  if (dbConfig.value.host && dbConfig.value.database) {
    try {
      const response = await fetch('/api/database/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbConfig.value),
      });
      const data = await response.json();
      if (data.success && data.status) {
        dbStatus.value = data.status;
        // Only load tables if database is fully ready
        if (data.status.hasRequiredTables && data.status.hasData) {
          await loadDbTables();
        }
      }
    } catch (error) {
      console.error('Silent database check failed:', error);
    }
  }
});

const logoLightPreview = computed(() => form.value.logoLight);
const logoDarkPreview = computed(() => form.value.logoDark);
const loginImagePreview = computed(() => form.value.loginImage);

const logoLightFileInput = ref<HTMLInputElement>();
const logoDarkFileInput = ref<HTMLInputElement>();
const loginImageFileInput = ref<HTMLInputElement>();

// Load database config from environment variables
const loadDbConfig = async () => {
  try {
    const response = await fetch('/api/env/load');
    const data = await response.json();
    if (data.success) {
      dbConfig.value = {
        host: data.env.DB_HOST || data.env.VITE_DB_HOST || 'localhost',
        port: parseInt(data.env.DB_PORT || data.env.VITE_DB_PORT) || 3306,
        user: data.env.DB_USER || data.env.VITE_DB_USER || '',
        password: data.env.DB_PASSWORD || data.env.VITE_DB_PASSWORD || '',
        database: data.env.DB_NAME || data.env.VITE_DB_NAME || '',
      };
    }
  } catch (error: any) {
    toast.error('Failed to load database configuration');
  }
};

// Convert image to base64 for database storage
const uploadImageToServer = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Store as base64 directly in database
      const base64Image = e.target?.result as string;
      resolve(base64Image);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const handleLogoLightUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
    try {
      // Upload to server to replace /assets/logo/logo-light.svg|png
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'light');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Add cache busting timestamp to force image reload
        const timestamp = new Date().getTime();
        form.value.logoLight = `${data.path}?t=${timestamp}`;
        toast.success('Light logo uploaded successfully');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    }
  } else {
    toast.error('Please select a valid PNG or SVG image (max 2MB)');
  }
};

const handleLogoDarkUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
    try {
      // Upload to server to replace /assets/logo/logo-dark.svg|png
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'dark');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // Add cache busting timestamp to force image reload
        const timestamp = new Date().getTime();
        form.value.logoDark = `${data.path}?t=${timestamp}`;
        toast.success('Dark logo uploaded successfully');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    }
  } else {
    toast.error('Please select a valid PNG or SVG image (max 2MB)');
  }
};

const handleLoginImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
    try {
      // Convert to base64 and show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.loginImage = e.target?.result as string;
        toast.success('Login background image uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    }
  } else {
    toast.error('Please select a valid image (max 10MB)');
  }
};

// DB-related env var keys (managed via Database tab)
const dbEnvKeys = ['DB_CLIENT', 'DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_ROOT_PASSWORD', 'VITE_DB_CLIENT', 'VITE_DB_HOST', 'VITE_DB_PORT', 'VITE_DB_USER', 'VITE_DB_PASSWORD', 'VITE_DB_NAME'];

// Check if env key is DB-related
const isDbEnvKey = (key: string) => dbEnvKeys.includes(key);

// Load environment variables (non-DB vars for editing, DB vars for display only)
const loadEnvVars = async () => {
  isLoadingEnv.value = true;
  try {
    const response = await fetch('/api/env/load');
    const data = await response.json();
    if (data.success) {
      envVars.value = data.env;
    }
  } catch (error: any) {
    toast.error('Failed to load environment variables');
  } finally {
    isLoadingEnv.value = false;
  }
};

// Save non-DB environment variables only
const saveEnvVars = async () => {
  try {
    // Don't allow saving DB-related vars through Environment tab
    const nonDbEnv = Object.fromEntries(
      Object.entries(envVars.value).filter(([key]) => !isDbEnvKey(key))
    );

    // Re-add current DB config to preserve them
    const updatedEnv = {
      ...nonDbEnv,
      DB_CLIENT: envVars.value.DB_CLIENT || 'mysql2',
      DB_HOST: dbConfig.value.host,
      DB_PORT: String(dbConfig.value.port),
      DB_USER: dbConfig.value.user,
      DB_PASSWORD: dbConfig.value.password,
      DB_NAME: dbConfig.value.database,
      VITE_DB_CLIENT: envVars.value.VITE_DB_CLIENT || 'mysql',
      VITE_DB_HOST: dbConfig.value.host,
      VITE_DB_PORT: String(dbConfig.value.port),
      VITE_DB_USER: dbConfig.value.user,
      VITE_DB_PASSWORD: dbConfig.value.password,
      VITE_DB_NAME: dbConfig.value.database,
    };

    const response = await fetch('/api/env/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ env: updatedEnv }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success('Environment variables saved. Please restart the application.');
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    toast.error(`Failed to save environment variables: ${error.message}`);
  }
};

// Add new environment variable (non-DB only)
const addEnvVar = () => {
  if (!newEnvKey.value.trim()) {
    toast.error('Environment variable key cannot be empty');
    return;
  }
  if (isDbEnvKey(newEnvKey.value.toUpperCase())) {
    toast.error('Database variables must be managed through the Database tab');
    return;
  }
  if (envVars.value[newEnvKey.value]) {
    toast.error('Environment variable already exists');
    return;
  }
  envVars.value[newEnvKey.value] = newEnvValue.value;
  newEnvKey.value = '';
  newEnvValue.value = '';
  toast.success('Environment variable added');
};

// Delete environment variable (non-DB only)
const deleteEnvVar = (key: string) => {
  if (isDbEnvKey(key)) {
    toast.error('Database variables cannot be deleted. Manage them through the Database tab.');
    return;
  }
  delete envVars.value[key];
  toast.success('Environment variable deleted');
};

// Database Viewer Functions
const loadDbTables = async () => {
  isLoadingDbViewer.value = true;
  try {
    const response = await fetch('/api/database/tables');
    const data = await response.json();

    if (data.success) {
      dbTables.value = data.tables;
    } else {
      toast.error('Failed to load tables');
    }
  } catch (error: any) {
    toast.error(`Failed to load tables: ${error.message}`);
  } finally {
    isLoadingDbViewer.value = false;
  }
};

const loadDbTableData = async (tableName: string) => {
  if (!tableName) return;

  isLoadingDbViewer.value = true;
  selectedDbTable.value = tableName;
  dbCurrentPage.value = 1;

  try {
    const response = await fetch(`/api/database/table/${tableName}`);
    const data = await response.json();

    if (data.success) {
      dbColumns.value = data.columns;
      dbRows.value = data.rows;
      dbTotalRows.value = data.rows.length;
    } else {
      toast.error('Failed to load table data');
    }
  } catch (error: any) {
    toast.error(`Failed to load table data: ${error.message}`);
  } finally {
    isLoadingDbViewer.value = false;
  }
};

const refreshDbViewer = () => {
  if (selectedDbTable.value) {
    loadDbTableData(selectedDbTable.value);
  } else {
    loadDbTables();
  }
};

const goToDbPage = (page: number) => {
  if (page >= 1 && page <= dbTotalPages.value) {
    dbCurrentPage.value = page;
  }
};

// Copy connection string to clipboard
const copyConnectionString = async () => {
  try {
    await navigator.clipboard.writeText(connectionString.value);
    toast.success('Connection string copied to clipboard');
  } catch (error) {
    toast.error('Failed to copy connection string');
  }
};

// Export database schema
const exportSchema = async (format: 'sql' | 'json') => {
  try {
    const response = await fetch(`/api/database/export-schema?format=${format}`);
    const data = await response.json();

    if (data.success) {
      // Create blob and download
      const blob = new Blob([data.schema], { type: format === 'json' ? 'application/json' : 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_schema_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Schema exported as ${format.toUpperCase()}`);
    } else {
      throw new Error(data.error || 'Failed to export schema');
    }
  } catch (error: any) {
    toast.error(`Failed to export schema: ${error.message}`);
  }
};

// Test database connection with comprehensive validation
const testDbConnection = async () => {
  try {
    const response = await fetch('/api/database/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbConfig.value),
    });

    const data = await response.json();

    if (data.success && data.status) {
      dbStatus.value = data.status;

      if (!data.status.hasRequiredTables) {
        // Database connected but missing required tables
        toast.warning(`Database connected but missing required tables: ${data.status.missingTables.join(', ')}`);
        showMigrationDialog.value = true;
      } else if (!data.status.hasData) {
        // Tables exist but no data
        toast.info('Database tables found but appear to be empty. You may need to run migrations.');
        showMigrationDialog.value = true;
      } else {
        // All good
        toast.success('Database connection successful! All required tables found.');
        await loadDbTables();
      }
    } else {
      throw new Error(data.message || data.error);
    }
  } catch (error: any) {
    toast.error(`Database connection failed: ${error.message}`);
    dbStatus.value = {
      connected: false,
      hasRequiredTables: false,
      missingTables: [],
      hasData: false,
      requiresMigration: false,
      tables: []
    };
  }
};

// Run database migrations
const runMigrations = async (action: 'run' | 'overwrite' | 'skip') => {
  if (action === 'skip') {
    showMigrationDialog.value = false;
    return;
  }

  isMigratingDatabase.value = true;

  try {
    const response = await fetch('/api/setup/run-migrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dbConfig.value,
        action: action
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(action === 'overwrite' ? 'Database overwritten and migrations completed!' : 'Migrations completed successfully!');
      showMigrationDialog.value = false;

      // Test connection again to verify
      await testDbConnection();
    } else {
      throw new Error(data.message || 'Migration failed');
    }
  } catch (error: any) {
    toast.error(`Migration failed: ${error.message}`);
  } finally {
    isMigratingDatabase.value = false;
  }
};

// Save database configuration with confirmation (called from AlertDialog)
const confirmSaveDatabase = async () => {
  try {
    // First test the connection and validate schema
    const testResponse = await fetch('/api/database/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbConfig.value),
    });

    const testData = await testResponse.json();

    if (!testData.success) {
      throw new Error('Database connection failed. Please verify your settings.');
    }

    // Check if database has required tables
    if (testData.status && !testData.status.hasRequiredTables) {
      toast.error('Database is missing required tables. Please run migrations first.');
      showMigrationDialog.value = true;
      return;
    }

    // Update environment variables with new DB config
    const updatedEnv = {
      ...envVars.value,
      DB_CLIENT: 'mysql2',
      DB_HOST: dbConfig.value.host,
      DB_PORT: String(dbConfig.value.port),
      DB_USER: dbConfig.value.user,
      DB_PASSWORD: dbConfig.value.password,
      DB_NAME: dbConfig.value.database,
      VITE_DB_CLIENT: 'mysql',
      VITE_DB_HOST: dbConfig.value.host,
      VITE_DB_PORT: String(dbConfig.value.port),
      VITE_DB_USER: dbConfig.value.user,
      VITE_DB_PASSWORD: dbConfig.value.password,
      VITE_DB_NAME: dbConfig.value.database,
    };

    const response = await fetch('/api/env/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ env: updatedEnv }),
    });

    const data = await response.json();
    if (data.success) {
      envVars.value = updatedEnv;
      toast.success('Database configuration saved successfully! Reloading system configuration...');

      // Clear any cached configuration data
      localStorage.removeItem('app_config');

      // Reload system config from new database
      await systemConfigStore.loadConfig();
      form.value = { ...systemConfigStore.config };

      // Reload database viewer
      await loadDbTables();

      // Notify user to refresh the page
      setTimeout(() => {
        toast.info('Please refresh the page to fully apply database changes.');
      }, 1500);
    } else {
      throw new Error(data.error);
    }
  } catch (error: any) {
    toast.error(`Failed to save database configuration: ${error.message}`);
  }
};

// Save configuration to database (always database-only now)
const saveConfiguration = async () => {
  try {
    console.log('Saving configuration:', form.value);

    // Save all configuration to database
    await systemConfigStore.saveToDB(form.value);

    console.log('Configuration saved, current store config:', systemConfigStore.config);

    toast.success('Configuration saved to database successfully');
  } catch (error: any) {
    console.error('Failed to save configuration:', error);
    toast.error(`Failed to save configuration: ${error.message}`);
  }
};

const resetToDefaults = async () => {
  await systemConfigStore.resetToDefaults();
  form.value = { ...systemConfigStore.config };
  toast.success('Reset to defaults');
};
</script>

<template>
  <div class="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
    <div class="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">System Configuration</h1>
        <p class="text-muted-foreground text-lg">Manage your system's appearance and behavior</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline" size="lg" class="gap-2"><RotateCcw class="h-4 w-4" />Reset All</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Configuration?</AlertDialogTitle>
            <AlertDialogDescription>This will restore all settings to their default values.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="resetToDefaults">Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

    <!-- Configuration Tabs -->
    <Tabs default-value="branding" class="space-y-6">
      <TabsList class="inline-flex h-auto w-full items-center justify-center rounded-lg bg-muted/50 p-1.5">
        <TabsTrigger value="branding" class="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Palette class="h-4 w-4" />
          Branding
        </TabsTrigger>
        <TabsTrigger value="login" class="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <FileImage class="h-4 w-4" />
          Login Page
        </TabsTrigger>
        <TabsTrigger value="database" class="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Database class="h-4 w-4" />
          Database
        </TabsTrigger>
        <TabsTrigger value="environment" class="inline-flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <FileText class="h-4 w-4" />
          Environment
        </TabsTrigger>
      </TabsList>

      <!-- Branding Tab -->
      <TabsContent value="branding" class="space-y-6">
        <Card>
          <CardHeader class="pb-4">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10"><Type class="h-5 w-5 text-primary" /></div>
              <div>
                <CardTitle>System Name</CardTitle>
                <CardDescription>Displayed across the application</CardDescription>
              </div>
        </div>
      </CardHeader>
      <CardContent>
        <Input v-model="form.systemName" placeholder="Enter system name" class="text-lg h-12" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10"><Image class="h-5 w-5 text-primary" /></div>
          <div>
            <CardTitle>System Logos</CardTitle>
            <CardDescription>Different logos for light and dark themes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <Sun class="h-5 w-5 text-amber-500" />
              <Label class="text-base font-medium">Light Mode</Label>
            </div>
            <div class="relative aspect-video rounded-lg border-2 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden group">
              <img v-if="logoLightPreview" :src="logoLightPreview" alt="Light Logo" class="max-h-[80%] max-w-[80%] object-contain transition-transform group-hover:scale-105" />
              <div v-else class="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Image class="h-16 w-16 opacity-20" />
                <span class="text-sm">No logo uploaded</span>
              </div>
              <Badge class="absolute top-2 right-2 bg-white/90 text-slate-700">Preview</Badge>
            </div>
            <input ref="logoLightFileInput" type="file" accept="image/*" class="hidden" @change="handleLogoLightUpload" />
            <Button variant="outline" class="w-full h-11" @click="logoLightFileInput?.click()">
              <Upload class="h-4 w-4 mr-2" />Upload Light Logo
            </Button>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-3">
              <Moon class="h-5 w-5 text-blue-500" />
              <Label class="text-base font-medium">Dark Mode</Label>
            </div>
            <div class="relative aspect-video rounded-lg border-2 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden group">
              <img v-if="logoDarkPreview" :src="logoDarkPreview" alt="Dark Logo" class="max-h-[80%] max-w-[80%] object-contain transition-transform group-hover:scale-105" />
              <div v-else class="flex flex-col items-center justify-center gap-3 text-slate-400">
                <Image class="h-16 w-16 opacity-20" />
                <span class="text-sm">No logo uploaded</span>
              </div>
              <Badge class="absolute top-2 right-2 bg-slate-800/90 text-slate-200">Preview</Badge>
            </div>
            <input ref="logoDarkFileInput" type="file" accept="image/*" class="hidden" @change="handleLogoDarkUpload" />
            <Button variant="outline" class="w-full h-11" @click="logoDarkFileInput?.click()">
              <Upload class="h-4 w-4 mr-2" />Upload Dark Logo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
      </TabsContent>

      <!-- Login Page Tab -->
      <TabsContent value="login" class="space-y-6">
        <Card>
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10"><FileImage class="h-5 w-5 text-primary" /></div>
              <div>
                <CardTitle>Login Page</CardTitle>
                <CardDescription>Customize the login experience</CardDescription>
              </div>
            </div>
          </CardHeader>
      <CardContent class="space-y-8">
        <!-- Logo Configuration -->
        <div class="space-y-4 pb-8 border-b">
          <div class="flex items-center gap-2 mb-4">
            <Palette class="h-4 w-4 text-muted-foreground" />
            <Label class="text-base font-semibold">Logo Settings</Label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <Label>Logo Mode</Label>
              <Select v-model="form.loginLogoMode">
                <SelectTrigger class="h-11">
                  <SelectValue placeholder="Select logo mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div class="flex items-center gap-2">
                      <Sun class="h-4 w-4" />
                      <span>Light Mode Logo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div class="flex items-center gap-2">
                      <Moon class="h-4 w-4" />
                      <span>Dark Mode Logo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="theme">
                    <div class="flex items-center gap-2">
                      <Palette class="h-4 w-4" />
                      <span>Follow Current Theme</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">Choose which logo to display on login page</p>
            </div>
            <div class="space-y-3">
              <Label>Logo Size</Label>
              <Select v-model="form.loginLogoSize">
                <SelectTrigger class="h-11">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (128px)</SelectItem>
                  <SelectItem value="medium">Medium (192px)</SelectItem>
                  <SelectItem value="large">Large (256px)</SelectItem>
                  <SelectItem value="custom">Custom Size</SelectItem>
                </SelectContent>
              </Select>
              <Input
                v-if="form.loginLogoSize === 'custom'"
                v-model.number="form.loginLogoCustomSize"
                type="number"
                min="50"
                max="500"
                placeholder="Custom size in pixels"
                class="h-11 mt-2"
              />
            </div>
          </div>
        </div>

        <!-- Background & Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <Label class="text-base font-medium">Background Image</Label>
            <div class="relative aspect-[21/9] rounded-lg border-2 overflow-hidden group bg-muted">
              <img v-if="loginImagePreview" :src="loginImagePreview" alt="Login BG" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <FileImage class="h-16 w-16 opacity-20" />
                <span class="text-sm">No background image uploaded</span>
              </div>
              <div v-if="loginImagePreview" class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge class="absolute top-4 left-4" :class="loginImagePreview ? 'bg-black/60 text-white' : 'bg-white/90 text-slate-700'">Login Background</Badge>
            </div>
            <input ref="loginImageFileInput" type="file" accept="image/*" class="hidden" @change="handleLoginImageUpload" />
            <Button variant="outline" class="w-full h-11" @click="loginImageFileInput?.click()">
              <Upload class="h-4 w-4 mr-2" />Upload Background
            </Button>
          </div>
          <div class="space-y-4">
            <div class="space-y-3">
              <Label class="text-base font-medium">Title</Label>
              <Input v-model="form.loginTitle" placeholder="Login title" class="h-11" />
            </div>
            <div class="space-y-3">
              <Label class="text-base font-medium">Description</Label>
              <Textarea v-model="form.loginDescription" placeholder="Description" rows="5" class="resize-none" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
      </TabsContent>

      <!-- Database Tab -->
      <TabsContent value="database" class="space-y-6">
        <Card>
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10"><Database class="h-5 w-5 text-primary" /></div>
              <div>
                <CardTitle>Database Configuration</CardTitle>
            <CardDescription>Configure MySQL/MariaDB connection settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <form @submit.prevent="testDbConnection">
        <!-- Connection String Input -->
        <div class="space-y-2 pb-4 border-b">
          <Label class="flex items-center gap-2">
            <Database class="h-4 w-4" />
            Connection String
          </Label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Input
                v-model="connectionStringInput"
                :type="showConnectionString ? 'text' : 'password'"
                placeholder="mysql://user:password@host:port/database"
                class="font-mono text-sm pr-20"
                @blur="() => connectionStringInput && parseConnectionString(connectionStringInput)"
              />
              <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="h-7 w-7 p-0"
                  @click="showConnectionString = !showConnectionString"
                >
                  <Eye v-if="!showConnectionString" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="h-7 w-7 p-0"
                  @click="copyConnectionString"
                >
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">
            Paste a connection string or fill individual fields below. Changes sync both ways.
          </p>
        </div>

        <!-- Individual Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div class="space-y-2">
            <Label>Host</Label>
            <Input v-model="dbConfig.host" placeholder="160.30.209.137" />
          </div>
          <div class="space-y-2">
            <Label>Port</Label>
            <Input v-model.number="dbConfig.port" type="number" placeholder="12888" />
          </div>
          <div class="space-y-2">
            <Label>Database Name</Label>
            <Input v-model="dbConfig.database" placeholder="default" />
          </div>
          <div class="space-y-2">
            <Label>Username</Label>
            <Input v-model="dbConfig.user" placeholder="mariadb" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <Label>Password</Label>
            <Input v-model="dbConfig.password" type="password" placeholder="Enter database password" autocomplete="current-password" />
          </div>
        </div>
        <div class="flex gap-3 pt-4">
          <Button type="submit" variant="outline">
            <Database class="h-4 w-4 mr-2" />Test Connection
          </Button>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button type="button">
                <CheckCircle2 class="h-4 w-4 mr-2" />Save Database Configuration
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent class="sm:max-w-[500px]">
              <AlertDialogHeader>
                <AlertDialogTitle class="flex items-center gap-2">
                  <Database class="h-5 w-5 text-primary" />
                  Confirm Database Connection
                </AlertDialogTitle>
                <AlertDialogDescription class="space-y-3 pt-2">
                  <p class="text-foreground">You are about to save the following database configuration:</p>
                  <div class="bg-muted rounded-lg p-4 space-y-2 text-sm font-mono">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Host:</span>
                      <span class="font-semibold text-foreground">{{ dbConfig.host }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Port:</span>
                      <span class="font-semibold text-foreground">{{ dbConfig.port }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Database:</span>
                      <span class="font-semibold text-foreground">{{ dbConfig.database }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">User:</span>
                      <span class="font-semibold text-foreground">{{ dbConfig.user }}</span>
                    </div>
                  </div>
                  <div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <div class="flex gap-2">
                      <AlertCircle class="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                      <div class="text-xs text-amber-800 dark:text-amber-200">
                        <p class="font-medium">Important</p>
                        <p>This will test the connection, update your .env file, and reload all system configurations from the new database.</p>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="confirmSaveDatabase">
                  <CheckCircle2 class="h-4 w-4 mr-2" />
                  Confirm & Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        </form>
        <div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div class="flex gap-2">
            <AlertCircle class="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-amber-800 dark:text-amber-200">
              <p class="font-medium mb-1">Important</p>
              <p>Changes to database configuration require application restart to take effect. The configuration will be saved to the .env file.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Database Viewer Section -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
              <Eye class="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Database Viewer</CardTitle>
              <CardDescription>
                Browse and inspect database tables and records
                <span v-if="dbConfig.host && dbConfig.database" class="block mt-1 font-mono text-xs">
                  Connected to: <strong>{{ dbConfig.database }}</strong> @ {{ dbConfig.host }}:{{ dbConfig.port }}
                </span>
              </CardDescription>
            </div>
          </div>
          <div class="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" :disabled="dbTables.length === 0">
                  <Download class="h-4 w-4 mr-2" />
                  Export Schema
                  <ChevronDown class="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="exportSchema('sql')">
                  <FileText class="h-4 w-4 mr-2" />
                  Export as SQL
                </DropdownMenuItem>
                <DropdownMenuItem @click="exportSchema('json')">
                  <FileText class="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button @click="refreshDbViewer" :disabled="isLoadingDbViewer" variant="outline" size="sm">
              <RotateCcw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isLoadingDbViewer }" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Table Selection -->
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label>Select Table</Label>
            <Select v-model="selectedDbTable" @update:model-value="loadDbTableData">
              <SelectTrigger class="h-11">
                <SelectValue placeholder="Choose a table to view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="table in dbTables" :key="table.name" :value="table.name">
                  <div class="flex items-center gap-2">
                    <TableIcon class="h-4 w-4" />
                    {{ table.name }}
                    <Badge variant="secondary" class="ml-auto">{{ table.rows }} rows</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>Search in Table</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                v-model="dbSearchQuery"
                placeholder="Search records..."
                class="pl-9 h-11"
                :disabled="!selectedDbTable"
              />
            </div>
          </div>
        </div>

        <!-- Table Structure -->
        <div v-if="selectedDbTable && dbColumns.length > 0" class="space-y-4">
          <div class="flex items-center gap-2 border-b pb-2">
            <TableIcon class="h-4 w-4 text-muted-foreground" />
            <h3 class="font-semibold">Table Structure: {{ selectedDbTable }}</h3>
          </div>
          <div class="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/50">
                  <TableHead class="font-semibold">Field</TableHead>
                  <TableHead class="font-semibold">Type</TableHead>
                  <TableHead class="font-semibold">Null</TableHead>
                  <TableHead class="font-semibold">Key</TableHead>
                  <TableHead class="font-semibold">Default</TableHead>
                  <TableHead class="font-semibold">Extra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="column in dbColumns" :key="column.Field">
                  <TableCell class="font-medium">{{ column.Field }}</TableCell>
                  <TableCell>
                    <Badge variant="outline" class="font-mono text-xs">{{ column.Type }}</Badge>
                  </TableCell>
                  <TableCell>{{ column.Null }}</TableCell>
                  <TableCell>
                    <Badge v-if="column.Key" variant="secondary">{{ column.Key }}</Badge>
                    <span v-else class="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell class="text-muted-foreground">{{ column.Default || '-' }}</TableCell>
                  <TableCell class="text-muted-foreground">{{ column.Extra || '-' }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- Table Data -->
        <div v-if="selectedDbTable && dbRows.length > 0" class="space-y-4">
          <div class="flex items-center justify-between border-b pb-2">
            <div class="flex items-center gap-2">
              <Database class="h-4 w-4 text-muted-foreground" />
              <h3 class="font-semibold">Table Data</h3>
              <Badge variant="outline">{{ dbTotalRows }} records</Badge>
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="goToDbPage(dbCurrentPage - 1)"
                :disabled="dbCurrentPage === 1"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span class="text-sm text-muted-foreground px-2">
                Page {{ dbCurrentPage }} of {{ dbTotalPages }}
              </span>
              <Button
                variant="outline"
                size="sm"
                @click="goToDbPage(dbCurrentPage + 1)"
                :disabled="dbCurrentPage === dbTotalPages"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="rounded-lg border overflow-x-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/50">
                  <TableHead v-for="column in dbColumns" :key="column.Field" class="font-semibold whitespace-nowrap">
                    {{ column.Field }}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-if="dbFilteredRows.length === 0">
                  <TableCell :colspan="dbColumns.length" class="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
                <TableRow v-for="(row, index) in dbFilteredRows" :key="index" class="hover:bg-muted/30">
                  <TableCell v-for="column in dbColumns" :key="column.Field" class="max-w-xs truncate">
                    <span v-if="row[column.Field] === null" class="text-muted-foreground italic text-sm">
                      NULL
                    </span>
                    <span v-else class="text-sm">{{ row[column.Field] }}</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- Empty State - No Table Selected -->
        <div v-if="!selectedDbTable && dbTables.length > 0" class="py-12 text-center">
          <TableIcon class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 class="text-lg font-medium mb-2">No Table Selected</h3>
          <p class="text-muted-foreground text-sm">
            Select a table from the dropdown above to view its structure and data
          </p>
        </div>

        <!-- Empty State - No Database Connected -->
        <div v-if="dbTables.length === 0 && !isLoadingDbViewer" class="py-12 text-center">
          <Database class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 class="text-lg font-medium mb-2">No Database Connection</h3>
          <p class="text-muted-foreground text-sm mb-4">
            Configure your database settings above and click "Test Connection" to view tables
          </p>
          <Button @click="testDbConnection" variant="outline">
            <Database class="h-4 w-4 mr-2" />
            Connect to Database
          </Button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingDbViewer" class="py-12 text-center">
          <RotateCcw class="h-12 w-12 mx-auto text-muted-foreground/50 mb-4 animate-spin" />
          <h3 class="text-lg font-medium mb-2">Loading Database Tables...</h3>
          <p class="text-muted-foreground text-sm">
            Please wait while we fetch the database structure
          </p>
        </div>
      </CardContent>
    </Card>
      </TabsContent>

      <!-- Environment Tab -->
      <TabsContent value="environment" class="space-y-6">
        <Card>
          <CardHeader>
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10"><FileText class="h-5 w-5 text-primary" /></div>
              <div>
                <CardTitle>Environment Variables</CardTitle>
                <CardDescription>Edit .env file variables (Database variables are managed through the Database tab)</CardDescription>
              </div>
        </div>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="saveEnvVars">
        <!-- Add New Environment Variable -->
        <div class="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-medium mb-3 flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Add New Variable
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div class="md:col-span-2">
              <Input
                v-model="newEnvKey"
                placeholder="KEY_NAME"
                class="font-mono text-sm uppercase"
                @keyup.enter="addEnvVar"
              />
            </div>
            <div class="md:col-span-2">
              <Input
                v-model="newEnvValue"
                placeholder="value"
                class="font-mono text-sm"
                @keyup.enter="addEnvVar"
              />
            </div>
            <Button type="button" @click="addEnvVar" class="w-full">
              <Plus class="h-4 w-4 mr-2" />Add
            </Button>
          </div>
        </div>

        <!-- Existing Environment Variables -->
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div v-for="(value, key) in envVars" :key="key" :class="['flex items-center gap-3 p-3 rounded-lg border transition-colors', isDbEnvKey(key) ? 'bg-muted/30 border-dashed' : 'hover:bg-muted/50']">
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex items-center gap-2">
                <Lock v-if="isDbEnvKey(key)" class="h-3 w-3 text-muted-foreground" />
                <Label class="text-xs text-muted-foreground mb-1.5 block">{{ key }}</Label>
              </div>
              <div class="relative">
                <Input
                  v-model="envVars[key]"
                  :type="key.toLowerCase().includes('password') ? 'password' : 'text'"
                  :autocomplete="key.toLowerCase().includes('password') ? 'current-password' : 'off'"
                  :disabled="isDbEnvKey(key)"
                  :class="['font-mono text-sm h-9', isDbEnvKey(key) ? 'cursor-not-allowed opacity-60' : '']"
                />
                <span v-if="isDbEnvKey(key)" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  (Database tab)
                </span>
              </div>
            </div>
            <Button
              type="button"
              @click="deleteEnvVar(key)"
              variant="ghost"
              size="sm"
              :disabled="isDbEnvKey(key)"
              :class="isDbEnvKey(key) ? 'cursor-not-allowed opacity-40' : 'text-destructive hover:text-destructive hover:bg-destructive/10'"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="flex gap-3 pt-6">
          <Button type="button" @click="loadEnvVars" variant="outline" :disabled="isLoadingEnv">
            <RotateCcw class="h-4 w-4 mr-2" :class="{ 'animate-spin': isLoadingEnv }" />
            Reload
          </Button>
          <Button type="submit">
            <Save class="h-4 w-4 mr-2" />Save Environment
          </Button>
        </div>
        </form>
        <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <div class="flex gap-2">
            <AlertCircle class="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-blue-800 dark:text-blue-200">
              <p class="font-medium mb-1">Deployment Ready</p>
              <p>All changes are saved to .env file and will persist across deployments. Clone and deploy anywhere with ease.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
      </TabsContent>
    </Tabs>

    <!-- Migration Dialog -->
    <AlertDialog v-model:open="showMigrationDialog">
      <AlertDialogContent class="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle class="flex items-center gap-2">
            <Database class="h-5 w-5 text-amber-600" />
            Database Migration Required
          </AlertDialogTitle>
          <AlertDialogDescription class="space-y-4 pt-2">
            <div v-if="!dbStatus.hasRequiredTables && dbStatus.missingTables && dbStatus.missingTables.length > 0" class="space-y-3">
              <p class="text-foreground font-medium">The database is missing required system tables:</p>
              <div class="bg-muted rounded-lg p-4">
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li v-for="table in dbStatus.missingTables" :key="table" class="font-mono text-foreground">{{ table }}</li>
                </ul>
              </div>
              <p class="text-sm text-muted-foreground">These tables are required for the system to function properly.</p>
            </div>
            <div v-else-if="!dbStatus.hasRequiredTables" class="space-y-3">
              <p class="text-foreground font-medium">The database is missing required system tables.</p>
              <p class="text-sm text-muted-foreground">Required tables: users, system_configuration, audit_logs</p>
            </div>
            <div v-else-if="!dbStatus.hasData" class="space-y-3">
              <p class="text-foreground font-medium">The required tables exist but appear to be empty.</p>
              <p class="text-sm text-muted-foreground">You may need to run migrations to initialize the system with default data.</p>
            </div>

            <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p class="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">What would you like to do?</p>
              <div class="space-y-2 text-xs text-blue-700 dark:text-blue-300">
                <p><strong>Run Migrations:</strong> Create missing tables and initialize with default data (recommended for new databases).</p>
                <p><strong>Overwrite:</strong> Drop all existing tables and recreate them with fresh data (warning: this will delete all existing data!).</p>
                <p><strong>Skip:</strong> Continue without running migrations (system may not work properly).</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="gap-2 sm:gap-2">
          <AlertDialogCancel @click="runMigrations('skip')" :disabled="isMigratingDatabase">
            Skip for Now
          </AlertDialogCancel>
          <Button
            @click="runMigrations('overwrite')"
            variant="destructive"
            :disabled="isMigratingDatabase"
          >
            <AlertCircle class="h-4 w-4 mr-2" />
            Overwrite Database
          </Button>
          <Button
            @click="runMigrations('run')"
            :disabled="isMigratingDatabase"
          >
            <CheckCircle2 v-if="!isMigratingDatabase" class="h-4 w-4 mr-2" />
            <RotateCcw v-else class="h-4 w-4 mr-2 animate-spin" />
            {{ isMigratingDatabase ? 'Running...' : 'Run Migrations' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div class="sticky bottom-6 z-10">
      <Card class="border-2 shadow-2xl">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Settings class="h-5 w-5 text-muted-foreground" />
              <div>
                <p class="font-medium">Ready to save changes?</p>
                <p class="text-sm text-muted-foreground">Configuration will be saved to database</p>
              </div>
            </div>
            <div class="flex gap-3">
              <Button variant="outline" size="lg" @click="resetToDefaults">Cancel</Button>
              <Button size="lg" @click="saveConfiguration" class="px-8">Save Configuration</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  </div>
</template>
