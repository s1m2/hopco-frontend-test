import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useItemsStore } from '../items';
import { InventoryItemService } from '@/services/InventoryItemsService';

// Create mock implementations that we can control
const mockGetAllItems = vi.fn();
const mockAddItem = vi.fn();
const mockUpdateItem = vi.fn();
const mockDeleteItem = vi.fn();

// Mock the InventoryItemService
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
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());

    // Reset all mocks before each test
    vi.clearAllMocks();

    // Reset the mock implementations
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
      // Mock data to be returned from service
      const mockItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      mockGetAllItems.mockReturnValue(mockItems);

      // Initialize the store and call the method
      const store = useItemsStore();
      store.getAllInventoryItems();

      // Verify the items were updated
      expect(store.items).toEqual(mockItems);
      expect(mockGetAllItems).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array from service', () => {
      // Mock empty array return
      mockGetAllItems.mockReturnValue([]);

      // Initialize the store and call the method
      const store = useItemsStore();
      store.getAllInventoryItems();

      // Verify the items were updated to empty array
      expect(store.items).toEqual([]);
      expect(mockGetAllItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('addInventoryItem', () => {
    it('should add item and update state with result from service', () => {
      // Mock initial items
      const initialItems = [{ id: 1, name: 'Existing Item' }];
      const newItem = { id: 2, name: 'New Item' };
      const updatedItems = [...initialItems, newItem];

      // Setup mock return
      mockAddItem.mockReturnValue(updatedItems);

      // Initialize store with items
      const store = useItemsStore();
      store.items = initialItems;

      // Add new item
      store.addInventoryItem(newItem);

      // Verify
      expect(mockAddItem).toHaveBeenCalledWith(initialItems, newItem);
      expect(store.items).toEqual(updatedItems);
    });
  });

  describe('updateInventoryListItem', () => {
    it('should update item and reflect changes in state', () => {
      // Mock initial items
      const initialItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];

      // Update data
      const updateData = {
        newData: { id: 2, name: 'Updated Item 2' },
        index: 1
      };

      // Expected result after update
      const updatedItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Updated Item 2' }
      ];

      // Setup mock return
      mockUpdateItem.mockReturnValue(updatedItems);

      // Initialize store with items
      const store = useItemsStore();
      store.items = initialItems;

      // Update an item
      store.updateInventoryListItem(updateData);

      // Verify
      expect(mockUpdateItem).toHaveBeenCalledWith(initialItems, updateData);
      expect(store.items).toEqual(updatedItems);
    });

    it('should handle invalid update and maintain original state', () => {
      // Mock initial items
      const initialItems = [{ id: 1, name: 'Item 1' }];

      // Invalid update (index out of bounds)
      const updateData = {
        newData: { id: 2, name: 'Invalid Update' },
        index: 5
      };

      // Setup mock to return unchanged array
      mockUpdateItem.mockReturnValue(initialItems);

      // Initialize store with items
      const store = useItemsStore();
      store.items = initialItems;

      // Try to update with invalid data
      store.updateInventoryListItem(updateData);

      // Verify state remained unchanged
      expect(mockUpdateItem).toHaveBeenCalledWith(initialItems, updateData);
      expect(store.items).toEqual(initialItems);
    });
  });

  describe('deleteInventoryListItem', () => {
    it('should delete item and update state', () => {
      // Mock initial items
      const initialItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];

      // Item to delete
      const itemToDelete = initialItems[0];

      // Expected result after deletion
      const afterDeletion = [{ id: 2, name: 'Item 2' }];

      // Setup mock return
      mockDeleteItem.mockReturnValue(afterDeletion);

      // Initialize store with items
      const store = useItemsStore();
      store.items = initialItems;

      // Delete an item
      store.deleteInventoryListItem(itemToDelete);

      // Verify
      expect(mockDeleteItem).toHaveBeenCalledWith(initialItems, itemToDelete);
      expect(store.items).toEqual(afterDeletion);
    });

    it('should handle deletion of non-existent item', () => {
      // Mock initial items
      const initialItems = [{ id: 1, name: 'Item 1' }];

      // Non-existent item
      const nonExistentItem = { id: 999, name: 'Does Not Exist' };

      // Setup mock to return unchanged array (service should handle this)
      mockDeleteItem.mockReturnValue(initialItems);

      // Initialize store with items
      const store = useItemsStore();
      store.items = initialItems;

      // Try to delete non-existent item
      store.deleteInventoryListItem(nonExistentItem);

      // Verify state remained unchanged
      expect(mockDeleteItem).toHaveBeenCalledWith(initialItems, nonExistentItem);
      expect(store.items).toEqual(initialItems);
    });

    it('should handle deletion of the last item', () => {
      // Single item array
      const initialItems = [{ id: 1, name: 'Last Item' }];

      // Delete the only item
      const itemToDelete = initialItems[0];

      // Expected empty array after deletion
      const emptyArray = [];

      // Setup mock return
      mockDeleteItem.mockReturnValue(emptyArray);

      // Initialize store with items
      const store = useItemsStore();
      store.items = initialItems;

      // Delete the last item
      store.deleteInventoryListItem(itemToDelete);

      // Verify we now have an empty array
      expect(mockDeleteItem).toHaveBeenCalledWith(initialItems, itemToDelete);
      expect(store.items).toEqual(emptyArray);
    });
  });
});