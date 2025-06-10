<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { computed } from "vue";

interface BreadcrumbItem {
  count: number;
  label: string;
  action: boolean;
  href: string;
}

const props = defineProps<{
  breadcrumb: BreadcrumbItem[];
}>();

// Get the last breadcrumb item for mobile view
const lastBreadcrumbItem = computed(() => {
  return props.breadcrumb[props.breadcrumb.length - 1];
});
</script>
<template>
  <!-- Header -->
  <header
    class="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <!-- Mobile view: Show only last breadcrumb item -->
        <BreadcrumbList class="flex md:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink
              v-if="lastBreadcrumbItem?.action"
              :href="lastBreadcrumbItem.href"
            >
              {{ lastBreadcrumbItem?.label }}
            </BreadcrumbLink>
            <BreadcrumbLink v-else>
              {{ lastBreadcrumbItem?.label }}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>

        <!-- Desktop view: Show all breadcrumb items -->
        <BreadcrumbList class="hidden md:flex">
          <template
            v-for="(item, index) in props.breadcrumb"
            :key="item.label"
          >
            <BreadcrumbItem>
              <BreadcrumbLink v-if="item.action" :href="item.href">
                {{ item.label }}
              </BreadcrumbLink>
              <BreadcrumbLink v-else>
                {{ item.label }}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < props.breadcrumb.length - 1" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
</template>
