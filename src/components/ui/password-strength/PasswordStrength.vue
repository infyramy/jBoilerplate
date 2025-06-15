<template>
  <div class="space-y-1">
    <div class="flex items-center space-x-1">
      <div 
        v-for="(_, i) in Array(4)" 
        :key="i" 
        class="h-1.5 flex-1 rounded-full transition-colors duration-200"
        :class="[
          i < strength ? strengthColors[strength as StrengthLevel] : 'bg-muted'
        ]"
      ></div>
    </div>
    <p class="text-xs text-muted-foreground">
      {{ strengthMessages[strength as StrengthLevel] }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

const props = defineProps<{
  password: string;
}>();

// Calculate password strength based on criteria
const strength = computed((): StrengthLevel => {
  const { password } = props;
  
  // Return 0 for empty or very short passwords
  if (!password || password.length < 1) return 0;
  
  let score = 0;
  
  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character types
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  // Return final score capped at 4
  return Math.min(Math.floor(score / 2), 4) as StrengthLevel;
});

// Color for each strength level
const strengthColors: Record<StrengthLevel, string> = {
  0: 'bg-destructive/50',
  1: 'bg-destructive',
  2: 'bg-amber-500',
  3: 'bg-amber-500',
  4: 'bg-success'
};

// Message for each strength level
const strengthMessages: Record<StrengthLevel, string> = {
  0: 'Very weak password',
  1: 'Weak password',
  2: 'Moderate password',
  3: 'Strong password',
  4: 'Very strong password'
};
</script>

<script lang="ts">
export default {
  name: 'PasswordStrength'
};
</script> 