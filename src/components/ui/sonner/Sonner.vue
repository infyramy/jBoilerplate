<script lang="ts" setup>
import { Toaster as Sonner } from 'vue-sonner'

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-right'
  },
  expand: {
    type: Boolean,
    default: false
  },
  visibleToasts: {
    type: Number,
    default: 3
  },
  closeButton: {
    type: Boolean,
    default: false
  },
  offset: {
    type: [String, Number],
    default: '32px'
  },
  dir: {
    type: String,
    default: 'auto'
  },
  hotkey: {
    type: Array,
    default: () => ['F8']
  },
  theme: {
    type: String,
    default: undefined
  },
  richColors: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 4000
  },
  gap: {
    type: Number,
    default: 14
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
