import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateAlbumRequest {
  @IsString()
  @IsNotEmpty()
  public Name!: string;

  @IsString()
  @IsNotEmpty()
  public DriveFolderUrl!: string;

  @IsString()
  @Matches(/^\d{4,8}$/)
  public Pin!: string;

  @IsInt()
  @Min(1)
  public MaxSelectable!: number;

  @IsOptional()
  @IsDateString()
  public ExpiredAt?: string;
}
