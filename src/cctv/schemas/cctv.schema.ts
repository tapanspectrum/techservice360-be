import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cctv extends Document {
  @Prop({ required: true })
  projectName: string;
  @Prop({ required: true, index: true })
  tenantId: string;

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

export const CctvSchema = SchemaFactory.createForClass(Cctv);
