import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ComponentManager from '@/pages/admin/dev-tools/component-manager/index.vue';

describe('ComponentManager', () => {
  it('renders wizard tabs', () => {
    const wrapper = mount(ComponentManager);
    expect(wrapper.text()).toContain('Component/Module Manager');
    expect(wrapper.text()).toContain('Wizard');
  });
});
