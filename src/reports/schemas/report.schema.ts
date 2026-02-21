import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true })
  type: string;
  @Prop({ required: true, index: true })
  tenantId: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
