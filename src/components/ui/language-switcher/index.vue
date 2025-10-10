<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative">
        <Globe class="h-5 w-5" />
        <span class="sr-only">Switch language</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Languages</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        v-for="lang in availableLanguages" 
        :key="lang.code" 
        @click="changeLanguage(lang.code)"
        :class="{ 'bg-accent': currentLanguage === lang.code }"
      >
        <span class="mr-2 text-base">{{ lang.flag }}</span>
        {{ lang.name }}
        <CheckIcon 
          v-if="currentLanguage === lang.code" 
          class="ml-auto h-4 w-4" 
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { Globe, Check as CheckIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Get the i18n instance
const { locale, availableLocales } = useI18n();

// Current language
const currentLanguage = computed(() => locale.value);

interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
}

// Map language codes to flag emojis and proper names
const availableLanguages: ComputedRef<LanguageInfo[]> = computed(() => {
  return availableLocales.value.map((code: string) => {
    const langMap: Record<string, { name: string, flag: string }> = {
      'en': { name: 'English', flag: '🇺🇸' },
      'es': { name: 'Español', flag: '🇪🇸' },
    };

    return {
      code,
      name: langMap[code]?.name || code,
      flag: langMap[code]?.flag || '🌐',
    };
  });
});

// Change the language
const changeLanguage = (langCode: string) => {
  if (availableLocales.value.includes(langCode)) {
    locale.value = langCode;
    // Save preference to localStorage for persistence
    localStorage.setItem('userLanguage', langCode);
  }
};
</script> 