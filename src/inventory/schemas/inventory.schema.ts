import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InventoryCategory, InventoryStatus } from '../inventory.constants';

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ trim: true })
  sku?: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, enum: Object.values(InventoryCategory) })
  category: InventoryCategory;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop({ required: true })
  sellingPrice: number;

  @Prop({ required: true })
  stock: number;

  @Prop({
    type: String,
    enum: Object.values(InventoryStatus),
    default: InventoryStatus.IN_STOCK,
  })
  status: InventoryStatus;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Supplier' })
  supplierId: Types.ObjectId;
}

export interface InventoryDocument extends Document {
  tenantId: string;
  sku?: string;
  productName: string;
  category: InventoryCategory;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  status: InventoryStatus;
  supplierId: Types.ObjectId;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.index({ tenantId: 1, category: 1 });
InventorySchema.index({ tenantId: 1, status: 1 });
InventorySchema.index({ tenantId: 1, supplierId: 1 });
InventorySchema.index({ tenantId: 1, sku: 1 });
