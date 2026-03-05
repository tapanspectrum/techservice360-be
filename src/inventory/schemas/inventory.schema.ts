import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface InventoryDocument extends Document {
  tenantId: Types.ObjectId;
  itemName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  isActive: boolean;
}

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  itemName: string;

  @Prop({ trim: true })
  sku?: string;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ default: 0 })
  unitPrice: number;

  @Prop({ default: 0 })
  reorderLevel: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
