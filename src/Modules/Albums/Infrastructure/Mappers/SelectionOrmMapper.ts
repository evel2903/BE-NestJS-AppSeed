import { SelectionEntity } from '../../Domain/Entities/SelectionEntity';
import { SelectionOrmEntity } from '../Persistence/Entities/SelectionOrmEntity';

export class SelectionOrmMapper {
  public static ToDomain(entity: SelectionOrmEntity): SelectionEntity {
    return new SelectionEntity({
      Id: entity.Id,
      AlbumId: entity.AlbumId,
      PhotoId: entity.PhotoId ?? null,
      DriveFileId: entity.DriveFileId,
      ClientSessionId: entity.ClientSessionId,
      Note: entity.Note ?? null,
      CreatedAt: entity.CreatedAt,
    });
  }

  public static ToOrm(entity: SelectionEntity): SelectionOrmEntity {
    const orm = new SelectionOrmEntity();
    orm.Id = entity.Id;
    orm.AlbumId = entity.AlbumId;
    orm.PhotoId = entity.PhotoId ?? null;
    orm.DriveFileId = entity.DriveFileId;
    orm.ClientSessionId = entity.ClientSessionId;
    orm.Note = entity.Note ?? null;
    orm.CreatedAt = entity.CreatedAt;
    return orm;
  }
}
