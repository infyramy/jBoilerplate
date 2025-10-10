import { ref } from 'vue';
import { useColorMode } from '@vueuse/core';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const colorMode = useColorMode();
  const theme = ref<Theme>(colorMode.value as Theme);

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    colorMode.value = newTheme;
  }

  return {
    theme,
    setTheme,
  };
} 