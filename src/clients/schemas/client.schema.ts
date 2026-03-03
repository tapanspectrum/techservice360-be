import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Client {
  @Prop({ type: String, required: false, index: true })
  tenantId?: string;

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

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  createdby: Types.ObjectId;
}

export interface ClientDocument extends Document {
  tenantId?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type?: string;
  createdby?: Types.ObjectId;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.index({ tenantId: 1, email: 1 }, {
  unique: true,
  partialFilterExpression: { tenantId: { $exists: true } },
});
ClientSchema.index({ tenantId: 1, name: 1 });
