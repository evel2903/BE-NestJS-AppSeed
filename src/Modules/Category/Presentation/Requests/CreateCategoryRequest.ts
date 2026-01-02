import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  public Name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public Code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  public Description?: string;

  @IsOptional()
  @IsBoolean()
  public IsActive?: boolean;
}
