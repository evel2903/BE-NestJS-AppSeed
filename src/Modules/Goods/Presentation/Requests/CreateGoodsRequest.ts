import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateGoodsRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  public Name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public Sku!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public Barcode?: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  public CategoryId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public Unit?: string;

  @IsOptional()
  @IsBoolean()
  public IsActive?: boolean;
}
