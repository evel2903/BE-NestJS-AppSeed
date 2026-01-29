import { ForbiddenAppException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { AlbumDto } from '../DTOs/AlbumDto';
import { AlbumDtoMapper } from '../Mappers/AlbumDtoMapper';

export class GetAlbumUseCase {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  public async Execute(ownerUserId: string, albumId: string): Promise<AlbumDto> {
    const album = await this.albumRepository.FindById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    if (album.OwnerUserId !== ownerUserId) throw new ForbiddenAppException('Forbidden');
    return AlbumDtoMapper.ToDto(album);
  }
}
