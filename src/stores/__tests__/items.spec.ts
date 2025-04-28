import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useItemsStore } from '../items';
import { InventoryItemService } from '@/services/InventoryItemsService';

const mockGetAllItems = vi.fn();
const mockAddItem = vi.fn();
const mockUpdateItem = vi.fn();
const mockDeleteItem = vi.fn();

vi.mock('@/services/InventoryItemsService', () => ({
  InventoryItemService: vi.fn().mockImplementation(() => ({
    getAllItems: mockGetAllItems,
    addItem: mockAddItem,
    updateItem: mockUpdateItem,
    deleteItem: mockDeleteItem
  }))
}));

describe('useItemsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();

    mockGetAllItems.mockReset();
    mockAddItem.mockReset();
    mockUpdateItem.mockReset();
    mockDeleteItem.mockReset();
  });

  describe('initial state', () => {
    it('should initialize with empty items array', () => {
      const store = useItemsStore();
      expect(store.items).toEqual([]);
    });
  });

  describe('getAllInventoryItems', () => {
    it('should update items with data from service', () => {
      const mockItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      mockGetAllItems.mockReturnValue(mockItems);

      const store = useItemsStore();
      store.getAllInventoryItems();

      expect(store.items).toEqual(mockItems);
      expect(mockGetAllItems).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array from service', () => {
      mockGetAllItems.mockReturnValue([]);

      const store = useItemsStore();
      store.getAllInventoryItems();

      expect(store.items).toEqual([]);
      expect(mockGetAllItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('addInventoryItem', () => {
    it('should add item and update state with result from service', () => {
      const initialItems = [{ id: 1, name: 'Existing Item' }];
      const newItem = { id: 2, name: 'New Item' };
      const updatedItems = [...initialItems, newItem];

      mockAddItem.mockReturnValue(updatedItems);

      const store = useItemsStore();
      store.items = initialItems;
      store.addInventoryItem(newItem);
      expect(mockAddItem).toHaveBeenCalledWith(initialItems, newItem);
      expect(store.items).toEqual(updatedItems);
    });
  });

  describe('updateInventoryListItem', () => {
    it('should update item and reflect changes in state', () => {
      const initialItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];

      const updateData = {
        newData: { id: 2, name: 'Updated Item 2' },
        index: 1
      };

      const updatedItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Updated Item 2' }
      ];

      mockUpdateItem.mockReturnValue(updatedItems);

      const store = useItemsStore();
      store.items = initialItems;
      store.updateInventoryListItem(updateData);
      expect(mockUpdateItem).toHaveBeenCalledWith(initialItems, updateData);
      expect(store.items).toEqual(updatedItems);
    });

    it('should handle invalid update and maintain original state', () => {
      const initialItems = [{ id: 1, name: 'Item 1' }];

      const updateData = {
        newData: { id: 2, name: 'Invalid Update' },
        index: 5
      };

      mockUpdateItem.mockReturnValue(initialItems);
      const store = useItemsStore();
      store.items = initialItems;
      store.updateInventoryListItem(updateData);
      expect(mockUpdateItem).toHaveBeenCalledWith(initialItems, updateData);
      expect(store.items).toEqual(initialItems);
    });
  });

  describe('deleteInventoryListItem', () => {
    it('should delete item and update state', () => {
      const initialItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      const itemToDelete = initialItems[0];
      const afterDeletion = [{ id: 2, name: 'Item 2' }];
      mockDeleteItem.mockReturnValue(afterDeletion);
      const store = useItemsStore();
      store.items = initialItems;
      store.deleteInventoryListItem(itemToDelete);
      expect(mockDeleteItem).toHaveBeenCalledWith(initialItems, itemToDelete);
      expect(store.items).toEqual(afterDeletion);
    });

    it('should handle deletion of non-existent item', () => {
      const initialItems = [{ id: 1, name: 'Item 1' }];
      const nonExistentItem = { id: 999, name: 'Does Not Exist' };
      mockDeleteItem.mockReturnValue(initialItems);
      const store = useItemsStore();
      store.items = initialItems;

      store.deleteInventoryListItem(nonExistentItem);

      expect(mockDeleteItem).toHaveBeenCalledWith(initialItems, nonExistentItem);
      expect(store.items).toEqual(initialItems);
    });

    it('should handle deletion of the last item', () => {
      const initialItems = [{ id: 1, name: 'Last Item' }];

      const itemToDelete = initialItems[0];

      const emptyArray = [];
      mockDeleteItem.mockReturnValue(emptyArray);
      const store = useItemsStore();
      store.items = initialItems;
      store.deleteInventoryListItem(itemToDelete);
      expect(mockDeleteItem).toHaveBeenCalledWith(initialItems, itemToDelete);
      expect(store.items).toEqual(emptyArray);
    });
  });
});