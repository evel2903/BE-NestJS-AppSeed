import { randomUUID } from 'crypto';
import { BusinessRuleException, NotFoundException, UnauthorizedAppException } from '../../../../Common/Exceptions/AppException';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { SelectionEntity } from '../../Domain/Entities/SelectionEntity';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../Domain/Interfaces/IClientSessionRepository';
import { ISelectionRepository } from '../../Domain/Interfaces/ISelectionRepository';
import { TokenHasher } from '../../Infrastructure/Services/TokenHasher';

export type BulkSelectionItem = {
  DriveFileId: string;
  IsSelected: boolean;
  Note?: string | null;
};

export type BulkSetSelectionsRequest = {
  PublicId: string;
  GuestToken: string;
  Items: BulkSelectionItem[];
};

export class BulkSetSelectionsUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly clientSessionRepository: IClientSessionRepository,
    private readonly selectionRepository: ISelectionRepository,
  ) {}

  public async Execute(request: BulkSetSelectionsRequest) {
    const album = await this.albumRepository.FindByPublicId(request.PublicId);
    if (!album) throw new NotFoundException('Album not found');

    if (album.Status === AlbumStatus.Closed) {
      throw new BusinessRuleException('Album is closed', { Code: 'ALBUM_CLOSED' });
    }
    if (album.Status === AlbumStatus.Expired || album.IsExpired()) {
      throw new BusinessRuleException('Album is expired', { Code: 'ALBUM_EXPIRED' });
    }

    const session = await this.clientSessionRepository.FindByAlbumId(album.Id);
    if (!session) throw new UnauthorizedAppException('Guest session not found', { Code: 'INVALID_GUEST_TOKEN' });

    const hash = TokenHasher.Hash(request.GuestToken);
    if (hash !== session.SessionTokenHash) {
      throw new UnauthorizedAppException('Invalid guest token', { Code: 'INVALID_GUEST_TOKEN' });
    }

    const driveFileIds = request.Items.map((i) => i.DriveFileId);
    const existing = await this.selectionRepository.FindByAlbumAndDriveFileIds(album.Id, driveFileIds);
    const existingMap = new Map(existing.map((s) => [s.DriveFileId, s]));

    const addItems = request.Items.filter((item) => item.IsSelected && !existingMap.has(item.DriveFileId));
    const removeItems = request.Items.filter((item) => !item.IsSelected && existingMap.has(item.DriveFileId));

    const currentCount = await this.selectionRepository.CountByAlbumId(album.Id);
    if (currentCount + addItems.length > album.MaxSelectable) {
      throw new BusinessRuleException('Max selection exceeded', { Code: 'MAX_SELECTION_EXCEEDED' });
    }

    for (const item of addItems) {
      const selection = new SelectionEntity({
        Id: randomUUID(),
        AlbumId: album.Id,
        DriveFileId: item.DriveFileId,
        ClientSessionId: session.Id,
        Note: item.Note ?? null,
        CreatedAt: new Date(),
      });
      await this.selectionRepository.Create(selection);
    }

    for (const item of request.Items) {
      const selection = existingMap.get(item.DriveFileId);
      if (selection && item.IsSelected) {
        selection.Note = item.Note ?? null;
        await this.selectionRepository.Update(selection);
      }
    }

    for (const item of removeItems) {
      await this.selectionRepository.DeleteByAlbumAndDriveFileId(album.Id, item.DriveFileId);
    }

    return { Updated: request.Items.length };
  }
}
