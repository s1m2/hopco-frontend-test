import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InventoryListService } from '../InventoryListService';
import { NAIROBI_USER, MATTER_USER } from '@/constants/user';
import MatterInventoryList from './../../../mocks/matter_inventory_list.json';
import NairobiInventoryList from './../../../mocks/nairobi_inventory_list.json';
import type { Inventory } from '@/types/inventory';

describe('InventoryListService', () => {
  let service: InventoryListService;

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

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    localStorageMock.clear();
    service = new InventoryListService();
  });

  describe('constructor', () => {
    it('should initialize with the correct storage key', () => {
      expect(service['_localStorageKey']).toBe('inventory_lists');
    });

    it('should initialize with the correct user data mapping', () => {
      const expectedMapping = {
        [MATTER_USER]: MatterInventoryList.inventory_list,
        [NAIROBI_USER]: NairobiInventoryList.inventory_list
      };
      expect(service['_userDataMapping']).toEqual(expectedMapping);
    });
  });

  describe('getInventoryNames', () => {
    it('should extract only the names from inventory items', () => {
      const testInventory: Inventory[] = [
        { id: 1, name: 'Test Inventory 1', description: 'Test Description 1' } as Inventory,
        { id: 2, name: 'Test Inventory 2', description: 'Test Description 2' } as Inventory
      ];

      const names = service.getInventoryNames(testInventory);
      expect(names).toEqual(['Test Inventory 1', 'Test Inventory 2']);
    });

    it('should return an empty array when given an empty inventory list', () => {
      const names = service.getInventoryNames([]);
      expect(names).toEqual([]);
    });

    it('should handle inventory items with missing names', () => {
      const testInventory: Inventory[] = [
        { id: 1, description: 'Test Description 1' } as Inventory,
        { id: 2, name: 'Test Inventory 2', description: 'Test Description 2' } as Inventory
      ];

      const names = service.getInventoryNames(testInventory);
      expect(names).toEqual([undefined, 'Test Inventory 2']);
    });
  });

  describe('inherited getAllItems', () => {
    it('should return Nairobi inventory list when Nairobi user is logged in', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: NAIROBI_USER });
        return null;
      });

      const items = service.getAllItems();
      expect(items).toEqual(NairobiInventoryList.inventory_list);
    });

    it('should return Matter inventory list when Matter user is logged in', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: MATTER_USER });
        return null;
      });

      const items = service.getAllItems();
      expect(items).toEqual(MatterInventoryList.inventory_list);
    });

    it('should return empty array when no user is logged in', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const items = service.getAllItems();
      expect(items).toEqual([]);
    });

    it('should return localStorage items when available instead of default mapping', () => {
      const storedItems: Inventory[] = [
        { id: 3, name: 'Stored Inventory', description: 'Stored Description' } as Inventory
      ];

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: NAIROBI_USER });
        if (key === 'inventory_lists') return JSON.stringify(storedItems);
        return null;
      });

      const items = service.getAllItems();
      expect(items).toEqual(storedItems);
      expect(items).not.toEqual(NairobiInventoryList.inventory_list);
    });
  });

  describe('inherited addItem', () => {
    const existingItems: Inventory[] = [
      { id: 1, name: 'Existing Inventory', description: 'Existing Description' } as Inventory
    ];
    const newItem: Inventory = { id: 2, name: 'New Inventory', description: 'New Description' } as Inventory;

    it('should add an item to the list and update localStorage', () => {
      const updatedItems = service.addItem(existingItems, newItem);

      expect(updatedItems).toHaveLength(2);
      expect(updatedItems).toContainEqual(newItem);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_lists',
        JSON.stringify(updatedItems)
      );
    });

    it('should work with an empty initial list', () => {
      const updatedItems = service.addItem([], newItem);

      expect(updatedItems).toHaveLength(1);
      expect(updatedItems[0]).toEqual(newItem);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_lists',
        JSON.stringify(updatedItems)
      );
    });
  });

  describe('inherited updateItem', () => {
    const existingItems: Inventory[] = [
      { id: 1, name: 'Inventory 1', description: 'Description 1' } as Inventory,
      { id: 2, name: 'Inventory 2', description: 'Description 2' } as Inventory
    ];

    it('should update an item in the list and update localStorage', () => {
      const updatedItem: Inventory = {
        id: 1,
        name: 'Updated Inventory',
        description: 'Updated Description'
      } as Inventory;

      const updatedItems = service.updateItem(existingItems, {
        newData: updatedItem,
        index: 0
      });

      expect(updatedItems[0]).toEqual(updatedItem);
      expect(updatedItems[1]).toEqual(existingItems[1]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_lists',
        JSON.stringify(updatedItems)
      );
    });

    it('should return the original list if the index is invalid', () => {
      const updatedItem: Inventory = {
        id: 3,
        name: 'Invalid Update',
        description: 'Invalid Description'
      } as Inventory;

      localStorageMock.setItem.mockClear();

      const updatedItems = service.updateItem(existingItems, {
        newData: updatedItem,
        index: 3
      });

      expect(updatedItems).toEqual(existingItems);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('inherited deleteItem', () => {
    const existingItems: Inventory[] = [
      { id: 1, name: 'Inventory 1', description: 'Description 1' } as Inventory,
      { id: 2, name: 'Inventory 2', description: 'Description 2' } as Inventory
    ];

    it('should delete an item from the list and update localStorage', () => {
      const itemToDelete = existingItems[0];

      const updatedItems = service.deleteItem(existingItems, itemToDelete);

      expect(updatedItems).toHaveLength(1);
      expect(updatedItems[0]).toEqual(existingItems[1]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_lists',
        JSON.stringify(updatedItems)
      );
    });

    it('should return the original list if the item is not found', () => {
      const nonExistentItem: Inventory = {
        id: 3,
        name: 'Non-existent',
        description: 'Does not exist'
      } as Inventory;

      localStorageMock.setItem.mockClear();

      const updatedItems = service.deleteItem(existingItems, nonExistentItem);

      expect(updatedItems).toEqual(existingItems);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should return an empty array when deleting the only item', () => {
      const singleItem: Inventory[] = [
        { id: 1, name: 'Only Inventory', description: 'Only Description' } as Inventory
      ];

      const updatedItems = service.deleteItem(singleItem, singleItem[0]);

      expect(updatedItems).toHaveLength(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_lists',
        JSON.stringify([])
      );
    });
  });

  describe('integration with user-specific data', () => {
    it('should correctly use the getInventoryNames method with user-specific data', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: MATTER_USER });
        return null;
      });

      const items = service.getAllItems();
      const names = service.getInventoryNames(items);

      const expectedNames = MatterInventoryList.inventory_list.map(item => item.name);
      expect(names).toEqual(expectedNames);
    });

    it('should correctly use the getInventoryNames method with localStorage data', () => {
      const storedItems: Inventory[] = [
        { id: 1, name: 'Storage Item 1', description: 'Storage Description 1' } as Inventory,
        { id: 2, name: 'Storage Item 2', description: 'Storage Description 2' } as Inventory
      ];

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: NAIROBI_USER });
        if (key === 'inventory_lists') return JSON.stringify(storedItems);
        return null;
      });

      const items = service.getAllItems();
      const names = service.getInventoryNames(items);

      expect(names).toEqual(['Storage Item 1', 'Storage Item 2']);
    });
  });
});