import { IDriveService } from '../../Domain/Interfaces/IDriveService';

export class GetDriveAuthUrlUseCase {
  constructor(private readonly driveService: IDriveService) {}

  public Execute(): { AuthUrl: string } {
    return { AuthUrl: this.driveService.BuildAuthUrl() };
  }
}
