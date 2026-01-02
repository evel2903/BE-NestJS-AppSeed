import { SerialEntity } from '../../Domain/Entities/SerialEntity';
import { SerialOrmEntity } from '../Persistence/Entities/SerialOrmEntity';

export class SerialOrmMapper {
  public static ToDomain(entity: SerialOrmEntity): SerialEntity {
    return new SerialEntity({
      Id: entity.Id,
      ProductId: entity.ProductId,
      StockId: entity.StockId,
      SerialNumber: entity.SerialNumber,
      Status: entity.Status,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: SerialEntity): SerialOrmEntity {
    const orm = new SerialOrmEntity();
    orm.Id = entity.Id;
    orm.ProductId = entity.ProductId;
    orm.StockId = entity.StockId;
    orm.SerialNumber = entity.SerialNumber;
    orm.Status = entity.Status;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
