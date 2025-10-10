<template>
  <div class="responsive-image" :class="[aspectRatio, { 'rounded': rounded }]">
    <img
      ref="imageRef"
      :src="src"
      :srcset="computedSrcset"
      :sizes="computedSizes"
      :alt="alt"
      :loading="loading"
      :width="width || undefined"
      :height="height || undefined"
      :class="imageClass"
      class="responsive-image__img"
      @load="onImageLoaded"
      @error="onImageError"
    />
    <div v-if="!imageLoaded && showPlaceholder" class="responsive-image__placeholder">
      <slot name="placeholder">
        <div class="responsive-image__skeleton"></div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useIntersectionObserver } from '../../../composables/useIntersectionObserver';

interface ImageSource {
  src: string;
  width: number;
}

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcset?: string | ImageSource[];
  sizes?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | '21:9' | 'auto';
  loading?: 'eager' | 'lazy';
  imageClass?: string;
  rounded?: boolean;
  showPlaceholder?: boolean;
}

const props = defineProps<Props>();

const defaultProps = {
  width: undefined as number | undefined,
  height: undefined as number | undefined,
  srcset: undefined as string | ImageSource[] | undefined,
  sizes: undefined as string | undefined,
  aspectRatio: 'auto' as const,
  loading: 'lazy' as const,
  imageClass: '',
  rounded: false,
  showPlaceholder: true
};

// Apply default props
const width = computed(() => props.width ?? defaultProps.width);
const height = computed(() => props.height ?? defaultProps.height);
const aspectRatio = computed(() => props.aspectRatio ?? defaultProps.aspectRatio);
const loading = computed(() => props.loading ?? defaultProps.loading);
const imageClass = computed(() => props.imageClass ?? defaultProps.imageClass);
const rounded = computed(() => props.rounded ?? defaultProps.rounded);
const showPlaceholder = computed(() => props.showPlaceholder ?? defaultProps.showPlaceholder);

const imageRef = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);
const imageError = ref(false);

// Compute srcset string from array of sources or use provided srcset string
const computedSrcset = computed(() => {
  if (!props.srcset) return undefined;
  
  if (typeof props.srcset === 'string') {
    return props.srcset;
  }
  
  return props.srcset
    .map((source: ImageSource) => `${source.src} ${source.width}w`)
    .join(', ');
});

// Compute sizes attribute if not provided
const computedSizes = computed(() => {
  if (props.sizes) return props.sizes;
  
  // Default responsive sizes
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
});

// Handle image load event
const onImageLoaded = () => {
  imageLoaded.value = true;
};

// Handle image error
const onImageError = () => {
  imageError.value = true;
  // Could add fallback image here
};

// Use intersection observer for advanced lazy loading
onMounted(() => {
  if (loading.value === 'lazy' && imageRef.value) {
    const { stop } = useIntersectionObserver(
      imageRef,
      (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          // Force load image when it comes into view
          if (imageRef.value) {
            imageRef.value.loading = 'eager';
          }
          // Disconnect observer after load
          stop();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before image enters viewport
    );
  }
});
</script>

<style>
.responsive-image {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.responsive-image.square {
  aspect-ratio: 1 / 1;
}

.responsive-image.\31 6\:9 {
  aspect-ratio: 16 / 9;
}

.responsive-image.\34 \:3 {
  aspect-ratio: 4 / 3;
}

.responsive-image.\32 1\:9 {
  aspect-ratio: 21 / 9;
}

.responsive-image.rounded {
  border-radius: 0.5rem;
}

.responsive-image__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.responsive-image__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  z-index: -1;
}

.responsive-image__skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style> 