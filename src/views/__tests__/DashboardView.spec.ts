import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DashboardView from '@/views/DashboardView.vue'
import { createTestingPinia } from '@pinia/testing'
import { useListStore } from '@/stores/list'
import { useItemsStore } from '@/stores/items'

vi.mock('@/components/common/table/AppTable.vue', () => ({
  default: {
    name: 'AppTable',
    template: '<div data-test-id="app-table"></div>',
    props: ['headers', 'filter_values', 'products']
  }
}))

vi.mock('@/layout/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div data-test-id="dashboard-layout"><slot /></div>'
  }
}))

describe('DashboardView', () => {
  const mockInventoryList = [
    { field: 'name', header: 'Name' },
    { field: 'quantity', header: 'Quantity' }
  ]

  const mockFilters = {
    name: null,
    category: null
  }

  const mockItems = [
    { id: 1, name: 'Item 1', quantity: 10 },
    { id: 2, name: 'Item 2', quantity: 20 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders properly with correct layout', async () => {
    const wrapper = mount(DashboardView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              list: {
                inventoryList: mockInventoryList,
                filters: mockFilters
              },
              items: {
                items: mockItems
              }
            }
          })
        ],
        stubs: {
          AppTable: true,
          DashboardLayout: false
        }
      }
    })

    await flushPromises();
    expect(wrapper.text()).toContain('Welcome back to your dashboard')
    expect(wrapper.findComponent('app-table-stub').exists()).toBe(true)
  })

  it('fetches inventory list and items on mount', async () => {
    mount(DashboardView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false
          })
        ],
        stubs: {
          AppTable: true,
          DashboardLayout: false
        }
      }
    })

    await flushPromises();

    const listStore = useListStore();
    const itemsStore = useItemsStore();

    expect(listStore.fetchInventoryList).toHaveBeenCalledTimes(1);
    expect(itemsStore.getAllInventoryItems).toHaveBeenCalledTimes(1);
  });
});