import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Dashboard extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true, index: true })
  tenantId: string;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
