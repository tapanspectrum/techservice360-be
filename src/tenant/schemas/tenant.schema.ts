import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TenantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  zipCode?: string;

  @Prop()
  country?: string;

  @Prop()
  website?: string;

  @Prop({
    type: String,
    enum: Object.values(TenantStatus),
    default: TenantStatus.ACTIVE,
  })
  status: TenantStatus;

  @Prop()
  description?: string;

  @Prop({ default: 'basic' })
  subscriptionPlan?: string;

  @Prop({ default: 10, min: 1 })
  maxUsers?: number;

  @Prop({ default: 0, min: 0 })
  currentUsers?: number;

  @Prop({ default: 1024, min: 0 })
  storageLimit?: number;

  @Prop({ default: 0, min: 0 })
  usedStorage?: number;

  @Prop({ type: Date })
  subscriptionStartDate?: string;

  @Prop({ type: Date })
  subscriptionEndDate?: string;

  @Prop()
  logo?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export interface TenantDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  status: TenantStatus;
  description?: string;
  subscriptionPlan?: string;
  maxUsers?: number;
  currentUsers?: number;
  storageLimit?: number;
  usedStorage?: number;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  logo?: string;
  metadata?: Record<string, any>;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant); 
