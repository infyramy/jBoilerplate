<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useColorMode } from '@vueuse/core';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'vue-sonner';
import { Paintbrush, Sun, Moon, Laptop, Check } from 'lucide-vue-next';

// Define props for v-model binding
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

// Define emits for v-model binding
const emit = defineEmits(['update:open']);

// Create a computed property for isOpen with getter and setter for v-model support
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});
const colorMode = useColorMode();
const activeTab = ref('colors');

// Available color schemes
const colorSchemes = [
  { name: 'zinc', value: 'zinc', hsl: '240 5.9% 10%' },
  { name: 'slate', value: 'slate', hsl: '215.4 16.3% 46.9%' },
  { name: 'stone', value: 'stone', hsl: '25 5.3% 44.7%' },
  { name: 'gray', value: 'gray', hsl: '220 8.9% 46.1%' },
  { name: 'neutral', value: 'neutral', hsl: '0 0% 45.1%' },
  { name: 'red', value: 'red', hsl: '0 72.2% 50.6%' },
  { name: 'rose', value: 'rose', hsl: '346.8 77.2% 49.8%' },
  { name: 'orange', value: 'orange', hsl: '24.6 95% 53.1%' },
  { name: 'green', value: 'green', hsl: '142.1 76.2% 36.3%' },
  { name: 'blue', value: 'blue', hsl: '221.2 83.2% 53.3%' },
  { name: 'yellow', value: 'yellow', hsl: '47.9 95.8% 53.1%' },
  { name: 'violet', value: 'violet', hsl: '262.1 83.3% 57.8%' },
  { name: 'claude', value: 'claude', hsl: '35 68.0412% 38.0392%' },
];

// Available border radius options
const radiusOptions = [
  { name: 'None', value: '0', variable: '0rem' },
  { name: 'Small', value: '0.25', variable: '0.25rem' },
  { name: 'Medium', value: '0.5', variable: '0.5rem' },
  { name: 'Large', value: '0.75', variable: '0.75rem' },
  { name: 'Extra Large', value: '1', variable: '1rem' },
];

// Available theme modes
const themeModes = [
  { name: 'Light', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: Moon },
  { name: 'System', value: 'auto', icon: Laptop },
];

// Current selections
const currentColorScheme = ref(localStorage.getItem('theme-color') || 'zinc');
const currentRadius = ref(localStorage.getItem('theme-radius') || '0.5');
const currentThemeMode = computed(() => colorMode.value);

// Apply the color scheme
function applyColorScheme(color: string) {
  const root = document.documentElement;
  
  // Only update if the color scheme has changed or we're re-applying the same theme
  if (currentColorScheme.value !== color || localStorage.getItem('theme-color') === color) {
    // Save the selection to localStorage
    localStorage.setItem('theme-color', color);
    currentColorScheme.value = color;
    
    // Reset any previously set inline styles to ensure clean theme application
    root.style.removeProperty('--primary');
    root.style.removeProperty('--background');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--card');
    root.style.removeProperty('--card-foreground');
    root.style.removeProperty('--border');
    root.style.removeProperty('--input');
    root.style.removeProperty('--ring');
    
    // Set the data attribute for the color scheme
    // This will apply all CSS variables defined in theme-customizer.css
    root.setAttribute('data-color-scheme', color);
    
    // Generate CSS based on the color scheme
    // This handles any special cases and ensures all necessary CSS variables are set
    generateColorSchemeCSS(color);
    
    if (color !== currentColorScheme.value) {
      toast.success(`Color scheme changed to ${color}`);
    }
  }
}

// Apply border radius
function applyRadius(radius: string) {
  const root = document.documentElement;
  
  // Only update if the radius has changed
  if (currentRadius.value !== radius) {
    // Save the selection to localStorage
    localStorage.setItem('theme-radius', radius);
    currentRadius.value = radius;
    
    // Update the CSS variable for radius
    root.style.setProperty('--radius', `${radius}rem`);
    
    toast.success(`Border radius changed to ${radius}rem`);
  }
}

// Apply theme mode (light/dark/system)
function applyThemeMode(mode: 'light' | 'dark' | 'auto') {
  colorMode.value = mode as any; // Cast to any to avoid type issues with vueuse
  
  // Apply dark class directly
  const isDarkMode = mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  localStorage.setItem('theme', mode);
  
  // Re-apply current theme to update for dark/light mode
  const currentTheme = localStorage.getItem('theme-color') || 'zinc';
  applyColorScheme(currentTheme);
  
  toast.success(`Theme mode changed to ${mode}`);
}

// Special function to apply the Claude theme comprehensively
function applyClaudeTheme() {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  
  // Clear any inline styles first
  root.style.removeProperty('--primary');
  root.style.removeProperty('--background');
  root.style.removeProperty('--foreground');
  
  // Set data attribute for Claude theme
  root.setAttribute('data-color-scheme', 'claude');
  
  // Set primary color based on light/dark mode
  if (isDark) {
    root.style.setProperty('--primary', '14.8052 74.7573% 59.6078%');
  } else {
    root.style.setProperty('--primary', '35 68.0412% 38.0392%');
  }
  
  // Update font settings
  document.body.style.fontFamily = 'Geist, sans-serif';
  document.body.style.letterSpacing = '-0.01em';
}

