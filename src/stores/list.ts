import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { InventoryListService } from '@/services/InventoryListService';
import type { Inventory } from '@/types/inventory';

export const useListStore = defineStore('list', () => {
  const inventoryList = ref<Inventory[] | null>([]);
  const inventoryListService = new InventoryListService();

  const filters = computed(() => inventoryListService.getInventoryNames(inventoryList.value || []));

  function fetchInventoryList() {
    inventoryList.value = inventoryListService.getAllItems();
  }

  function updateInventoryListItem(data: { newData: Inventory, index: number }) {
    const { newData, index } = data;
    inventoryList.value = inventoryListService.updateItem(inventoryList.value || [], { newData, index });
  }

  function addInventoryListItem(data: string) {
    const item = {
      id: inventoryList.value?.length ? inventoryList.value.length + 1 : 1,
      name: data,
      display_value: data.toLowerCase().replace(/\s+/g, '_'),
    }
    inventoryList.value = inventoryListService.addItem(inventoryList.value || [], item);
  }

  function deleteInventoryListItem(item: Inventory) {
    inventoryList.value = inventoryListService.deleteItem(inventoryList.value || [], item);
  }

  return { filters, inventoryList, fetchInventoryList, updateInventoryListItem, addInventoryListItem, deleteInventoryListItem };
})
