import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SetSelectionRequest {
  @IsBoolean()
  public IsSelected!: boolean;

  @IsOptional()
  @IsString()
  public Note?: string;
}
