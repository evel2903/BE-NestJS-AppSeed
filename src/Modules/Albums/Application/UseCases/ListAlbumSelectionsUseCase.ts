import { ForbiddenAppException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IPhotoRepository } from '../../Domain/Interfaces/IPhotoRepository';
import { ISelectionRepository } from '../../Domain/Interfaces/ISelectionRepository';
import { SelectionItemDto } from '../DTOs/SelectionItemDto';

export type ListSelectionsQuery = {
  Page?: number;
  PageSize?: number;
};

export class ListAlbumSelectionsUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly selectionRepository: ISelectionRepository,
    private readonly photoRepository: IPhotoRepository,
  ) {}

  public async Execute(ownerUserId: string, albumId: string, query: ListSelectionsQuery) {
    const album = await this.albumRepository.FindById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    if (album.OwnerUserId !== ownerUserId) throw new ForbiddenAppException('Forbidden');

    const { Skip, Take, Page, PageSize } = GetPagination(query);
    const result = await this.selectionRepository.FindByAlbumId(albumId, Skip, Take);
    const driveFileIds = result.Items.map((item) => item.DriveFileId);
    const photos = await this.photoRepository.FindByAlbumAndDriveFileIds(albumId, driveFileIds);
    const photoMap = new Map(photos.map((p) => [p.DriveFileId, p]));

    const items: SelectionItemDto[] = result.Items.map((item) => {
      const photo = photoMap.get(item.DriveFileId);
      return {
        DriveFileId: item.DriveFileId,
        FileName: photo?.FileName ?? null,
        ThumbnailUrl: photo?.ThumbnailUrl ?? null,
        Note: item.Note ?? null,
        SelectedAt: item.CreatedAt,
      };
    });

    return {
      TotalSelected: result.TotalItems,
      Items: ToPagedResult(items, result.TotalItems, Page, PageSize).Items,
    };
  }
}
