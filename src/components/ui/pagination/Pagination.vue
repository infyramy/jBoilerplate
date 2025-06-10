<script setup lang="ts">
import { computed } from 'vue'

export interface PaginationProps {
  class?: string
}

const props = withDefaults(defineProps<PaginationProps>(), {
  class: '',
})

const classes = computed(() => [
  'flex flex-row items-center w-full',
  props.class,
])
</script>

<template>
  <nav :class="classes" role="navigation" aria-label="pagination">
    <slot />
  </nav>
</template> 