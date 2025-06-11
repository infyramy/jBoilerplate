<script setup lang="ts">
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-vue-next';
import type { ConfigSection } from '@/types/config';

/**
 * Props for ConfigForm
 */
interface Props {
  /** Config section key */
  section: ConfigSection;
  /** Model value for the section */
  modelValue: Record<string, any>;
  /** Loading state */
  loading?: boolean;
}

const props = defineProps<Props>();

/**
 * Emits for ConfigForm
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'submit'): void;
}>();

const localValue = ref({ ...props.modelValue });

watch(() => props.modelValue, (val) => {
  localValue.value = { ...val };
});

function handleInput(key: string, value: any) {
  localValue.value[key] = value;
  emit('update:modelValue', { ...localValue.value });
}

function handleSubmit() {
  emit('submit');
}
</script>

<template>
  <form @submit.prevent="handleSubmit" aria-labelledby="config-form-title">
    <div class="grid gap-4">
      <div v-for="key in Object.keys(localValue)" :key="key" class="space-y-1">
        <Label :for="key">{{ key }}</Label>
        <Input
          :id="key"
          v-model="localValue[key]"
          :disabled="loading"
          :aria-disabled="loading ? 'true' : 'false'"
          @input="handleInput(key, localValue[key])"
        />
      </div>
    </div>
    <div class="mt-6 flex justify-end">
      <Button type="submit" :disabled="loading" aria-busy="loading">
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        Save Changes
      </Button>
    </div>
  </form>
</template> 