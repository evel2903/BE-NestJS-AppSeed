import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateProductRequest {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  public Name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public Sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public Barcode?: string;

  @IsOptional()
  @IsUUID('4')
  public CategoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public Unit?: string;

  @IsOptional()
  @IsBoolean()
  public IsActive?: boolean;

  @IsOptional()
  @IsBoolean()
  public HasSerial?: boolean;
}
