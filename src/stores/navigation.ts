import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Component } from "vue";
import * as LucideIcons from "lucide-vue-next";

/**
 * Navigation item interface
 */
interface NavigationItem {
  title: string;
  url: string;
  icon: Component;
  isActive: boolean;
  items?: NavigationItem[];
}

/**
 * Navigation group interface
 */
interface NavigationGroup {
  title: string;
  menu: NavigationItem[];
}

/**
 * Navigation store
 * Manages the application navigation menu structure
 */
export const useNavigationStore = defineStore("navigation", () => {
  const authStore = useAuthStore();

  /**
   * Menu structures loaded from menu_structures table
   */
  const menuStructures = ref<{ admin: any[], user: any[] }>({ admin: [], user: [] });

  /**
   * Helper to get icon component from icon name
   */
  function getIcon(iconName: string): Component {
    const icon = (LucideIcons as any)[iconName];
    return icon || LucideIcons.Circle;
  }

  /**
   * Load menu structures from API
   */
  async function load() {
    try {
      const roles = ['admin', 'user'];
      for (const role of roles) {
        const res = await fetch(`/api/menu-structure?role=${role}`);
        const data = await res.json();
        if (data.success && data.structure && Array.isArray(data.structure)) {
          menuStructures.value[role as 'admin' | 'user'] = data.structure;
        }
      }
    } catch (error) {
      console.error('Failed to load menu structures:', error);
    }
  }

  /**
   * Admin navigation menu structure
   */
  const adminNavigation: NavigationGroup[] = [
    {
      title: "Main",
      menu: [
        {
          title: "Home",
          url: "/admin/home",
          icon: getIcon('LayoutDashboard'),
          isActive: true,
        }
      ],
    },
    {
      title: "System",
      menu: [
        {
          title: "Configuration",
          url: "/configuration",
          icon: getIcon('Settings'),
          isActive: false,
        },
        {
          title: "Page Editor",
          url: "/admin/page-editor",
          icon: getIcon('BookOpen'),
          isActive: false,
        },
        {
          title: "Menu Editor",
          url: "/admin/menu-editor",
          icon: getIcon('Wrench'),
          isActive: false,
        },
        {
          title: "System Status",
          url: "/admin/system-status",
          icon: getIcon('Activity'),
          isActive: false,
        }
      ],
    },
  ];

  /**
   * User navigation menu structure
   */
  const userNavigation: NavigationGroup[] = [
    {
      title: "Main",
      menu: [
        {
          title: "Home",
          url: "/user/home",
          icon: getIcon('LayoutDashboard'),
          isActive: true,
        }
      ],
    },
  ];

  /**
   * Get the navigation menu for the current user
   */
  const navigation = computed(() => {
    const userType = authStore.user?.user_type;

    if (!userType) return [];

    const structure = menuStructures.value[userType as 'admin' | 'user'];

    // If menu structure is loaded from database, use it
    if (structure && structure.length > 0) {
      return structure.map((category: any) => ({
        title: category.label,
        menu: (category.items || []).map((item: any) => ({
          title: item.label,
          url: item.path,
          icon: getIcon(item.icon),
          isActive: false
        }))
      }));
    }

    // Fallback to static navigation if nothing is loaded
    switch (userType) {
      case "admin":
        return adminNavigation;
      case "user":
        return userNavigation;
      default:
        return [];
    }
  });

  return {
    navigation,
    load,
  };
});
