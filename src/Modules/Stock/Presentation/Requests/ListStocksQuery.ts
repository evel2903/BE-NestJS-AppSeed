import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class ListStocksQuery {
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
  @IsUUID('4')
  public GoodsId?: string;

  @IsOptional()
  @IsUUID('4')
  public ProductId?: string;

  @IsOptional()
  @IsDateString()
  public FromDate?: string;

  @IsOptional()
  @IsDateString()
  public ToDate?: string;
}
