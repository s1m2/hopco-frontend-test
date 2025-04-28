import NairobiInventoryItems from './../../mocks/nairobi_items.json';
import MatterInventoryItems from './../../mocks/matter_items.json';
import { BaseInventoryService } from '@/services/BaseInventoryService';
import { NAIROBI_USER, MATTER_USER } from '@/constants/user';

export class InventoryItemService extends BaseInventoryService<unknown> {
  constructor() {
    super('inventory_items', {
      [MATTER_USER]: MatterInventoryItems.data,
      [NAIROBI_USER]: NairobiInventoryItems.data,
    });
  }
}