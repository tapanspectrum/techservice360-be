import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Project extends Document {
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
