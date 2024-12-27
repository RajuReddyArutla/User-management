import { IsString, IsOptional,IsArray, } from 'class-validator';

export class UpdateUserDto  {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsArray()
  role?: string[];
  
  @IsOptional()
  @IsArray()
  phone?: string[];
  
  @IsString()
  @IsOptional()
  status?: string;
}
