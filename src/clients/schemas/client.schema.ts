import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Client {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: false, index: true })
  tenantId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  phone: string;
	
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  address: string;

  @Prop({ enum: ['office', 'pg', 'shop', 'apartment'] })
  type: string;

  @Prop()
  createdby: string;
}

export interface ClientDocument extends Document {
  tenantId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type?: string;
  createdby?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.index({ tenantId: 1, email: 1 }, {
  unique: true,
  partialFilterExpression: { tenantId: { $exists: true } },
});
ClientSchema.index({ tenantId: 1, name: 1 });
