import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Dashboard {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, index: true })
  tenantId: string;
}

export interface DashboardDocument extends Document {
  title: string;
  tenantId: string;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
