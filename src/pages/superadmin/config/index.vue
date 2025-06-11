<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import ConfigSection from '@/components/superadmin/config/ConfigSection.vue';
import ConfigForm from '@/components/superadmin/config/ConfigForm.vue';
import ConfigHistory from '@/components/superadmin/config/ConfigHistory.vue';
import { LayoutDashboard } from 'lucide-vue-next';

/**
 * SuperAdmin Config Demo Page
 * Shows editing and history for the 'app' config section
 */
const configStore = useConfigStore();
const sectionKey = 'app';
const sectionTitle = 'Application Settings';
const sectionDescription = 'Core application settings such as name, description, version, and maintenance mode.';

const appConfig = computed(() => configStore.config[sectionKey]);
const isLoading = computed(() => configStore.isLoading);
const error = computed(() => configStore.error);
const history = computed(() => configStore.configHistory);
const currentVersion = computed(() => history.value.length - 1);

function handleUpdate(value: any) {
  // No-op: handled on submit
}

async function handleSubmit() {
  await configStore.updateConfig('app', appConfig.value);
}

function handleRollback(idx: number) {
  configStore.rollbackConfig(idx);
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8">
    <ConfigSection
      :title="sectionTitle"
      :description="sectionDescription"
      :icon="LayoutDashboard"
    >
      <ConfigForm
        section="app"
        :model-value="appConfig"
        :loading="isLoading"
        @update:modelValue="handleUpdate"
        @submit="handleSubmit"
      />
      <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    </ConfigSection>
    <ConfigHistory
      :history="history"
      :current-version="currentVersion"
      @rollback="handleRollback"
    />
  </div>
</template> 