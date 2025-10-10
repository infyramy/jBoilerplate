<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

export interface PaginationLinkProps {
  class?: string
  isActive?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<PaginationLinkProps>(), {
  class: '',
  isActive: false,
  disabled: false,
})

const classes = computed(() => [
  'h-9 w-9',
  props.isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : '',
  props.class,
])
</script>

<template>
  <Button
    :class="classes"
    :disabled="disabled"
    variant="outline"
    size="icon"
  >
    <slot />
  </Button>
</template> 