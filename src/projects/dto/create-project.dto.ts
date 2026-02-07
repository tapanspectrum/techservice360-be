import { IsString, IsOptional, IsDate, IsNumber, IsEnum, IsArray } from 'class-validator';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  clientId: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  team?: string[];

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