// Generate CSS for a color scheme (simplified implementation)
function generateColorSchemeCSS(color: string) {
  const selectedColor = colorSchemes.find(c => c.value === color);
  if (!selectedColor) return;
  
  const root = document.documentElement;
  
  // Always clear any directly set CSS variables first
  root.style.removeProperty('--primary');
  
  // Set the data attribute which will apply all CSS variables from theme-customizer.css
  root.setAttribute('data-color-scheme', color);
  
  // For Claude theme specifically, we need to apply comprehensive changes
  if (color === 'claude') {
    applyClaudeTheme();
  } else {
    // Reset font settings (use default theme fonts)
    document.body.style.fontFamily = '';
    document.body.style.letterSpacing = '';
    // For other themes, set primary color directly
    root.style.setProperty('--primary', selectedColor.hsl);
  }
}

// Reset all theme settings to defaults
function resetTheme() {
  applyColorScheme('zinc');
  applyRadius('0.5');
  applyThemeMode('light');
  toast.success('Theme reset to defaults');
}

// Initialize theme settings on mount
onMounted(() => {
  const root = document.documentElement;
  
  // Apply saved color scheme
  const savedColor = localStorage.getItem('theme-color');
  if (savedColor) {
    // Apply dark/light mode first
    const mode = localStorage.getItem('theme') || 'light';
    if (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Set the data attribute first
    root.setAttribute('data-color-scheme', savedColor);
    
    // Special handling for Claude theme
    if (savedColor === 'claude') {
      applyClaudeTheme();
    } else {
      // Then apply the color scheme which will handle special cases
      applyColorScheme(savedColor);
    }
  } else {
    // Default to zinc if no theme is saved
    applyColorScheme('zinc');
  }
  
  // Apply saved radius
  const savedRadius = localStorage.getItem('theme-radius');
  if (savedRadius) {
    applyRadius(savedRadius);
  }
  
  // Theme mode is already handled by useColorMode()
});
</script>

<template>
  <!-- Theme Customizer Dialog -->
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[500px] p-6">
      <DialogHeader>
        <DialogTitle>Theme Customizer</DialogTitle>
        <DialogDescription>
          Customize the appearance of the interface by selecting colors, radius, and theme mode.
        </DialogDescription>
      </DialogHeader>
      <Tabs v-model:value="activeTab" class="w-full mt-4">
        <TabsList class="w-full gap-2">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="radius">Radius</TabsTrigger>
          <TabsTrigger value="mode">Mode</TabsTrigger>
        </TabsList>
        <!-- Color Schemes Tab -->
        <TabsContent value="colors" class="p-4">
          <div class="grid grid-cols-3 gap-2">
            <TooltipProvider>
              <div v-for="color in colorSchemes" :key="color.value">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      :class="[
                        'w-full flex items-center gap-2 justify-start',
                        currentColorScheme === color.value ? 'border-2 border-primary' : ''
                      ]"
                      @click="applyColorScheme(color.value)"
                    >
                      <span 
                        class="h-5 w-5 rounded-full border border-border" 
                        :style="{ backgroundColor: `hsl(${color.hsl})` }"
                      ></span>
                      <span class="capitalize text-xs">{{ color.name }}</span>
                      <Check v-if="currentColorScheme === color.value" class="h-3 w-3 ml-auto" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ color.name }}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </TabsContent>
        <!-- Border Radius Tab -->
        <TabsContent value="radius" class="p-4">
          <div class="grid grid-cols-3 gap-2">
            <TooltipProvider>
              <div v-for="radius in radiusOptions" :key="radius.value">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      :class="[
                        'w-full flex items-center gap-2 justify-start',
                        currentRadius === radius.value ? 'border-2 border-primary' : ''
                      ]"
                      @click="applyRadius(radius.value)"
                    >
                      <div 
                        class="h-5 w-5 border border-foreground/20 bg-muted" 
                        :style="{ borderRadius: radius.variable }"
                      ></div>
                      <span class="text-xs">{{ radius.name }}</span>
                      <Check v-if="currentRadius === radius.value" class="h-3 w-3 ml-auto" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ radius.name }} ({{ radius.variable }})</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </TabsContent>
        <!-- Theme Mode Tab -->
        <TabsContent value="mode" class="p-4">
          <div class="grid grid-cols-3 gap-2">
            <div v-for="mode in themeModes" :key="mode.value">
              <Button
                variant="outline"
                size="sm"
                :class="[
                  'w-full flex items-center gap-2 justify-start',
                  currentThemeMode === mode.value ? 'border-2 border-primary' : ''
                ]"
                @click="applyThemeMode(mode.value as 'light' | 'dark' | 'auto')"
              >
                <component :is="mode.icon" class="h-4 w-4" />
                <span class="text-xs">{{ mode.name }}</span>
                <Check v-if="currentThemeMode === mode.value" class="h-3 w-3 ml-auto" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter class="flex justify-between mt-6">
        <Button variant="outline" @click="resetTheme">Reset to Defaults</Button>
        <Button @click="isOpen = false">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template> 