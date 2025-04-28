import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InventoryItemService } from '@/services/InventoryItemsService';
import { NAIROBI_USER, MATTER_USER } from '@/constants/user';
import NairobiInventoryItems from './../../../mocks/nairobi_items.json';
import MatterInventoryItems from './../../../mocks/matter_items.json';

vi.mock('@/services/BaseInventoryService', () => {
  return {
    BaseInventoryService: vi.fn().mockImplementation((localStorageKey, userDataMapping) => {
      return {
        _localStorageKey: localStorageKey,
        _userDataMapping: userDataMapping,
        getAllItems: vi.fn(),
        addItem: vi.fn(),
        updateItem: vi.fn(),
        deleteItem: vi.fn()
      };
    })
  };
});

describe('InventoryItemService', () => {
  let service: InventoryItemService;
  
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
    service = new InventoryItemService();
  });

  describe('constructor', () => {
    it('should initialize with the correct storage key', () => {
      expect(service._localStorageKey).toBe('inventory_items');
    });

    it('should initialize with the correct user data mapping', () => {
      const expectedMapping = {
        [MATTER_USER]: MatterInventoryItems.data,
        [NAIROBI_USER]: NairobiInventoryItems.data
      };
      expect(service._userDataMapping).toEqual(expectedMapping);
    });
  });

  describe('integration with BaseInventoryService', () => {
    it('should return Nairobi items when Nairobi user is logged in', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: NAIROBI_USER });
        return null;
      });
      
      service.getAllItems = vi.fn().mockImplementation(() => {
        if (localStorageMock.getItem('user')) {
          const user = JSON.parse(localStorageMock.getItem('user'));
          return service._userDataMapping[user.username] || [];
        }
        return [];
      });

      const items = service.getAllItems();
      expect(items).toEqual(NairobiInventoryItems.data);
    });

    it('should return Matter items when Matter user is logged in', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: MATTER_USER });
        return null;
      });
      
      service.getAllItems = vi.fn().mockImplementation(() => {
        if (localStorageMock.getItem('user')) {
          const user = JSON.parse(localStorageMock.getItem('user'));
          return service._userDataMapping[user.username] || [];
        }
        return [];
      });

      const items = service.getAllItems();
      expect(items).toEqual(MatterInventoryItems.data);
    });

    it('should return empty array when no user is logged in', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      service.getAllItems = vi.fn().mockImplementation(() => {
        if (localStorageMock.getItem('user')) {
          const user = JSON.parse(localStorageMock.getItem('user'));
          return service._userDataMapping[user.username] || [];
        }
        return [];
      });

      const items = service.getAllItems();
      expect(items).toEqual([]);
    });
  });

  describe('inherited methods', () => {
    const sampleItems = [{ id: 1, name: 'Test Item' }];
    
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'user') return JSON.stringify({ username: NAIROBI_USER });
        if (key === 'inventory_items') return JSON.stringify(sampleItems);
        return null;
      });
    });

    it('should call addItem and return updated items', () => {
      const newItem = { id: 2, name: 'New Item' };
      
      service.addItem = vi.fn().mockImplementation((items, item) => {
        const updatedItems = [...items, item];
        localStorageMock.setItem('inventory_items', JSON.stringify(updatedItems));
        return updatedItems;
      });

      const result = service.addItem(sampleItems, newItem);
      expect(result).toEqual([...sampleItems, newItem]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_items',
        JSON.stringify([...sampleItems, newItem])
      );
    });

    it('should call updateItem and return updated items', () => {
      const updatedItem = { id: 1, name: 'Updated Item' };
      
      service.updateItem = vi.fn().mockImplementation((items, data) => {
        const { newData, index } = data;
        if (items[index]) {
          const updatedList = [...items];
          updatedList[index] = newData;
          localStorageMock.setItem('inventory_items', JSON.stringify(updatedList));
          return updatedList;
        }
        return items;
      });

      const result = service.updateItem(sampleItems, { newData: updatedItem, index: 0 });
      expect(result).toEqual([updatedItem]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_items',
        JSON.stringify([updatedItem])
      );
    });

    it('should call deleteItem and return updated items', () => {
      const itemToDelete = sampleItems[0];
      
      service.deleteItem = vi.fn().mockImplementation((items, item) => {
        const updatedItems = items.filter(i => i.id !== item.id);
        localStorageMock.setItem('inventory_items', JSON.stringify(updatedItems));
        return updatedItems;
      });

      const result = service.deleteItem(sampleItems, itemToDelete);
      expect(result).toEqual([]);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'inventory_items',
        JSON.stringify([])
      );
    });
  });
});