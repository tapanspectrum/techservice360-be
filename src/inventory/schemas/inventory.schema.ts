import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true, index: true })
  tenantId: string;
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, enum: ['cctv', 'hardware', 'spare'] })
  category: 'cctv' | 'hardware' | 'spare';

  @Prop({ required: true })
  purchasePrice: number;

  @Prop({ required: true })
  sellingPrice: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Supplier' })
  supplierId: Types.ObjectId;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
