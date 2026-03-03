import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cctv {
  @Prop({ required: true })
  projectName: string;
  
  @Prop({ type: String, required: false, index: true })
  tenantId?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Client' })
  clientId: Types.ObjectId;

  @Prop({ required: true })
  cameras: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, type: Date })
  installationDate: Date;

  @Prop({ required: true })
  warranty: string;

  @Prop({ required: true, enum: ['installed', 'pending'] })
  status: 'installed' | 'pending';
}

export interface CctvDocument extends Document {
  projectName: string;
  tenantId: string;
  clientId: Types.ObjectId;
  cameras: number;
  amount: number;
  installationDate: Date;
  warranty: string;
  status: 'installed' | 'pending';
}

export const CctvSchema = SchemaFactory.createForClass(Cctv);

CctvSchema.index({ tenantId: 1, installationDate: -1 });
