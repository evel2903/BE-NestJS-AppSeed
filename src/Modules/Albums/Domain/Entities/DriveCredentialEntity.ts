import { DriveProvider } from '../Enums/DriveProvider';

export class DriveCredentialEntity {
  public Id: string;
  public UserId: string;
  public Provider: DriveProvider;
  public RefreshTokenEnc: string;
  public AccessTokenEnc: string | null;
  public TokenExpiry: Date | null;
  public Scope: string | null;
  public CreatedAt: Date;
  public UpdatedAt: Date;

  constructor(params: {
    Id: string;
    UserId: string;
    Provider: DriveProvider;
    RefreshTokenEnc: string;
    AccessTokenEnc?: string | null;
    TokenExpiry?: Date | null;
    Scope?: string | null;
    CreatedAt: Date;
    UpdatedAt: Date;
  }) {
    this.Id = params.Id;
    this.UserId = params.UserId;
    this.Provider = params.Provider;
    this.RefreshTokenEnc = params.RefreshTokenEnc;
    this.AccessTokenEnc = params.AccessTokenEnc ?? null;
    this.TokenExpiry = params.TokenExpiry ?? null;
    this.Scope = params.Scope ?? null;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
  }
}
