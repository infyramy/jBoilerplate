<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Home, Settings, Users, FileText, Folder, Star, Heart, Bell,
  Calendar, Mail, Phone, Camera, Image, Music, Video, Download,
  Upload, Search, Filter, Edit, Trash2, Plus, Minus, Check, X,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Menu, Grid,
  List, Layout, Zap, Archive, Bookmark, Tag, Flag, Lock, Unlock,
  Eye, EyeOff, Sun, Moon, Cloud, CloudRain, Database, Server,
  Code, Terminal, Package, Cpu, HardDrive, Wifi, Bluetooth, Battery,
  ShoppingCart, CreditCard, DollarSign, TrendingUp, BarChart, PieChart,
  Activity, Award, Target, Gift, Coffee, Book, Briefcase, MapPin
} from 'lucide-vue-next';

const props = defineProps<{
  modelValue: string
}>();

const emit = defineEmits(['update:modelValue']);

const search = ref('');

const icons = [
  { name: 'Home', component: Home },
  { name: 'Settings', component: Settings },
  { name: 'Users', component: Users },
  { name: 'FileText', component: FileText },
  { name: 'Folder', component: Folder },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Bell', component: Bell },
  { name: 'Calendar', component: Calendar },
  { name: 'Mail', component: Mail },
  { name: 'Phone', component: Phone },
  { name: 'Camera', component: Camera },
  { name: 'Image', component: Image },
  { name: 'Music', component: Music },
  { name: 'Video', component: Video },
  { name: 'Download', component: Download },
  { name: 'Upload', component: Upload },
  { name: 'Search', component: Search },
  { name: 'Filter', component: Filter },
  { name: 'Edit', component: Edit },
  { name: 'Trash2', component: Trash2 },
  { name: 'Plus', component: Plus },
  { name: 'Minus', component: Minus },
  { name: 'Check', component: Check },
  { name: 'X', component: X },
  { name: 'ChevronRight', component: ChevronRight },
  { name: 'ChevronLeft', component: ChevronLeft },
  { name: 'ChevronUp', component: ChevronUp },
  { name: 'ChevronDown', component: ChevronDown },
  { name: 'Menu', component: Menu },
  { name: 'Grid', component: Grid },
  { name: 'List', component: List },
  { name: 'Layout', component: Layout },
  { name: 'Zap', component: Zap },
  { name: 'Archive', component: Archive },
  { name: 'Bookmark', component: Bookmark },
  { name: 'Tag', component: Tag },
  { name: 'Flag', component: Flag },
  { name: 'Lock', component: Lock },
  { name: 'Unlock', component: Unlock },
  { name: 'Eye', component: Eye },
  { name: 'EyeOff', component: EyeOff },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
  { name: 'Cloud', component: Cloud },
  { name: 'CloudRain', component: CloudRain },
  { name: 'Database', component: Database },
  { name: 'Server', component: Server },
  { name: 'Code', component: Code },
  { name: 'Terminal', component: Terminal },
  { name: 'Package', component: Package },
  { name: 'Cpu', component: Cpu },
  { name: 'HardDrive', component: HardDrive },
  { name: 'Wifi', component: Wifi },
  { name: 'Bluetooth', component: Bluetooth },
  { name: 'Battery', component: Battery },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'CreditCard', component: CreditCard },
  { name: 'DollarSign', component: DollarSign },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'BarChart', component: BarChart },
  { name: 'PieChart', component: PieChart },
  { name: 'Activity', component: Activity },
  { name: 'Award', component: Award },
  { name: 'Target', component: Target },
  { name: 'Gift', component: Gift },
  { name: 'Coffee', component: Coffee },
  { name: 'Book', component: Book },
  { name: 'Briefcase', component: Briefcase },
  { name: 'MapPin', component: MapPin }
];

const filteredIcons = computed(() => {
  if (!search.value) return icons;
  return icons.filter(icon =>
    icon.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const selectedIcon = computed(() => {
  return icons.find(i => i.name === props.modelValue);
});

const selectIcon = (iconName: string) => {
  emit('update:modelValue', iconName);
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" class="w-full justify-start">
        <component
          v-if="selectedIcon"
          :is="selectedIcon.component"
          class="h-4 w-4 mr-2"
        />
        <span>{{ modelValue || 'Select icon...' }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="space-y-3">
        <Input
          v-model="search"
          placeholder="Search icons..."
          class="h-9"
        />

        <div class="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
          <Button
            v-for="icon in filteredIcons"
            :key="icon.name"
            variant="outline"
            size="sm"
            class="h-10 w-10 p-0"
            :class="{ 'bg-accent': modelValue === icon.name }"
            @click="selectIcon(icon.name)"
            :title="icon.name"
          >
            <component :is="icon.component" class="h-5 w-5" />
          </Button>
        </div>

        <p v-if="filteredIcons.length === 0" class="text-center text-sm text-muted-foreground py-4">
          No icons found
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>
