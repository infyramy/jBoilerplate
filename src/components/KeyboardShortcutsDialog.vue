<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription>
          Keyboard shortcuts to help you navigate the application more efficiently.
        </DialogDescription>
      </DialogHeader>
      <div class="py-4">
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium mb-3">General</h4>
            <div class="grid gap-2">
              <div class="grid grid-cols-2 items-center gap-4">
                <span class="text-sm">Navigation</span>
                <div class="flex items-center gap-1">
                  <kbd class="kbd">⌘</kbd>
                  <span>+</span>
                  <kbd class="kbd">K</kbd>
                </div>
              </div>
              <div class="grid grid-cols-2 items-center gap-4">
                <span class="text-sm">Toggle Theme</span>
                <div class="flex items-center gap-1">
                  <kbd class="kbd">⌘</kbd>
                  <span>+</span>
                  <kbd class="kbd">T</kbd>
                </div>
              </div>
              <div class="grid grid-cols-2 items-center gap-4">
                <span class="text-sm">Settings</span>
                <div class="flex items-center gap-1">
                  <kbd class="kbd">⌘</kbd>
                  <span>+</span>
                  <kbd class="kbd">S</kbd>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium mb-3">Account</h4>
            <div class="grid gap-2">
              <div class="grid grid-cols-2 items-center gap-4">
                <span class="text-sm">Profile</span>
                <div class="flex items-center gap-1">
                  <kbd class="kbd">⇧</kbd>
                  <span>+</span>
                  <kbd class="kbd">P</kbd>
                </div>
              </div>
              <div class="grid grid-cols-2 items-center gap-4">
                <span class="text-sm">Log out</span>
                <div class="flex items-center gap-1">
                  <kbd class="kbd">⇧</kbd>
                  <span>+</span>
                  <kbd class="kbd">⌘</kbd>
                  <span>+</span>
                  <kbd class="kbd">Q</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button @click="isOpen = false">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  open: boolean
}>();

const emits = defineEmits<{
  (e: 'update:open', value: boolean): void
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emits('update:open', value)
});
</script>

<style scoped>
.kbd {
  @apply px-2 py-1.5 text-xs font-semibold text-foreground bg-muted border border-input rounded-md inline-flex items-center justify-center min-w-[20px];
}
</style> 