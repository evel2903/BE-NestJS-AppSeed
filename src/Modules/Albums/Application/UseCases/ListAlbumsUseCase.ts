import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { AlbumDto } from '../DTOs/AlbumDto';
import { AlbumDtoMapper } from '../Mappers/AlbumDtoMapper';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';

export type ListAlbumsQuery = {
  Page?: number;
  PageSize?: number;
  Status?: AlbumStatus;
};

export class ListAlbumsUseCase {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  public async Execute(ownerUserId: string, query: ListAlbumsQuery) {
    const { Skip, Take, Page, PageSize } = GetPagination(query);
    const result = await this.albumRepository.ListByOwner(ownerUserId, Skip, Take, query.Status);
    const items: AlbumDto[] = result.Items.map(AlbumDtoMapper.ToDto);
    return ToPagedResult(items, result.TotalItems, Page, PageSize);
  }
}
