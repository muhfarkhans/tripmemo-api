import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMemoDto {
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @IsString()
  googleMapLink: string;

  photo: string;

  @IsNotEmpty()
  @IsString()
  visibility: string;
}
