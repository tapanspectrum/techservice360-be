import { IsString, IsOptional, IsDate, IsNumber, IsEnum, IsArray } from 'class-validator';
import { ProjectStatus } from '../projects.constants';

export class CreateProjectDto {
  @IsString()
  tenantId: string;
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
