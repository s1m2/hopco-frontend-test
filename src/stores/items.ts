import { ref } from 'vue';
import { defineStore } from 'pinia';
import { InventoryItemService } from '@/services/InventoryItemsService';

export const useItemsStore = defineStore('item', () => {
  const items = ref([]);
  const inventoryItemService = new InventoryItemService();

  function getAllInventoryItems() {
    items.value = inventoryItemService.getAllItems();
  }

  function addInventoryItem(item) {
    items.value = inventoryItemService.addItem(items.value, item);
  }

  function updateInventoryListItem(data) {
    items.value = inventoryItemService.updateItem(items.value, data);
  }

  function deleteInventoryListItem(item) {
    items.value = inventoryItemService.deleteItem(items.value, item);
  }

  return { items, getAllInventoryItems, addInventoryItem, updateInventoryListItem, deleteInventoryListItem };

});
