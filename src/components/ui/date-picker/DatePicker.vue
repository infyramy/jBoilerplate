<script setup lang="ts">
import { ref, watch } from "vue";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-vue-next";
import { format, parseISO } from "date-fns";

const props = defineProps<{
  modelValue?: Date | string;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", date: string): void;
}>();

const date = ref<Date | undefined>(
  props.modelValue ? (typeof props.modelValue === 'string' ? parseISO(props.modelValue) : props.modelValue) : undefined
);
const isOpen = ref(false);

// Watch for changes in modelValue
watch(() => props.modelValue, (newValue) => {
  date.value = newValue ? (typeof newValue === 'string' ? parseISO(newValue) : newValue) : undefined;
});

function onSelect(newDate: Date | undefined) {
  date.value = newDate;
  // Emit the date in ISO string format
  emit("update:modelValue", newDate ? newDate.toISOString() : "");
  isOpen.value = false;
}
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            props.class
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ date ? format(date, "PPP") : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        mode="single"
        :selected="date"
        @select="onSelect"
        :initial-focus="true"
      />
    </PopoverContent>
  </Popover>
</template>
