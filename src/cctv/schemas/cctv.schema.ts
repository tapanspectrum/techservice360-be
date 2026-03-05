import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface CctvDocument extends Omit<Document, 'model'> {
  tenantId: Types.ObjectId;
  clientId?: Types.ObjectId;
  location: string;
  status: string;
  model?: string;
  serialNumber?: string;
  lastServiceDate?: Date;
}

@Schema({ timestamps: true })
export class Cctv {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  clientId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true, enum: ['online', 'offline', 'maintenance'], default: 'online' })
  status: string;

  @Prop({ trim: true })
  model?: string;

  @Prop({ trim: true })
  serialNumber?: string;

  @Prop()
  lastServiceDate?: Date;
}

export const CctvSchema = SchemaFactory.createForClass(Cctv);
