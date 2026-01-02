import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateStockRequest {
  @IsOptional()
  @IsUUID('4')
  public GoodsId?: string;

  @IsOptional()
  @IsUUID('4')
  public ProductId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public BatchCode!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public Qty!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public UnitCost!: number;

  @IsDateString()
  public ReceivedDate!: string;

  @IsOptional()
  @IsDateString()
  public ExpiredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  public Note?: string;
}
