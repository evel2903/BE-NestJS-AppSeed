import { randomUUID } from 'crypto';
import { BusinessRuleException } from '../../../../Common/Exceptions/AppException';
import { DriveCredentialEntity } from '../../Domain/Entities/DriveCredentialEntity';
import { DriveProvider } from '../../Domain/Enums/DriveProvider';
import { IDriveCredentialRepository } from '../../Domain/Interfaces/IDriveCredentialRepository';
import { IDriveService } from '../../Domain/Interfaces/IDriveService';

export class DriveCallbackUseCase {
  constructor(
    private readonly driveService: IDriveService,
    private readonly credentialRepository: IDriveCredentialRepository,
  ) {}

  public async Execute(userId: string, code: string): Promise<{ Connected: boolean }> {
    const token = await this.driveService.ExchangeCodeForToken(code);
    if (!token.RefreshToken) {
      throw new BusinessRuleException('Missing refresh token', { Code: 'DRIVE_TOKEN_MISSING' });
    }

    const now = new Date();
    const credential = new DriveCredentialEntity({
      Id: randomUUID(),
      UserId: userId,
      Provider: DriveProvider.GoogleDrive,
      RefreshTokenEnc: token.RefreshToken,
      AccessTokenEnc: token.AccessToken,
      TokenExpiry: token.ExpiryDate,
      Scope: token.Scope,
      CreatedAt: now,
      UpdatedAt: now,
    });

    await this.credentialRepository.Upsert(credential);
    return { Connected: true };
  }
}
