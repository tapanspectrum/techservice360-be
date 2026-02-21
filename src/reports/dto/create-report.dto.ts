import { IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  type: string;
  @IsString()
  tenantId: string;
}
