import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateStockRequest {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  public BatchCode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public Qty?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public UnitCost?: number;

  @IsOptional()
  @IsDateString()
  public ReceivedDate?: string;

  @IsOptional()
  @IsDateString()
  public ExpiredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  public Note?: string;
}
