import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSerialRequest {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  public ProductId!: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  public StockId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public SerialNumber!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public Status?: string;
}
