import { IsString } from 'class-validator';

export class CreateDashboardDto {
  @IsString()
  title: string;
  @IsString()
  tenantId: string;
}
