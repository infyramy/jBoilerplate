import { defineStore } from "pinia";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Component } from "vue";
import {
  LayoutDashboard,
  Users,
  Settings,
  Cog,
  ServerCog,
  Shield,
  KeyRound,
  Database,
  Mail,
  BookOpen,
  FileText,
  LucideIcon,
  Code,
  Info,
} from "lucide-vue-next";

interface NavigationItem {
  title: string;
  url: string;
  icon: Component;
  isActive: boolean;
  items?: NavigationItem[];
}

interface NavigationGroup {
  title: string;
  menu: NavigationItem[];
}

export const useNavigationStore = defineStore("navigation", () => {
  const authStore = useAuthStore();

  const superadminNavigation: NavigationGroup[] = [
    {
      title: "Main",
      menu: [
        {
          title: "Home",
          url: "/superadmin/home",
          icon: LayoutDashboard,
          isActive: true,
        }
      ],
    },
    {
      title: "Development",
      menu: [
        {
          title: "Documentation",
          url: "/superadmin/documentation",
          icon: BookOpen,
          isActive: false,
        },
        {
          title: "About",
          url: "/about",
          icon: Info,
          isActive: false,
        }
      ],
    }
  ];

  const adminNavigation: NavigationGroup[] = [
    {
      title: "Main",
      menu: [
        {
          title: "Home",
          url: "/admin/home",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "About",
          url: "/about",
          icon: Info,
          isActive: false,
        }
      ],
    },
  ];

  const managerNavigation: NavigationGroup[] = [
    {
      title: "Main",
      menu: [
        {
          title: "Dashboard",
          url: "/manager/home",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "About",
          url: "/about",
          icon: Info,
          isActive: false,
        }
      ],
    },
  ];

  const userNavigation: NavigationGroup[] = [
    {
      title: "Main",
      menu: [
        {
          title: "Home",
          url: "/user/home",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          title: "About",
          url: "/about",
          icon: Info,
          isActive: false,
        }
      ],
    },
  ];

  const navigation = computed(() => {
    const userType = authStore.user?.user_type;

    switch (userType) {
      case "superadmin":
        return superadminNavigation;
      case "admin":
        return adminNavigation;
      case "manager":
        return managerNavigation;
      case "user":
        return userNavigation;
      default:
        return [];
    }
  });

  return {
    navigation,
  };
});
