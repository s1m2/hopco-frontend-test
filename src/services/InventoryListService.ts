import MatterInventoryList from './../../mocks/matter_inventory_list.json';
import NairobiInventoryList from './../../mocks/nairobi_inventory_list.json';
import { BaseInventoryService } from '@/services/BaseInventoryService';
import { MATTER_USER, NAIROBI_USER } from '@/constants/user';

import type { Inventory } from '@/types/inventory';

export class InventoryListService extends BaseInventoryService<Inventory> {
  constructor() {
    super('inventory_lists', {
      [MATTER_USER]: MatterInventoryList.inventory_list,
      [NAIROBI_USER]: NairobiInventoryList.inventory_list,
    });
  }

  getInventoryNames(list: Inventory[]): string[] {
    return list.map((item: Inventory) => item.name);
  }
}