import { ProductEntity } from '../Entities/ProductEntity';

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');

export interface IProductRepository {
  FindById(id: string): Promise<ProductEntity | null>;
  FindBySku(sku: string): Promise<ProductEntity | null>;
  FindByBarcode(barcode: string): Promise<ProductEntity | null>;
  Create(product: ProductEntity): Promise<ProductEntity>;
  Update(product: ProductEntity): Promise<void>;
  Delete(id: string): Promise<void>;
  List(
    skip: number,
    take: number,
    search?: string,
    categoryId?: string,
  ): Promise<{ Items: ProductEntity[]; TotalItems: number }>;
}
