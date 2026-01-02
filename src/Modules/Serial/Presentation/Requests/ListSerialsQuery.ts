import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class ListSerialsQuery {
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
  public ProductId?: string;

  @IsOptional()
  @IsUUID('4')
  public StockId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public Status?: string;
}
