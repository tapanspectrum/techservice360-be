import { IsString, IsMongoId, IsNumber, IsEnum } from 'class-validator';

export class CreateRepairDto {
  @IsString()
  tenantId: string;

  @IsMongoId()
  clientId: string;

  @IsString()
  deviceType: string;

  @IsString()
  issue: string;

  @IsNumber()
  amount: number;

  @IsEnum(['pending', 'in-progress', 'completed'])
  status: 'pending' | 'in-progress' | 'completed';
}
