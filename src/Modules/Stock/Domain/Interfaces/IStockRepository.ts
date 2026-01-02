import { StockEntity } from '../Entities/StockEntity';

export const STOCK_REPOSITORY = Symbol('IStockRepository');

export interface IStockRepository {
  FindById(id: string): Promise<StockEntity | null>;
  FindByBatchCode(goodsId: string | null, productId: string | null, batchCode: string): Promise<StockEntity | null>;
  Create(stock: StockEntity): Promise<StockEntity>;
  Update(stock: StockEntity): Promise<void>;
  Delete(id: string): Promise<void>;
  List(
    skip: number,
    take: number,
    goodsId?: string,
    productId?: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<{ Items: StockEntity[]; TotalItems: number }>;
}
