import { ProductEntity } from '../../Domain/Entities/ProductEntity';
import { ProductOrmEntity } from '../Persistence/Entities/ProductOrmEntity';

export class ProductOrmMapper {
  public static ToDomain(entity: ProductOrmEntity): ProductEntity {
    return new ProductEntity({
      Id: entity.Id,
      Name: entity.Name,
      Sku: entity.Sku,
      Barcode: entity.Barcode,
      CategoryId: entity.CategoryId,
      Unit: entity.Unit,
      IsActive: entity.IsActive,
      HasSerial: entity.HasSerial,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: ProductEntity): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.Id = entity.Id;
    orm.Name = entity.Name;
    orm.Sku = entity.Sku;
    orm.Barcode = entity.Barcode;
    orm.CategoryId = entity.CategoryId;
    orm.Unit = entity.Unit;
    orm.IsActive = entity.IsActive;
    orm.HasSerial = entity.HasSerial;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
