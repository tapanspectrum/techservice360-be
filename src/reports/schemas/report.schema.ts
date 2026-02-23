import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true })
  type: string;
  @Prop({ required: true, index: true })
  tenantId: string;
}

export interface ReportDocument extends Document {
  type: string;
  tenantId: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
