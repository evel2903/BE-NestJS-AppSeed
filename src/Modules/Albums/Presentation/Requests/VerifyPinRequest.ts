import { IsString, Matches } from 'class-validator';

export class VerifyPinRequest {
  @IsString()
  @Matches(/^\d{4,8}$/)
  public Pin!: string;
}
