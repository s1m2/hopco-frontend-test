import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ListConfigurationView from '@/views/ListConfigurationView.vue'
import { useListStore } from '@/stores/list'

// Mock the components
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


const mockToast = {
  add: vi.fn()
}

vi.mock('primevue/usetoast', () => ({
  useToast: () => mockToast
}))

describe('ListConfigurationView.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    })

    store = useListStore(pinia)

    store.fetchInventoryList = vi.fn()
    store.addInventoryListItem = vi.fn()
    store.updateInventoryListItem = vi.fn()
    store.deleteInventoryListItem = vi.fn()

    store.inventoryList = [
      { id: 1, display_value: 'Property 1' },
      { id: 2, display_value: 'Property 2' }
    ]

    wrapper = mount(ListConfigurationView, {
      global: {
        plugins: [pinia],
        stubs: {
          AppTable: true,
          DashboardLayout: false,
          Toolbar: true,
          Button: true,
          Dialog:true,
          InputText: true
        }
      }
    })
  })

  it('should mount properly and fetch inventory list on mount', async () => {
    expect(wrapper.exists()).toBe(true)
    expect(store.fetchInventoryList).toHaveBeenCalledTimes(1)
  })

  it('should render the header correctly', () => {
    expect(wrapper.find('h1').text()).toBe('List Configuration')
  })

  it('should display the AppTable', () => {
    expect(wrapper.findComponent('app-table-stub').exists()).toBe(true)
  })
})