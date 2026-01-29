import { BusinessRuleException, NotFoundException, UnauthorizedAppException } from '../../../../Common/Exceptions/AppException';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../Domain/Interfaces/IClientSessionRepository';
import { IDriveService } from '../../Domain/Interfaces/IDriveService';
import { ISelectionRepository } from '../../Domain/Interfaces/ISelectionRepository';
import { DrivePhotoDto } from '../DTOs/DrivePhotoDto';
import { TokenHasher } from '../../Infrastructure/Services/TokenHasher';

export class ListPublicAlbumPhotosUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly clientSessionRepository: IClientSessionRepository,
    private readonly selectionRepository: ISelectionRepository,
    private readonly driveService: IDriveService,
  ) {}

  public async Execute(publicId: string, guestToken: string, pageToken?: string | null) {
    const album = await this.albumRepository.FindByPublicId(publicId);
    if (!album) throw new NotFoundException('Album not found');

    if (album.Status === AlbumStatus.Closed) {
      throw new BusinessRuleException('Album is closed', { Code: 'ALBUM_CLOSED' });
    }
    if (album.Status === AlbumStatus.Expired || album.IsExpired()) {
      throw new BusinessRuleException('Album is expired', { Code: 'ALBUM_EXPIRED' });
    }

    const session = await this.clientSessionRepository.FindByAlbumId(album.Id);
    if (!session) throw new UnauthorizedAppException('Guest session not found', { Code: 'INVALID_GUEST_TOKEN' });

    const hash = TokenHasher.Hash(guestToken);
    if (hash !== session.SessionTokenHash) {
      throw new UnauthorizedAppException('Invalid guest token', { Code: 'INVALID_GUEST_TOKEN' });
    }

    session.LastSeenAt = new Date();
    await this.clientSessionRepository.Update(session);

    const driveResult = await this.driveService.ListPhotos(album.DriveFolderId, pageToken);
    const driveFileIds = driveResult.Items.map((item) => item.DriveFileId);
    const selections = await this.selectionRepository.FindByAlbumAndDriveFileIds(album.Id, driveFileIds);
    const selectionMap = new Map(selections.map((s) => [s.DriveFileId, s]));

    const items: DrivePhotoDto[] = driveResult.Items.map((item) => {
      const selection = selectionMap.get(item.DriveFileId);
      return {
        DriveFileId: item.DriveFileId,
        FileName: item.FileName,
        MimeType: item.MimeType,
        ThumbnailUrl: item.ThumbnailUrl ?? null,
        IsSelected: !!selection,
        Note: selection?.Note ?? null,
      };
    });

    return { Items: items, NextPageToken: driveResult.NextPageToken ?? null };
  }
}
