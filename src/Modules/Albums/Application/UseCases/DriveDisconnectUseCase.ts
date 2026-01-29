import { IDriveCredentialRepository } from '../../Domain/Interfaces/IDriveCredentialRepository';

export class DriveDisconnectUseCase {
  constructor(private readonly credentialRepository: IDriveCredentialRepository) {}

  public async Execute(userId: string): Promise<{ Disconnected: boolean }> {
    await this.credentialRepository.DeleteByUserId(userId);
    return { Disconnected: true };
  }
}
