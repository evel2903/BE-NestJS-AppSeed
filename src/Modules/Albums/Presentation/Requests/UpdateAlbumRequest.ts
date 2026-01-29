import { IsDateString, IsInt, IsOptional, IsString, Matches, Min, IsIn } from 'class-validator';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';

export class UpdateAlbumRequest {
  @IsOptional()
  @IsString()
  public Name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4,8}$/)
  public Pin?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  public MaxSelectable?: number;

  @IsOptional()
  @IsDateString()
  public ExpiredAt?: string;

  @IsOptional()
  @IsIn([AlbumStatus.Active, AlbumStatus.Closed, AlbumStatus.Expired])
  public Status?: AlbumStatus;
}
