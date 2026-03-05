import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface ReportDocument extends Document {
  tenantId: Types.ObjectId;
  type: string;
  title: string;
  fromDate?: Date;
  toDate?: Date;
  generatedBy?: string;
  data?: Record<string, any>;
  status: string;
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  type: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  fromDate?: Date;

  @Prop()
  toDate?: Date;

  @Prop({ trim: true })
  generatedBy?: string;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop({ enum: ['draft', 'generated', 'failed'], default: 'generated' })
  status: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
