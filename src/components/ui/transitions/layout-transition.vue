<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

interface LayoutTransitionProps {
  /** Whether to use dynamic transitions based on navigation history */
  useDynamicTransitions?: boolean;
  /** The default transition name */
  defaultName?: 'fade' | 'slide-x' | 'slide-y' | 'zoom' | 'none';
  /** The transition mode */
  mode?: 'in-out' | 'out-in' | 'default';
  /** The transition duration in ms */
  duration?: number;
  /** Whether to apply the transition on first render */
  appear?: boolean;
}

const props = withDefaults(defineProps<LayoutTransitionProps>(), {
  useDynamicTransitions: true,
  defaultName: 'fade',
  mode: 'out-in',
  duration: 300,
  appear: true,
});

const route = useRoute();
const previousPath = ref('');
const currentPath = ref('');
const transitionName = ref(props.defaultName);

// Track navigation history
watch(
  () => route.path,
  (newPath, oldPath) => {
    previousPath.value = oldPath || '';
    currentPath.value = newPath;
    
    if (props.useDynamicTransitions) {
      // Determine if we're going forward or backward in navigation 
      // This is a simple implementation - can be enhanced with route metadata
      if (previousPath.value && currentPath.value) {
        const isGoingDeeper = currentPath.value.split('/').length > previousPath.value.split('/').length;
        transitionName.value = isGoingDeeper ? 'slide-x' : 'slide-y';
      }
    }
  },
  { immediate: true }
);

// Calculate CSS variable for custom duration
const transitionStyle = computed(() => ({
  '--transition-duration': `${props.duration}ms`,
}));

onMounted(() => {
  // Set initial path
  currentPath.value = route.path;
});
</script>

<template>
  <transition
    :name="transitionName !== 'none' ? transitionName : undefined"
    :mode="mode"
    :appear="appear"
    :style="transitionStyle"
  >
    <slot />
  </transition>
</template>

<style>
/* Base transition styles */
* {
  transition-duration: var(--transition-duration, 300ms);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide X transition (horizontal) */
.slide-x-enter-active,
.slide-x-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-x-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-x-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide Y transition (vertical) */
.slide-y-enter-active,
.slide-y-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-y-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-y-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Zoom transition */
.zoom-enter-active,
.zoom-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
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