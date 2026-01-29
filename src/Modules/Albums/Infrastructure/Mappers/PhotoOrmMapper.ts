import { PhotoEntity } from '../../Domain/Entities/PhotoEntity';
import { PhotoOrmEntity } from '../Persistence/Entities/PhotoOrmEntity';

export class PhotoOrmMapper {
  public static ToDomain(entity: PhotoOrmEntity): PhotoEntity {
    return new PhotoEntity({
      Id: entity.Id,
      AlbumId: entity.AlbumId,
      DriveFileId: entity.DriveFileId,
      FileName: entity.FileName,
      MimeType: entity.MimeType,
      ThumbnailUrl: entity.ThumbnailUrl,
      OrderIndex: entity.OrderIndex,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
      LastSyncedAt: entity.LastSyncedAt,
    });
  }

  public static ToOrm(entity: PhotoEntity): PhotoOrmEntity {
    const orm = new PhotoOrmEntity();
    orm.Id = entity.Id;
    orm.AlbumId = entity.AlbumId;
    orm.DriveFileId = entity.DriveFileId;
    orm.FileName = entity.FileName;
    orm.MimeType = entity.MimeType;
    orm.ThumbnailUrl = entity.ThumbnailUrl ?? null;
    orm.OrderIndex = entity.OrderIndex ?? null;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    orm.LastSyncedAt = entity.LastSyncedAt;
    return orm;
  }
}
