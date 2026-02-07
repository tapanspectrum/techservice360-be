import { Document } from 'mongoose';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface IProject extends Document {
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
  createdAt?: Date;
  updatedAt?: Date;
}
