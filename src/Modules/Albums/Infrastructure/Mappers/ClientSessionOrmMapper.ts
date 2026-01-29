import { ClientSessionEntity } from '../../Domain/Entities/ClientSessionEntity';
import { ClientSessionOrmEntity } from '../Persistence/Entities/ClientSessionOrmEntity';

export class ClientSessionOrmMapper {
  public static ToDomain(entity: ClientSessionOrmEntity): ClientSessionEntity {
    return new ClientSessionEntity({
      Id: entity.Id,
      AlbumId: entity.AlbumId,
      SessionTokenHash: entity.SessionTokenHash,
      DeviceFingerprint: entity.DeviceFingerprint ?? null,
      CreatedAt: entity.CreatedAt,
      LastSeenAt: entity.LastSeenAt,
      ExpiresAt: entity.ExpiresAt ?? null,
    });
  }

  public static ToOrm(entity: ClientSessionEntity): ClientSessionOrmEntity {
    const orm = new ClientSessionOrmEntity();
    orm.Id = entity.Id;
    orm.AlbumId = entity.AlbumId;
    orm.SessionTokenHash = entity.SessionTokenHash;
    orm.DeviceFingerprint = entity.DeviceFingerprint ?? null;
    orm.CreatedAt = entity.CreatedAt;
    orm.LastSeenAt = entity.LastSeenAt;
    orm.ExpiresAt = entity.ExpiresAt ?? null;
    return orm;
  }
}
