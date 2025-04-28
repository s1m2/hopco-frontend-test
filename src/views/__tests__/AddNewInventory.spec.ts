import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import InventoryFormView from '@/views/AddNewInventory.vue';
import { useListStore } from '@/stores/list';
import { useItemsStore } from '@/stores/items';

vi.mock('primevue/inputtext', () => ({
  default: {
    name: 'InputText',
    props: ['modelValue'],
    template: '<input class="p-inputtext" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
  }
}));

vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button class="p-button"><slot /></button>'
  }
}));


vi.mock('@/layout/DashboardLayout.vue', () => ({
  default: {
    name: 'DashboardLayout',
    template: '<div class="dashboard-layout"><slot /></div>'
  }
}));

describe('InventoryFormView', () => {
  let wrapper;
  let listStore;
  let itemsStore;

  const mockInventoryList = [
    { id: 1, name: 'item_name', display_value: 'Item Name' },
    { id: 2, name: 'item_quantity', display_value: 'Quantity' },
    { id: 3, name: 'item_price', display_value: 'Price' }
  ];

  beforeEach(() => {
    wrapper = mount(InventoryFormView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              list: {
                inventoryList: mockInventoryList
              }
            }
          })
        ]
      }
    });

    listStore = useListStore();
    itemsStore = useItemsStore();
  });

  it('calls fetchInventoryList when mounted', () => {
    expect(listStore.fetchInventoryList).toHaveBeenCalledTimes(1);
  });

  it('renders the dashboard layout', () => {
    expect(wrapper.find('.dashboard-layout').exists()).toBe(true);
  });

  it('displays the title correctly', () => {
    expect(wrapper.find('p.text-2xl').text()).toBe('Add new inventory item');
  });

  it('renders input fields for each item in the inventory list', () => {
    const inputLabels = wrapper.findAll('label');
    const inputFields = wrapper.findAll('.p-inputtext');

    expect(inputLabels.length).toBe(mockInventoryList.length);
    expect(inputFields.length).toBe(mockInventoryList.length);

    mockInventoryList.forEach((item, index) => {
      expect(inputLabels[index].text()).toBe(item.display_value);
    });
  });

  it('binds input fields to list ref object', async () => {
    const inputs = wrapper.findAll('.p-inputtext');

    await inputs[0].setValue('Test Item');
    await inputs[1].setValue('10');
    await inputs[2].setValue('99.99');

    await nextTick();

    const vm = wrapper.vm;
    expect(vm.list).toEqual({
      'item_name': 'Test Item',
      'item_quantity': '10',
      'item_price': '99.99'
    });
  });

  it('calls addInventoryItem when Save Item button is clicked', async () => {
    const testData = {
      'item_name': 'Test Item',
      'item_quantity': '10',
      'item_price': '99.99'
    };

    wrapper.vm.list = testData;
    await nextTick();

    await wrapper.find('.p-button').trigger('click');

    expect(itemsStore.addInventoryItem).toHaveBeenCalledTimes(1);
    expect(itemsStore.addInventoryItem).toHaveBeenCalledWith(testData);
  });

  it('renders in responsive grid layout', () => {
    const mainGrid = wrapper.find('main');
    expect(mainGrid.classes()).toContain('grid');
    expect(mainGrid.classes()).toContain('grid-cols-1');
    expect(mainGrid.classes()).toContain('md:grid-cols-3');
  });
});