import { randomUUID } from 'crypto';
import { BusinessRuleException, NotFoundException, UnauthorizedAppException } from '../../../../Common/Exceptions/AppException';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { SelectionEntity } from '../../Domain/Entities/SelectionEntity';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../Domain/Interfaces/IClientSessionRepository';
import { ISelectionRepository } from '../../Domain/Interfaces/ISelectionRepository';
import { TokenHasher } from '../../Infrastructure/Services/TokenHasher';

export type SetSelectionRequest = {
  PublicId: string;
  GuestToken: string;
  DriveFileId: string;
  IsSelected: boolean;
  Note?: string | null;
};

export class SetSelectionUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly clientSessionRepository: IClientSessionRepository,
    private readonly selectionRepository: ISelectionRepository,
  ) {}

  public async Execute(request: SetSelectionRequest) {
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

    const existing = await this.selectionRepository.FindByAlbumAndDriveFileId(album.Id, request.DriveFileId);

    if (request.IsSelected) {
      if (!existing) {
        const currentCount = await this.selectionRepository.CountByAlbumId(album.Id);
        if (currentCount >= album.MaxSelectable) {
          throw new BusinessRuleException('Max selection exceeded', { Code: 'MAX_SELECTION_EXCEEDED' });
        }

        const selection = new SelectionEntity({
          Id: randomUUID(),
          AlbumId: album.Id,
          DriveFileId: request.DriveFileId,
          ClientSessionId: session.Id,
          Note: request.Note ?? null,
          CreatedAt: new Date(),
        });
        await this.selectionRepository.Create(selection);
      } else {
        existing.Note = request.Note ?? null;
        await this.selectionRepository.Update(existing);
      }
    } else {
      if (existing) {
        await this.selectionRepository.DeleteByAlbumAndDriveFileId(album.Id, request.DriveFileId);
      }
    }

    return { Selected: request.IsSelected };
  }
}
