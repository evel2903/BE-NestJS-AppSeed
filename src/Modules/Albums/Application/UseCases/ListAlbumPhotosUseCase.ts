import { ForbiddenAppException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IDriveService } from '../../Domain/Interfaces/IDriveService';

export class ListAlbumPhotosUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly driveService: IDriveService,
  ) {}

  public async Execute(ownerUserId: string, albumId: string, pageToken?: string | null) {
    const album = await this.albumRepository.FindById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    if (album.OwnerUserId !== ownerUserId) throw new ForbiddenAppException('Forbidden');

    return await this.driveService.ListPhotos(album.DriveFolderId, pageToken);
  }
}
