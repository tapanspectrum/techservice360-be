import { IsString, IsMongoId, IsInt, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class CreateCctvDto {
  @IsString()
  projectName: string;
  @IsString()
  tenantId: string;

  @IsMongoId()
  clientId: string;

  @IsInt()
  cameras: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  installationDate: string;

  @IsString()
  warranty: string;

  @IsEnum(['installed', 'pending'])
  status: 'installed' | 'pending';
}
