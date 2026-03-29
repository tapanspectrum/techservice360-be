import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface ClientDocument extends Document {
  companyName: string;
  companyPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  type?: string;
  notes: string;
  isActive: boolean;
  createdBy?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ trim: true })
  companyPerson?: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true, enum: ['stratup', 'pg', 'apartment', 'clinic'], default: 'stratup' })
  type?: string;

  @Prop({ trim: true })
  notes: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
