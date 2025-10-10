<script setup lang="ts">
import { defineProps } from 'vue';

interface PageTransitionProps {
  /** The type of transition to use */
  name?: 'fade' | 'slide-x' | 'slide-y' | 'zoom' | 'none';
  /** The mode of the transition */
  mode?: 'in-out' | 'out-in' | 'default';
  /** The duration of the transition in ms */
  duration?: number;
  /** Whether to apply the transition when the component is first mounted */
  appear?: boolean;
}

const props = withDefaults(defineProps<PageTransitionProps>(), {
  name: 'fade',
  mode: 'out-in',
  duration: 300,
  appear: true,
});

// Calculate CSS variable for custom duration
const transitionStyle = {
  '--transition-duration': `${props.duration}ms`,
};
</script>

<template>
  <transition
    :name="name !== 'none' ? name : undefined"
    :mode="mode"
    :appear="appear"
  >
    <slot />
  </transition>
</template>

<style scoped>
/* Base transition styles */
:deep(*) {
  transition-duration: var(--transition-duration, 300ms);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide X transition */
.slide-x-enter-active,
.slide-x-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: ease;
}

.slide-x-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-x-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Slide Y transition */
.slide-y-enter-active,
.slide-y-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: ease;
}

.slide-y-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-y-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Zoom transition */
.zoom-enter-active,
.zoom-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: ease;
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style> 