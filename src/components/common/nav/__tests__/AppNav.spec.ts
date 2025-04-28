import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import AppNav from '@/components/common/nav/AppNav.vue';
import { useAuthStore } from '@/stores/auth';

function mountComponent() {
  return mount(AppNav, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  });
}

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}));

describe('AppNav', () => {
  it('renders correctly', () => {
    const logout = vi.fn();
    (useAuthStore as unknown as vi.Mock).mockReturnValue({ logout });

    const wrapper = mountComponent();

    expect(wrapper.find('h1').text()).toBe('Hospital Name');
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('calls logout when button is clicked', async () => {
    const logout = vi.fn();
    (useAuthStore as unknown as vi.Mock).mockReturnValue({ logout });

    const wrapper = mountComponent();

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
