import { Document } from 'mongoose';
import { InventoryCategory, InventoryStatus } from '../inventory.constants';

export interface IInventory extends Document {
  tenantId: string;
  sku?: string;
  productName: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  status: InventoryStatus;
  category: InventoryCategory;
  supplierId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
