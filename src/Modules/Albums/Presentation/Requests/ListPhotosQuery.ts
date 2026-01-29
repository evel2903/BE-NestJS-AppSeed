import { IsOptional, IsString } from 'class-validator';

export class ListPhotosQuery {
  @IsOptional()
  @IsString()
  public PageToken?: string;
}
