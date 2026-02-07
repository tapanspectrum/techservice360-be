import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Client extends Document {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  industry?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
