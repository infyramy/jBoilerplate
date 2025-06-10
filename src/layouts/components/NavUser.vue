<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  Languages,
  Settings,
  ChevronsUpDown,
  Sun,
  Moon,
  Laptop,
} from "lucide-vue-next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import KeyboardShortcutsDialog from "@/components/KeyboardShortcutsDialog.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from 'vue-i18n';
import { toast } from "vue-sonner";
import { useColorMode } from "@vueuse/core";
import ThemeCustomizer from "@/components/ThemeCustomizer.vue";

const router = useRouter();
const authStore = useAuthStore();
const showLogoutConfirm = ref(false);
const showKeyboardShortcuts = ref(false);
const showThemeCustomizer = ref(false);
const { t, locale } = useI18n();
const colorMode = useColorMode();

// Available locales with flags
const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

// Current locale
const currentLocale = computed(() => locale.value);

// Theme options
const themeOptions = [
  { value: 'light' as const, name: 'Light', icon: Sun },
  { value: 'dark' as const, name: 'Dark', icon: Moon },
  { value: 'auto' as const, name: 'System', icon: Laptop },
];

// Current theme
const currentTheme = computed(() => colorMode.value);

// Change theme
function changeTheme(theme: 'light' | 'dark' | 'auto') {
  colorMode.value = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  toast.success(`Theme changed to ${themeOptions.find(t => t.value === theme)?.name}`);
}

// Change locale
function changeLocale(code: string) {
  locale.value = code;
  localStorage.setItem('locale', code);
  toast.success(`Language changed to ${locales.find(l => l.code === code)?.name}`);
}

// Show logout confirmation
function showLogoutConfirmation() {
  showLogoutConfirm.value = true;
}

// Logout function
async function logout() {
  try {
    showLogoutConfirm.value = false;
    
    // Log user out first
    await authStore.logout();
    
    // Show success message only after logout completes
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Error logging out. Please try again.");
  }
}

// Keyboard shortcut handler
function handleKeyDown(e: KeyboardEvent) {
  // Check if Shift+Cmd/Ctrl+Q is pressed
  if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'q') {
    e.preventDefault();
    showLogoutConfirmation();
  }
}

// Register and unregister keyboard event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div>
    <!-- User Profile Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" class="w-full h-12 justify-between py-2 px-2 rounded-md bg-transparent border-0">
          <div class="flex items-center gap-2">
            <Avatar class="h-7 w-7">
              <AvatarImage :src="authStore.user?.avatar || '/avatar.png'" />
              <AvatarFallback>{{ authStore.user?.fullname?.charAt(0) ?? 'U' }}</AvatarFallback>
            </Avatar>
            <div class="flex flex-col items-start justify-center">
              <span class="font-medium leading-none text-sm">{{ authStore.user?.fullname ?? 'User' }}</span>
              <span class="text-xs leading-none text-muted-foreground mt-0.5">{{ authStore.user?.email }}</span>
            </div>
          </div>
          <ChevronsUpDown class="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuLabel class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium leading-none">{{ authStore.user?.fullname }}</p>
            <p class="text-xs leading-none text-muted-foreground">{{ authStore.user?.email }}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem @click="router.push('/profile')" class="flex items-center justify-between py-1.5">
            <div class="flex items-center">
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
            </div>
            <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem @click="router.push('/setting')" class="flex items-center justify-between py-1.5">
            <div class="flex items-center">
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
            </div>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <!-- Theme Customizer -->
        <DropdownMenuItem @click="showThemeCustomizer = true" class="flex items-center gap-2 py-1.5">
          <component :is="themeOptions.find(t => t.value === currentTheme)?.icon" class="h-4 w-4" />
          <span>Customize Theme</span>
        </DropdownMenuItem>
        
        <!-- Language Switcher -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger class="py-1.5">
            <Languages class="mr-2 h-4 w-4" />
            <span>Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent class="min-w-32">
              <DropdownMenuItem
                v-for="locale in locales"
                :key="locale.code"
                @click="changeLocale(locale.code)"
                :class="{ 'bg-accent': currentLocale === locale.code }"
                class="py-1.5"
              >
                <span class="mr-2">{{ locale.flag }}</span>
                <span>{{ locale.name }}</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem @click="showLogoutConfirmation()" class="flex items-center justify-between py-1.5 text-destructive focus:text-destructive">
          <div class="flex items-center">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Log out</span>
          </div>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <!-- Logout Confirmation Dialog -->
  <Dialog v-model:open="showLogoutConfirm">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogDescription>
          Are you sure you want to log out of your account?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="showLogoutConfirm = false">Cancel</Button>
        <Button variant="destructive" @click="logout">Log Out</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  <!-- Keyboard Shortcuts Dialog -->
  <KeyboardShortcutsDialog v-model:open="showKeyboardShortcuts" />
  
  <!-- Theme Customizer Dialog -->
  <ThemeCustomizer v-model:open="showThemeCustomizer" />
</template>
