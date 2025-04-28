import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AppTable from '@/components/common/table/AppTable.vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

const headers = [
  { id: 1, name: 'name', display_value: 'Name' },
  { id: 2, name: 'price', display_value: 'Price' },
];

const products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
];

const filter_values = ['name', 'price'];

function mountComponent() {
  return mount(AppTable, {
    props: {
      headers,
      products,
      filter_values,
    },
    global: {
      plugins: [PrimeVue],
      components: { Button, DataTable, Column, InputText },
    },
  });
}

describe('EditableTable.vue', () => {
  it('renders table with products', () => {
    const wrapper = mountComponent();
    const bodyRows = wrapper.find('tbody').findAll('tr');
    expect(bodyRows.length).toBe(products.length);
  });

  it('emits delete-row event when delete button is clicked', async () => {
    const wrapper = mountComponent();
    const deleteButtons = wrapper.findAllComponents(Button).filter(btn => btn.text() === 'X');
    await deleteButtons[0].trigger('click');

    expect(wrapper.emitted('delete-row')).toBeTruthy();
    expect(wrapper.emitted('delete-row')![0][0]).toEqual(products[0]);
  });

  it('emits row-edit-save event when row is edited and saved', async () => {
    const wrapper = mountComponent();
    const rowEditSaveEvent = { newData: { id: 1, name: 'Updated Name', price: 123 }, index: 0 };
    await wrapper.vm.onRowEditSave(rowEditSaveEvent);
    expect(wrapper.emitted('row-edit-save')).toBeTruthy();
    expect(wrapper.emitted('row-edit-save')![0][0]).toEqual(rowEditSaveEvent);
  });

  it('does not break when no headers are provided', async () => {
    const wrapper = mountComponent();
    const bodyRows = wrapper.find('tbody').findAll('tr');
    expect(bodyRows.length).toBe(products.length);
  });

});
