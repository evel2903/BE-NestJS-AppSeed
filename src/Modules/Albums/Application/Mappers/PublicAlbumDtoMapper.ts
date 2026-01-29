import { AlbumEntity } from '../../Domain/Entities/AlbumEntity';
import { PublicAlbumDto } from '../DTOs/PublicAlbumDto';

export class PublicAlbumDtoMapper {
  public static ToDto(entity: AlbumEntity): PublicAlbumDto {
    return {
      Id: entity.Id,
      Name: entity.Name,
      MaxSelectable: entity.MaxSelectable,
      ExpiredAt: entity.ExpiredAt,
    };
  }
}
