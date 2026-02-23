import { Document } from 'mongoose';
import { ProjectStatus } from '../projects.constants';

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
