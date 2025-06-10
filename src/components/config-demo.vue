<template>
  <div class="config-demo">
    <h2 class="text-2xl font-bold mb-4">Configuration Demo</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Environment Information -->
      <div class="bg-card p-4 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-2">Environment</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Current:</span>
            <span class="font-medium">{{ environment }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Is Development:</span>
            <span>
              <Badge v-if="isDevelopment" variant="default">Yes</Badge>
              <Badge v-else variant="secondary">No</Badge>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Is Production:</span>
            <span>
              <Badge v-if="isProduction" variant="default">Yes</Badge>
              <Badge v-else variant="secondary">No</Badge>
            </span>
          </div>
        </div>
      </div>
      
      <!-- API Configuration -->
      <div class="bg-card p-4 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-2">API Configuration</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">URL:</span>
            <span class="font-medium">{{ apiConfig.url }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Timeout:</span>
            <span class="font-medium">{{ apiConfig.timeout }}ms</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Retries:</span>
            <span class="font-medium">{{ apiConfig.retries }}</span>
          </div>
        </div>
      </div>
      
      <!-- Feature Flags -->
      <div class="bg-card p-4 rounded-lg shadow col-span-1 md:col-span-2">
        <h3 class="text-xl font-semibold mb-2">Feature Flags</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(enabled, feature) in features" :key="feature" 
               class="bg-background p-3 rounded-md flex flex-col items-center">
            <div class="mb-2">
              <Switch v-model="features[feature]" @update:modelValue="toggleFeature(feature)" />
            </div>
            <span class="text-sm font-medium">{{ formatFeatureName(feature) }}</span>
            <Badge :variant="enabled ? 'default' : 'destructive'" class="mt-1">
              {{ enabled ? 'Enabled' : 'Disabled' }}
            </Badge>
          </div>
        </div>
      </div>
      
      <!-- Runtime Configuration -->
      <div class="bg-card p-4 rounded-lg shadow col-span-1 md:col-span-2">
        <h3 class="text-xl font-semibold mb-2">Runtime Configuration</h3>
        <div class="flex gap-4 mb-4">
          <div class="flex-1">
            <Input v-model="newConfigKey" placeholder="Configuration Key" />
          </div>
          <div class="flex-1">
            <Input v-model="newConfigValue" placeholder="Configuration Value" />
          </div>
          <Button @click="addRuntimeConfig" :disabled="!newConfigKey">Add</Button>
        </div>
        
        <div v-if="Object.keys(runtimeConfig).length > 0" class="space-y-2">
          <div v-for="(value, key) in runtimeConfig" :key="key" 
               class="bg-background p-2 rounded-md flex justify-between items-center">
            <div>
              <span class="font-medium">{{ key }}:</span>
              <span class="ml-2">{{ value }}</span>
            </div>
            <Button variant="destructive" size="sm" @click="removeRuntimeConfig(key)">
              Remove
            </Button>
          </div>
        </div>
        <div v-else class="text-center text-muted-foreground py-2">
          No runtime configuration values yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, inject } from 'vue';
import { ConfigService } from '@/services/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

// Get config service via injection
const config = inject<ConfigService>('config')!;

// Environment information
const environment = ref(config.environment);
const isDevelopment = ref(config.isDevelopment);
const isProduction = ref(config.isProduction);

// API configuration
const apiConfig = ref(config.api);

// Feature flags
const features = reactive<Record<string, boolean>>({});

// Runtime configuration
const runtimeConfig = reactive<Record<string, any>>({});
const newConfigKey = ref('');
const newConfigValue = ref('');

// Initialize component
onMounted(() => {
  // Initialize feature flags
  Object.assign(features, config.features);
  
  // Load any existing runtime config
  const keys = ['theme', 'layout', 'language', 'sidebar'];
  keys.forEach(key => {
    const value = config.getRuntimeConfig(key);
    if (value !== undefined) {
      runtimeConfig[key] = value;
    }
  });
});

// Format feature name for display
const formatFeatureName = (feature: string): string => {
  return feature
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
};

// Toggle feature flag
const toggleFeature = (feature: string): void => {
  if (features[feature]) {
    config.enableFeature(feature);
  } else {
    config.disableFeature(feature);
  }
};

// Add runtime configuration
const addRuntimeConfig = (): void => {
  if (!newConfigKey) return;
  
  // Try to parse as JSON if possible
  let value: any = newConfigValue.value;
  try {
    if (value && (value.startsWith('{') || value.startsWith('[') || 
        value === 'true' || value === 'false' || !isNaN(Number(value)))) {
      value = JSON.parse(value);
    }
  } catch (e) {
    // If it fails to parse, use the string value
  }
  
  config.setRuntimeConfig(newConfigKey.value, value);
  runtimeConfig[newConfigKey.value] = value;
  
  // Clear inputs
  newConfigKey.value = '';
  newConfigValue.value = '';
};

// Remove runtime configuration
const removeRuntimeConfig = (key: string): void => {
  config.setRuntimeConfig(key, undefined);
  delete runtimeConfig[key];
};
</script> 