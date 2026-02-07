import { Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  industry?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
