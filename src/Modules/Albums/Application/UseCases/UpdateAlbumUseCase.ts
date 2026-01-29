import * as bcrypt from 'bcryptjs';
import { ForbiddenAppException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { UpdateAlbumDto } from '../DTOs/UpdateAlbumDto';
import { AlbumDto } from '../DTOs/AlbumDto';
import { AlbumDtoMapper } from '../Mappers/AlbumDtoMapper';

export class UpdateAlbumUseCase {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  public async Execute(request: UpdateAlbumDto): Promise<AlbumDto> {
    const album = await this.albumRepository.FindById(request.Id);
    if (!album) throw new NotFoundException('Album not found');
    if (album.OwnerUserId !== request.OwnerUserId) throw new ForbiddenAppException('Forbidden');

    if (request.Name !== undefined) album.Name = request.Name;
    if (request.Pin !== undefined) album.PinHash = await bcrypt.hash(request.Pin, 10);
    if (request.MaxSelectable !== undefined) album.MaxSelectable = request.MaxSelectable;
    if (request.ExpiredAt !== undefined) album.ExpiredAt = request.ExpiredAt;
    if (request.Status !== undefined) album.Status = request.Status as AlbumStatus;
    album.UpdatedAt = new Date();

    await this.albumRepository.Update(album);
    return AlbumDtoMapper.ToDto(album);
  }
}
