<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

const props = defineProps<{
  breadcrumb: BreadcrumbItem[];
}>();
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in props.breadcrumb" :key="item.label">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="item.href && !item.current" :href="item.href">
            {{ item.label }}
          </BreadcrumbLink>
          <BreadcrumbPage v-else>
            {{ item.label }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < props.breadcrumb.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template> 