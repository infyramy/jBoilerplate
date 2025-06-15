<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground">
          Theme & Appearance
        </h1>
        <p class="text-muted-foreground mt-1">
          Customize your application's colors, typography and more
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" class="flex items-center gap-2" @click="resetTheme">
          <RotateCcw class="h-4 w-4" />
          <span>Reset</span>
        </Button>
        <Button size="sm" class="flex items-center gap-2" @click="saveTheme">
          <Save class="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Theme Settings -->
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Customize the core color scheme of your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <Label>Primary Color</Label>
                  <div class="flex mt-1.5">
                    <div 
                      class="h-10 w-10 rounded-l-md border-y border-l flex items-center justify-center cursor-pointer hover:bg-muted/50"
                      @click="isPrimaryPickerOpen = !isPrimaryPickerOpen"
                    >
                      <div 
                        class="h-6 w-6 rounded-sm" 
                        :style="{ backgroundColor: theme.primaryColor }"
                      ></div>
                    </div>
                    <Input 
                      v-model="theme.primaryColor"
                      class="rounded-l-none"
                      @focus="isPrimaryPickerOpen = true"
                    />
                  </div>
                  <div 
                    v-if="isPrimaryPickerOpen" 
                    class="relative z-10 mt-2"
                  >
                    <div class="absolute top-0 left-0 bg-popover border rounded-md shadow-md p-4">
                      <div class="grid grid-cols-8 gap-2">
                        <div
                          v-for="color in colorPalette"
                          :key="color"
                          class="h-6 w-6 rounded-sm cursor-pointer hover:ring-2 hover:ring-ring"
                          :style="{ backgroundColor: color }"
                          @click="setColor('primary', color)"
                        ></div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        class="mt-2 w-full"
                        @click="isPrimaryPickerOpen = false"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Secondary Color</Label>
                  <div class="flex mt-1.5">
                    <div 
                      class="h-10 w-10 rounded-l-md border-y border-l flex items-center justify-center cursor-pointer hover:bg-muted/50"
                      @click="isSecondaryPickerOpen = !isSecondaryPickerOpen"
                    >
                      <div 
                        class="h-6 w-6 rounded-sm" 
                        :style="{ backgroundColor: theme.secondaryColor }"
                      ></div>
                    </div>
                    <Input 
                      v-model="theme.secondaryColor"
                      class="rounded-l-none"
                      @focus="isSecondaryPickerOpen = true"
                    />
                  </div>
                  <div 
                    v-if="isSecondaryPickerOpen" 
                    class="relative z-10 mt-2"
                  >
                    <div class="absolute top-0 left-0 bg-popover border rounded-md shadow-md p-4">
                      <div class="grid grid-cols-8 gap-2">
                        <div
                          v-for="color in colorPalette"
                          :key="color"
                          class="h-6 w-6 rounded-sm cursor-pointer hover:ring-2 hover:ring-ring"
                          :style="{ backgroundColor: color }"
                          @click="setColor('secondary', color)"
                        ></div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        class="mt-2 w-full"
                        @click="isSecondaryPickerOpen = false"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <Label>Accent Color</Label>
                  <div class="flex mt-1.5">
                    <div 
                      class="h-10 w-10 rounded-l-md border-y border-l flex items-center justify-center cursor-pointer hover:bg-muted/50"
                      @click="isAccentPickerOpen = !isAccentPickerOpen"
                    >
                      <div 
                        class="h-6 w-6 rounded-sm" 
                        :style="{ backgroundColor: theme.accentColor }"
                      ></div>
                    </div>
                    <Input 
                      v-model="theme.accentColor"
                      class="rounded-l-none"
                      @focus="isAccentPickerOpen = true"
                    />
                  </div>
                  <div 
                    v-if="isAccentPickerOpen" 
                    class="relative z-10 mt-2"
                  >
                    <div class="absolute top-0 left-0 bg-popover border rounded-md shadow-md p-4">
                      <div class="grid grid-cols-8 gap-2">
                        <div
                          v-for="color in colorPalette"
                          :key="color"
                          class="h-6 w-6 rounded-sm cursor-pointer hover:ring-2 hover:ring-ring"
                          :style="{ backgroundColor: color }"
                          @click="setColor('accent', color)"
                        ></div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        class="mt-2 w-full"
                        @click="isAccentPickerOpen = false"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Border Radius</Label>
                  <Select v-model="theme.borderRadius" class="mt-1.5">
                    <option value="0">Square (0)</option>
                    <option value="0.125rem">Slight (0.125rem)</option>
                    <option value="0.25rem">Small (0.25rem)</option>
                    <option value="0.375rem">Medium (0.375rem)</option>
                    <option value="0.5rem">Default (0.5rem)</option>
                    <option value="0.75rem">Large (0.75rem)</option>
                    <option value="1rem">Extra Large (1rem)</option>
                    <option value="9999px">Full (9999px)</option>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Configure fonts and text styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <Label>Font Family</Label>
                <Select v-model="theme.fontFamily" class="mt-1.5">
                  <option value="Inter, sans-serif">Inter (Default)</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                  <option value="'Lato', sans-serif">Lato</option>
                  <option value="'Raleway', sans-serif">Raleway</option>
                  <option value="'Nunito', sans-serif">Nunito</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                </Select>
                <p class="text-sm text-muted-foreground mt-2">
                  Note: Changes to the font family require additional setup to include the font files
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preset Themes</CardTitle>
            <CardDescription>
              Choose from predefined theme combinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button
                v-for="preset in themePresets" 
                :key="preset.name"
                class="border rounded-md p-4 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                @click="applyPreset(preset)"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex space-x-1">
                    <div 
                      class="h-4 w-4 rounded-full" 
                      :style="{ backgroundColor: preset.primaryColor }"
                    ></div>
                    <div 
                      class="h-4 w-4 rounded-full" 
                      :style="{ backgroundColor: preset.secondaryColor }"
                    ></div>
                    <div 
                      class="h-4 w-4 rounded-full" 
                      :style="{ backgroundColor: preset.accentColor }"
                    ></div>
                  </div>
                  <div class="font-medium">{{ preset.name }}</div>
                </div>
                <div class="text-xs text-muted-foreground">{{ preset.description }}</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Preview -->
      <div>
        <Card class="sticky top-20">
          <CardHeader>
            <CardTitle>Theme Preview</CardTitle>
            <CardDescription>
              Live preview of your theme settings
            </CardDescription>
            <div class="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                @click="previewDarkMode = !previewDarkMode"
              >
                {{ previewDarkMode ? 'Dark Mode' : 'Light Mode' }}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              class="border rounded-lg p-6 overflow-hidden"
              :class="previewDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'"
              :style="getPreviewStyle()"
            >
              <div class="space-y-6">
                <div>
                  <h3 class="text-xl font-bold" :style="{ color: theme.primaryColor }">Preview Heading</h3>
                  <p class="text-sm mt-1">This is how your content will look with these settings.</p>
                </div>
                
                <div class="space-y-3">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                </div>
                
                <div class="p-4 rounded-md" :style="{ backgroundColor: theme.secondaryColor + '20' }">
                  <div class="font-medium mb-1" :style="{ color: theme.secondaryColor }">
                    Notice Box
                  </div>
                  <p class="text-sm">This is how notifications and information boxes will appear.</p>
                </div>
                
                <div class="flex space-x-2">
                  <div class="p-2 rounded-md" :style="{ backgroundColor: theme.primaryColor, color: '#fff' }">
                    Primary
                  </div>
                  <div class="p-2 rounded-md" :style="{ backgroundColor: theme.secondaryColor, color: '#fff' }">
                    Secondary
                  </div>
                  <div class="p-2 rounded-md" :style="{ backgroundColor: theme.accentColor, color: '#fff' }">
                    Accent
                  </div>
                </div>
                
                <div class="border-t pt-4">
                  <p class="text-xs text-muted-foreground">
                    Border radius: {{ theme.borderRadius }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Font: {{ theme.fontFamily.split(',')[0].replace(/'/g, '') }}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Save,
  RotateCcw,
} from 'lucide-vue-next';

// Define route meta for Vue Router
defineOptions({
  name: 'SuperadminTheme',
  meta: {
    layout: "dashboard",
    requiresAuth: true,
    roles: ["superadmin"]
  }
});

const configStore = useConfigStore();
const toast = useToast();

// UI state
const previewDarkMode = ref(false);
const isPrimaryPickerOpen = ref(false);
const isSecondaryPickerOpen = ref(false);
const isAccentPickerOpen = ref(false);
const isLoading = ref(false);

// Clone the theme settings to make them editable
const theme = ref({
  primaryColor: configStore.config.ui.theme.primaryColor,
  secondaryColor: configStore.config.ui.theme.secondaryColor,
  accentColor: configStore.config.ui.theme.accentColor,
  borderRadius: configStore.config.ui.theme.borderRadius,
  fontFamily: configStore.config.ui.theme.fontFamily,
});

// Sample color palette for pickers
const colorPalette = [
  // Blues
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
  
  // Reds
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  
  // Cyans and grays
  '#06b6d4', // cyan-500
  '#0891b2', // cyan-600
  '#0284c7', // sky-600
  '#1e40af', // blue-800
  '#1e293b', // slate-800
  '#334155', // slate-700
  '#475569', // slate-600
  '#64748b', // slate-500
];

// Theme presets
const themePresets = [
  {
    name: 'Sky Blue',
    description: 'Default theme with a clean, professional look',
    primaryColor: '#0ea5e9',
    secondaryColor: '#6366f1',
    accentColor: '#ec4899',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, sans-serif',
  },
  {
    name: 'Forest Green',
    description: 'Calming green theme inspired by nature',
    primaryColor: '#16a34a',
    secondaryColor: '#0d9488',
    accentColor: '#f59e0b',
    borderRadius: '0.375rem',
    fontFamily: 'Inter, sans-serif',
  },
  {
    name: 'Vibrant Purple',
    description: 'Bold and creative purple-based theme',
    primaryColor: '#8b5cf6',
    secondaryColor: '#6366f1',
    accentColor: '#ec4899',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, sans-serif',
  },
  {
    name: 'Ruby Red',
    description: 'Powerful and energetic red theme',
    primaryColor: '#ef4444',
    secondaryColor: '#8b5cf6',
    accentColor: '#f59e0b',
    borderRadius: '0.25rem',
    fontFamily: 'Inter, sans-serif',
  },
  {
    name: 'Midnight',
    description: 'Dark and sleek professional theme',
    primaryColor: '#334155',
    secondaryColor: '#0ea5e9',
    accentColor: '#22c55e',
    borderRadius: '0.25rem',
    fontFamily: 'Inter, sans-serif',
  },
  {
    name: 'Sunset Orange',
    description: 'Warm and inviting orange-based theme',
    primaryColor: '#f97316',
    secondaryColor: '#8b5cf6',
    accentColor: '#0ea5e9',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, sans-serif',
  },
];

// Methods
function setColor(type: 'primary' | 'secondary' | 'accent', color: string) {
  if (type === 'primary') {
    theme.value.primaryColor = color;
    isPrimaryPickerOpen.value = false;
  } else if (type === 'secondary') {
    theme.value.secondaryColor = color;
    isSecondaryPickerOpen.value = false;
  } else if (type === 'accent') {
    theme.value.accentColor = color;
    isAccentPickerOpen.value = false;
  }
}

function applyPreset(preset: typeof themePresets[0]) {
  theme.value = { ...preset };
  toast.success(`Applied theme preset: ${preset.name}`);
}

function getPreviewStyle() {
  return {
    '--primary': theme.value.primaryColor,
    '--secondary': theme.value.secondaryColor,
    '--accent': theme.value.accentColor,
    'border-radius': theme.value.borderRadius,
    'font-family': theme.value.fontFamily,
  };
}

function saveTheme() {
  isLoading.value = true;
  
  try {
    // Update theme configuration
    configStore.updateConfig('ui', {
      ...configStore.config.ui,
      theme: { ...theme.value }
    });
    
    toast.success('Theme settings saved successfully');
  } catch (error) {
    console.error('Failed to save theme settings:', error);
    toast.error('Failed to save theme settings');
  } finally {
    isLoading.value = false;
  }
}

function resetTheme() {
  if (confirm('Are you sure you want to reset theme to default settings? All changes will be lost.')) {
    theme.value = {
      primaryColor: configStore.getConfig.ui.theme.primaryColor,
      secondaryColor: configStore.getConfig.ui.theme.secondaryColor,
      accentColor: configStore.getConfig.ui.theme.accentColor,
      borderRadius: configStore.getConfig.ui.theme.borderRadius,
      fontFamily: configStore.getConfig.ui.theme.fontFamily,
    };
    
    toast.success('Theme settings reset to default');
  }
}

// Apply theme changes to preview in real-time
watch(theme, (newTheme) => {
  document.documentElement.style.setProperty('--preview-primary', newTheme.primaryColor);
  document.documentElement.style.setProperty('--preview-secondary', newTheme.secondaryColor);
  document.documentElement.style.setProperty('--preview-accent', newTheme.accentColor);
}, { deep: true });

onMounted(() => {
  // Add click outside handler to close color pickers
  document.addEventListener('click', (event) => {
    if (isPrimaryPickerOpen.value || isSecondaryPickerOpen.value || isAccentPickerOpen.value) {
      const target = event.target as HTMLElement;
      if (!target.closest('.color-picker')) {
        isPrimaryPickerOpen.value = false;
        isSecondaryPickerOpen.value = false;
        isAccentPickerOpen.value = false;
      }
    }
  });
});
</script>

<style scoped>
.color-picker {
  position: relative;
}
</style> 