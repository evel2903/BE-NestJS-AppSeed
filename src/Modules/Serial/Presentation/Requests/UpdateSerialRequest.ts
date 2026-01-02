import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateSerialRequest {
  @IsOptional()
  @IsUUID('4')
  public StockId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public Status?: string;
}
