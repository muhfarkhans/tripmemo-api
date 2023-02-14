import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordOld: string;
}
