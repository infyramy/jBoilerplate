<script setup lang="ts">
import { computed } from 'vue'

export interface PaginationItemProps {
  class?: string
}

const props = withDefaults(defineProps<PaginationItemProps>(), {
  class: '',
})

const classes = computed(() => [
  props.class,
])
</script>

<template>
  <li :class="classes">
    <slot />
  </li>
</template> 