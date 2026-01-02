import { StockEntity } from '../../Domain/Entities/StockEntity';
import { StockOrmEntity } from '../Persistence/Entities/StockOrmEntity';

export class StockOrmMapper {
  public static ToDomain(entity: StockOrmEntity): StockEntity {
    return new StockEntity({
      Id: entity.Id,
      GoodsId: entity.GoodsId,
      ProductId: entity.ProductId,
      BatchCode: entity.BatchCode,
      Qty: entity.Qty,
      UnitCost: entity.UnitCost,
      ReceivedDate: entity.ReceivedDate,
      ExpiredDate: entity.ExpiredDate,
      Note: entity.Note,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: StockEntity): StockOrmEntity {
    const orm = new StockOrmEntity();
    orm.Id = entity.Id;
    orm.GoodsId = entity.GoodsId;
    orm.ProductId = entity.ProductId;
    orm.BatchCode = entity.BatchCode;
    orm.Qty = entity.Qty;
    orm.UnitCost = entity.UnitCost;
    orm.ReceivedDate = entity.ReceivedDate;
    orm.ExpiredDate = entity.ExpiredDate;
    orm.Note = entity.Note;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
