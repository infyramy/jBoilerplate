<template>
  <div class="password-strength-meter">
    <div class="strength-bars">
      <div 
        v-for="i in 4" 
        :key="i" 
        :class="[
          'strength-bar',
          { 'active': score >= i * 25 }
        ]"
        :style="{ backgroundColor: getBarColor(i) }"
      ></div>
    </div>
    
    <div class="strength-text" :style="{ color: getTextColor() }">
      {{ strengthText }}
      <span v-if="showCrackTime && crackTime" class="crack-time">
        ({{ crackTime }})
      </span>
    </div>
    
    <div v-if="showFeedback && messages.length > 0" class="feedback">
      <ul>
        <li v-for="(message, index) in messages" :key="index">
          {{ message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { PasswordValidator, PasswordStrength, type PasswordValidationResult } from '@/services/password-validator';

interface Props {
  /**
   * Password to evaluate
   */
  password: string;
  
  /**
   * Whether to show feedback messages
   */
  showFeedback?: boolean;
  
  /**
   * Whether to show estimated crack time
   */
  showCrackTime?: boolean;
  
  /**
   * Policy options for password validation
   */
  policyOptions?: any;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: false,
  showCrackTime: false,
  policyOptions: () => ({})
});

const emit = defineEmits<{
  /**
   * Emitted when password validation result changes
   */
  (e: 'update:validation', result: PasswordValidationResult): void;
}>();

// Validation result
const validationResult = ref<PasswordValidationResult>({
  strength: PasswordStrength.VERY_WEAK,
  score: 0,
  isValid: false,
  messages: [],
  failedChecks: []
});

// Compute score for template
const score = computed(() => validationResult.value.score);

// Get the strength text based on the strength level
const strengthText = computed(() => {
  switch (validationResult.value.strength) {
    case PasswordStrength.VERY_WEAK:
      return 'Very Weak';
    case PasswordStrength.WEAK:
      return 'Weak';
    case PasswordStrength.MEDIUM:
      return 'Medium';
    case PasswordStrength.STRONG:
      return 'Strong';
    case PasswordStrength.VERY_STRONG:
      return 'Very Strong';
    default:
      return 'Very Weak';
  }
});

// Get messages for feedback
const messages = computed(() => validationResult.value.messages);

// Get crack time display
const crackTime = computed(() => validationResult.value.crackTimeDisplay || '');

// Get color for specific bar
const getBarColor = (barIndex: number) => {
  // If this bar should be active
  if (score.value >= barIndex * 25) {
    const strength = validationResult.value.strength;
    
    switch (strength) {
      case PasswordStrength.VERY_WEAK:
        return '#ff4d4d'; // Red
      case PasswordStrength.WEAK:
        return '#ffa64d'; // Orange
      case PasswordStrength.MEDIUM:
        return '#ffee4d'; // Yellow
      case PasswordStrength.STRONG:
        return '#4dff4d'; // Light Green
      case PasswordStrength.VERY_STRONG:
        return '#0bb30b'; // Dark Green
      default:
        return '#e6e6e6'; // Gray (inactive)
    }
  }
  
  // Inactive bar
  return '#e6e6e6';
};

// Get text color based on strength
const getTextColor = () => {
  const strength = validationResult.value.strength;
  
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return '#d32f2f'; // Dark Red
    case PasswordStrength.WEAK:
      return '#f57c00'; // Dark Orange
    case PasswordStrength.MEDIUM:
      return '#fbc02d'; // Dark Yellow
    case PasswordStrength.STRONG:
      return '#388e3c'; // Green
    case PasswordStrength.VERY_STRONG:
      return '#1b5e20'; // Dark Green
    default:
      return '#9e9e9e'; // Gray
  }
};

// Watch password changes to update validation
watch(
  () => props.password,
  (newPassword) => {
    // Validate the password
    validationResult.value = PasswordValidator.validate(newPassword, props.policyOptions);
    
    // Emit the validation result for parent components
    emit('update:validation', validationResult.value);
  },
  { immediate: true }
);
</script>

<style scoped>
.password-strength-meter {
  margin: 0.5rem 0;
}

.strength-bars {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}

.strength-bar {
  height: 4px;
  flex: 1;
  background-color: #e6e6e6;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.strength-text {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.crack-time {
  font-weight: normal;
  opacity: 0.8;
}

.feedback {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #666;
}

.feedback ul {
  margin: 0;
  padding-left: 1.25rem;
}

.feedback li {
  margin: 0.15rem 0;
}
</style> 