import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useListStore } from '@/stores/list';
import { InventoryListService } from '@/services/InventoryListService';
import type { Inventory } from '@/types/inventory';

const mockInventory: Inventory[] = [
  { id: 1, name: 'Item 1', display_value: 'item_1' },
  { id: 2, name: 'Item 2', display_value: 'item_2' },
];

const mockGetAllItems = vi.fn().mockReturnValue([...mockInventory]);
const mockGetInventoryNames = vi.fn((items: Inventory[]) => items.map(item => item.name));
const mockUpdateItem = vi.fn((items: Inventory[], { newData, index }: { newData: Inventory, index: number }) => {
  const updated = [...items];
  updated[index] = newData;
  return updated;
});
const mockAddItem = vi.fn((items: Inventory[], newItem: Inventory) => [...items, newItem]);
const mockDeleteItem = vi.fn((items: Inventory[], itemToDelete: Inventory) =>
  items.filter(item => item.id !== itemToDelete.id)
);

vi.mock('@/services/InventoryListService', () => {
  return {
    InventoryListService: vi.fn(() => ({
      getAllItems: mockGetAllItems,
      getInventoryNames: mockGetInventoryNames,
      updateItem: mockUpdateItem,
      addItem: mockAddItem,
      deleteItem: mockDeleteItem,
    })),
  };
});

describe('useListStore', () => {
  let store: ReturnType<typeof useListStore>;
  let inventoryListService: InventoryListService;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useListStore();
    inventoryListService = new InventoryListService();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with empty inventoryList', () => {
      expect(store.inventoryList).toEqual([]);
    });

    it('should initialize filters as empty array', () => {
      expect(store.filters).toEqual([]);
    });
  });

  describe('fetchInventoryList', () => {
    it('should fetch inventory list from service', () => {
      store.fetchInventoryList();

      expect(inventoryListService.getAllItems).toHaveBeenCalled();
      expect(store.inventoryList).toEqual([
        { id: 1, name: 'Item 1', display_value: 'item_1' },
        { id: 2, name: 'Item 2', display_value: 'item_2' },
      ]);
    });

    it('should update filters after fetching', () => {
      store.fetchInventoryList();
      expect(store.filters).toEqual(['Item 1', 'Item 2']);
    });
  });

  describe('updateInventoryListItem', () => {
    beforeEach(() => {
      store.inventoryList = [...mockInventory];
    });

    it('should update an item at the specified index', () => {
      const updatedItem = { id: 1, name: 'Updated Item', display_value: 'updated_item' };
      store.updateInventoryListItem({ newData: updatedItem, index: 0 });
      expect(mockUpdateItem).toHaveBeenCalledWith(
        [
          { id: 1, name: 'Item 1', display_value: 'item_1' },
          { id: 2, name: 'Item 2', display_value: 'item_2' }
        ],
        { newData: updatedItem, index: 0 }
      );
      expect(store.inventoryList).toEqual([
        updatedItem,
        { id: 2, name: 'Item 2', display_value: 'item_2' }
      ]);
    });

    it('should update filters after updating an item', () => {
      const updatedItem = { id: 1, name: 'Updated Item', display_value: 'updated_item' };
      store.updateInventoryListItem({ newData: updatedItem, index: 0 });
      expect(store.filters).toEqual(['Updated Item', 'Item 2']);
    });
  });

  describe('addInventoryListItem', () => {
    it('should add a new item to the inventory', () => {
      const newItemName = 'New Item';
      store.addInventoryListItem(newItemName);

      expect(inventoryListService.addItem).toHaveBeenCalled();
      expect(store.inventoryList).toContainEqual({
        id: 1,
        name: newItemName,
        display_value: 'new_item',
      });
    });

    it('should increment the id correctly when adding items', () => {
      store.fetchInventoryList();
      store.addInventoryListItem('Third Item');

      expect(store.inventoryList?.[2].id).toBe(3);
    });

    it('should update filters after adding an item', () => {
      store.addInventoryListItem('New Item');
      expect(store.filters).toContain('New Item');
    });
  });

  describe('deleteInventoryListItem', () => {
    beforeEach(() => {
      store.inventoryList = [...mockInventory];
    });

    it('should delete the specified item', () => {
      const itemToDelete = { ...mockInventory[0] };
      const initialInventory = [...store.inventoryList!];

      store.deleteInventoryListItem(itemToDelete);
      expect(mockDeleteItem).toHaveBeenCalledWith(
        initialInventory,
        itemToDelete
      );

      expect(store.inventoryList).toEqual([
        { id: 2, name: 'Item 2', display_value: 'item_2' }
      ]);
    });
    it('should update filters after deleting an item', () => {
      const itemToDelete = store.inventoryList![0];
      store.deleteInventoryListItem(itemToDelete);
      expect(store.filters).not.toContain(itemToDelete.name);
    });

    it('should not modify the list if item not found', () => {
      const initialList = [...store.inventoryList!];
      const nonExistentItem = { id: 99, name: 'Not exist', display_value: 'not_exist' };

      store.deleteInventoryListItem(nonExistentItem);
      expect(store.inventoryList).toEqual(initialList);
    });
  });

  describe('filters computed property', () => {
    it('should return empty array when inventoryList is empty', () => {
      expect(store.filters).toEqual([]);
    });

    it('should return names of all inventory items', () => {
      store.fetchInventoryList();
      expect(store.filters).toEqual(['Item 1', 'Item 2']);
    });
  });
});