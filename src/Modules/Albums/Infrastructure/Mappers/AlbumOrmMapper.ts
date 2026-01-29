import { AlbumEntity } from '../../Domain/Entities/AlbumEntity';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { AlbumOrmEntity } from '../Persistence/Entities/AlbumOrmEntity';

export class AlbumOrmMapper {
  public static ToDomain(entity: AlbumOrmEntity): AlbumEntity {
    return new AlbumEntity({
      Id: entity.Id,
      OwnerUserId: entity.OwnerUserId,
      Name: entity.Name,
      PublicId: entity.PublicId,
      DriveFolderUrl: entity.DriveFolderUrl,
      DriveFolderId: entity.DriveFolderId,
      PinHash: entity.PinHash,
      MaxSelectable: entity.MaxSelectable,
      Status: entity.Status as AlbumStatus,
      ExpiredAt: entity.ExpiredAt ?? null,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: AlbumEntity): AlbumOrmEntity {
    const orm = new AlbumOrmEntity();
    orm.Id = entity.Id;
    orm.OwnerUserId = entity.OwnerUserId;
    orm.Name = entity.Name;
    orm.PublicId = entity.PublicId;
    orm.DriveFolderUrl = entity.DriveFolderUrl;
    orm.DriveFolderId = entity.DriveFolderId;
    orm.PinHash = entity.PinHash;
    orm.MaxSelectable = entity.MaxSelectable;
    orm.Status = entity.Status;
    orm.ExpiredAt = entity.ExpiredAt ?? null;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
