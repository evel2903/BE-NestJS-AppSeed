import { GoodsEntity } from '../../Domain/Entities/GoodsEntity';
import { GoodsOrmEntity } from '../Persistence/Entities/GoodsOrmEntity';

export class GoodsOrmMapper {
  public static ToDomain(entity: GoodsOrmEntity): GoodsEntity {
    return new GoodsEntity({
      Id: entity.Id,
      Name: entity.Name,
      Sku: entity.Sku,
      Barcode: entity.Barcode,
      CategoryId: entity.CategoryId,
      Unit: entity.Unit,
      IsActive: entity.IsActive,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: GoodsEntity): GoodsOrmEntity {
    const orm = new GoodsOrmEntity();
    orm.Id = entity.Id;
    orm.Name = entity.Name;
    orm.Sku = entity.Sku;
    orm.Barcode = entity.Barcode;
    orm.CategoryId = entity.CategoryId;
    orm.Unit = entity.Unit;
    orm.IsActive = entity.IsActive;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
