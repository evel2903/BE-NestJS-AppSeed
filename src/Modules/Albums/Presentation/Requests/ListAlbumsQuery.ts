import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';

export class ListAlbumsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public Page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public PageSize?: number;

  @IsOptional()
  @IsIn([AlbumStatus.Active, AlbumStatus.Closed, AlbumStatus.Expired])
  public Status?: AlbumStatus;
}
