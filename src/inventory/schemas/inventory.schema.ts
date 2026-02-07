import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

@Schema({ timestamps: true })
export class Inventory extends Document {
  itemName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  status: InventoryStatus;
  category?: string;
  location?: string;
  supplier?: string;
  lastRestocked?: Date;
  reorderLevel?: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
