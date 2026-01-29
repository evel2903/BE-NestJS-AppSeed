import { AlbumEntity } from '../../Domain/Entities/AlbumEntity';
import { AlbumDto } from '../DTOs/AlbumDto';

export class AlbumDtoMapper {
  public static ToDto(entity: AlbumEntity): AlbumDto {
    return {
      Id: entity.Id,
      PublicId: entity.PublicId,
      Name: entity.Name,
      DriveFolderUrl: entity.DriveFolderUrl,
      DriveFolderId: entity.DriveFolderId,
      Status: entity.Status,
      MaxSelectable: entity.MaxSelectable,
      ExpiredAt: entity.ExpiredAt,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    };
  }
}
