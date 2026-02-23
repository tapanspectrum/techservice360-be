import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProjectStatus } from '../projects.constants';

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Prop()
  budget?: number;

  @Prop({ type: [String], default: [] })
  team?: string[];

  @Prop()
  manager?: string;

  @Prop()
  category?: string;
}

export interface ProjectDocument extends Document {
  tenantId: string;
  name: string;
  description: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  budget?: number;
  team?: string[];
  manager?: string;
  category?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ tenantId: 1, clientId: 1 });
ProjectSchema.index({ tenantId: 1, status: 1 });
ProjectSchema.index({ manager: 1 });
