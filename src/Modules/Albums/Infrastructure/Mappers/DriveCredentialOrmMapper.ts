import { DriveCredentialEntity } from '../../Domain/Entities/DriveCredentialEntity';
import { DriveProvider } from '../../Domain/Enums/DriveProvider';
import { DriveCredentialOrmEntity } from '../Persistence/Entities/DriveCredentialOrmEntity';

export class DriveCredentialOrmMapper {
  public static ToDomain(entity: DriveCredentialOrmEntity): DriveCredentialEntity {
    return new DriveCredentialEntity({
      Id: entity.Id,
      UserId: entity.UserId,
      Provider: entity.Provider as DriveProvider,
      RefreshTokenEnc: entity.RefreshTokenEnc,
      AccessTokenEnc: entity.AccessTokenEnc ?? null,
      TokenExpiry: entity.TokenExpiry ?? null,
      Scope: entity.Scope ?? null,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: DriveCredentialEntity): DriveCredentialOrmEntity {
    const orm = new DriveCredentialOrmEntity();
    orm.Id = entity.Id;
    orm.UserId = entity.UserId;
    orm.Provider = entity.Provider;
    orm.RefreshTokenEnc = entity.RefreshTokenEnc;
    orm.AccessTokenEnc = entity.AccessTokenEnc ?? null;
    orm.TokenExpiry = entity.TokenExpiry ?? null;
    orm.Scope = entity.Scope ?? null;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
