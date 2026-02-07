// update-user.dto.ts
import { IsString, IsOptional, IsEnum, IsIn } from 'class-validator';

export class UpdateUserDto {
  // @IsString()
  // @IsOptional()
  // readonly name?: string;

  // @IsString()
  // @IsOptional()
  // readonly phone?: string;

  // @IsString()
  // @IsOptional()
  // readonly address?: string;

  // @IsEnum(['donor', 'receiver', 'admin'])
  // @IsOptional()
  // readonly role?: 'donor' | 'receiver' | 'admin';

  // @IsOptional()
  // readonly location?: {
  //   type?: 'Point';
  //   coordinates?: [number, number];
  // };

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['free', 'premium', 'top', 'platinum'])
  membership?: string;

  @IsOptional()
  membershipExpiresAt?: Date | null;
}
