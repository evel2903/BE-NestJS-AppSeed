import { StockEntity } from '../../Domain/Entities/StockEntity';
import { StockDto } from '../DTOs/StockDto';

export class StockDtoMapper {
  public static ToDto(stock: StockEntity): StockDto {
    return {
      Id: stock.Id,
      GoodsId: stock.GoodsId,
      ProductId: stock.ProductId,
      BatchCode: stock.BatchCode,
      Qty: stock.Qty,
      UnitCost: stock.UnitCost,
      ReceivedDate: stock.ReceivedDate.toISOString(),
      ExpiredDate: stock.ExpiredDate ? stock.ExpiredDate.toISOString() : null,
      Note: stock.Note,
      CreatedAt: stock.CreatedAt.toISOString(),
      UpdatedAt: stock.UpdatedAt.toISOString(),
    };
  }
}
