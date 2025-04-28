import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseInventoryService } from '../BaseInventoryService';

class TestInventoryService extends BaseInventoryService<any> { }

describe('BaseInventoryService', () => {
  let service: TestInventoryService;
  const localStorageKey = 'testKey';
  const userDataMapping = { testUser: [{ id: 1, name: 'Item 1' }] };

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Replace the global localStorage with our mock
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    localStorageMock.clear();
    service = new TestInventoryService(localStorageKey, userDataMapping);
  });

  describe('getAllItems', () => {
    it('should return an empty array if no user is logged in', () => {
      localStorageMock.getItem.mockReturnValueOnce(null); // No user logged in
      const items = service.getAllItems();
      expect(items).toEqual([]);
    });

    it('should return stored items from localStorage if available', () => {
      const storedItems = [{ id: 2, name: 'Item 2' }];

      // Set up mocked localStorage returns
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: 'testUser' });
        if (key === localStorageKey) return JSON.stringify(storedItems);
        return null;
      });

      const items = service.getAllItems();
      expect(items).toEqual(storedItems);
    });

    it('should return user-specific items if no stored items are found', () => {
      // User exists but no items stored
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: 'testUser' });
        return null;
      });

      const items = service.getAllItems();
      expect(items).toEqual(userDataMapping.testUser);
    });
  });

  describe('addItem', () => {
    it('should add an item to the list and update localStorage', () => {
      const items = [{ id: 1, name: 'Item 1' }];
      const newItem = { id: 2, name: 'Item 2' };

      // Set up user for the service
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: 'testUser' });
        return null;
      });

      const updatedItems = service.addItem(items, newItem);
      expect(updatedItems).toEqual([...items, newItem]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        localStorageKey,
        JSON.stringify(updatedItems)
      );
    });
  });

  describe('updateItem', () => {
    it('should update an item in the list and update localStorage', () => {
      const items = [{ id: 1, name: 'Item 1' }];
      const updatedData = { newData: { id: 1, name: 'Updated Item 1' }, index: 0 };

      // Set up user for the service
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: 'testUser' });
        return null;
      });

      const updatedItems = service.updateItem(items, updatedData);
      expect(updatedItems).toEqual([updatedData.newData]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        localStorageKey,
        JSON.stringify(updatedItems)
      );
    });

    it('should return the original list if the index is invalid', () => {
      const items = [{ id: 1, name: 'Item 1' }];
      const updatedData = { newData: { id: 2, name: 'Updated Item 2' }, index: 1 };

      // Reset the mock to track the next calls
      localStorageMock.setItem.mockClear();

      const updatedItems = service.updateItem(items, updatedData);
      expect(updatedItems).toEqual(items);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('deleteItem', () => {
    it('should delete an item from the list and update localStorage', () => {
      const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      const itemToDelete = items[0];

      // Set up user for the service
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: 'testUser' });
        return null;
      });

      const updatedItems = service.deleteItem(items, itemToDelete);
      expect(updatedItems).toEqual([items[1]]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        localStorageKey,
        JSON.stringify(updatedItems)
      );
    });

    it('should return the original list if the item is not found', () => {
      const items = [{ id: 1, name: 'Item 1' }];
      const itemToDelete = { id: 2, name: 'Item 2' };

      // Reset the mock to track the next calls
      localStorageMock.setItem.mockClear();

      const updatedItems = service.deleteItem(items, itemToDelete);
      expect(updatedItems).toEqual(items);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });
});