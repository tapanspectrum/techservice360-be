import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface AmcProductDocument extends Omit<Document, 'model'> {
  tenantId: Types.ObjectId;
  clientId?: Types.ObjectId;
  productName: string;
  model?: string;
  serialNumber?: string;
  productPrice: number;
  amcPercentage: number;
  amcAmount: number;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

@Schema({ timestamps: true })
export class AmcProduct {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  productName: string;

  @Prop({ trim: true })
  model?: string;

  @Prop({ trim: true })
  serialNumber?: string;

  @Prop({ required: true, min: 0 })
  productPrice: number;

  @Prop({ default: 5, min: 0, immutable: true })
  amcPercentage: number;

  @Prop({ required: true, min: 0 })
  amcAmount: number;

  @Prop({ enum: ['active', 'expired'], default: 'active' })
  status: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;
}

export const AmcProductSchema = SchemaFactory.createForClass(AmcProduct);

AmcProductSchema.set('toJSON', {
  transform: (_doc, ret: { amcPercentage?: number }) => {
    delete ret.amcPercentage;
    return ret;
  },
});

AmcProductSchema.set('toObject', {
  transform: (_doc, ret: { amcPercentage?: number }) => {
    delete ret.amcPercentage;
    return ret;
  },
});
