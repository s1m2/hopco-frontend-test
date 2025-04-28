import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Sidebar from '@/components/common/sidenav/AppSideNav.vue';
import { RouterLinkStub } from '@vue/test-utils';

describe('AppSideNav.vue', () => {
  it('renders navigation links correctly', () => {
    const wrapper = mount(Sidebar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub, 
        },
      },
    });

    const links = wrapper.findAllComponents(RouterLinkStub);

    expect(links).toHaveLength(3);

    expect(links[0].props('to')).toBe('/dashboard');
    expect(links[0].text()).toBe('Dashboard');

    expect(links[1].props('to')).toBe('/configure');
    expect(links[1].text()).toBe('Inventory List Configuration');

    expect(links[2].props('to')).toBe('/add-new-inventory');
    expect(links[2].text()).toBe('Add Inventory Item');
  });
});