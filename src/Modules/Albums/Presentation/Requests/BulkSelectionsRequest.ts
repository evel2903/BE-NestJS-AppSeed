import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

export class BulkSelectionItemRequest {
  @IsString()
  public DriveFileId!: string;

  @IsBoolean()
  public IsSelected!: boolean;

  @IsOptional()
  @IsString()
  public Note?: string;
}

export class BulkSelectionsRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkSelectionItemRequest)
  public Items!: BulkSelectionItemRequest[];
}
