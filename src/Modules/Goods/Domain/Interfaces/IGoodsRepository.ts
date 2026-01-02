import { GoodsEntity } from '../Entities/GoodsEntity';

export const GOODS_REPOSITORY = Symbol('IGoodsRepository');

export interface IGoodsRepository {
  FindById(id: string): Promise<GoodsEntity | null>;
  FindBySku(sku: string): Promise<GoodsEntity | null>;
  FindByBarcode(barcode: string): Promise<GoodsEntity | null>;
  Create(goods: GoodsEntity): Promise<GoodsEntity>;
  Update(goods: GoodsEntity): Promise<void>;
  Delete(id: string): Promise<void>;
  List(
    skip: number,
    take: number,
    search?: string,
    categoryId?: string,
  ): Promise<{ Items: GoodsEntity[]; TotalItems: number }>;
}
