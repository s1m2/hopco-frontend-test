import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import DashboardLayout from '@/layout/DashboardLayout.vue'; 
import AppNav from '@/components/common/nav/AppNav.vue';
import AppSideNav from '@/components/common/sidenav/AppSideNav.vue';
import { RouterLinkStub } from '@vue/test-utils';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

const pinia = createPinia(); 

function mountComponent() {
  return mount(DashboardLayout, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub, 
      },
      plugins: [pinia],
    },
  });
}

describe('DashboardLayout.vue', () => {
  it('renders AppNav and AppSideNav components', () => {
    const wrapper = mountComponent();

    // Test that AppNav is rendered
    expect(wrapper.findComponent(AppNav).exists()).toBe(true);

    // Test that AppSideNav is rendered
    expect(wrapper.findComponent(AppSideNav).exists()).toBe(true);
  });

  it('renders slot content inside main container', () => {
    const wrapper = mount(DashboardLayout, {
      slots: {
        default: '<div class="test-slot">Slot Content</div>', 
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub, 
        },
        plugins: [pinia],
      },
    });

    const slotContent = wrapper.find('.test-slot');
    expect(slotContent.exists()).toBe(true);
    expect(slotContent.text()).toBe('Slot Content');
  });

  it('has the correct structure and classes applied', () => {
    const wrapper = mountComponent();

    const mainElement = wrapper.find('main');
    expect(mainElement.exists()).toBe(true);

    const sideNav = wrapper.find('.md\\:flex');
    expect(sideNav.exists()).toBe(true);
    expect(sideNav.classes()).toContain('md:flex');

    const containerDiv = wrapper.find('.bg-white');
    expect(containerDiv.exists()).toBe(true);
    expect(containerDiv.classes()).toContain('bg-white');
  });
});
