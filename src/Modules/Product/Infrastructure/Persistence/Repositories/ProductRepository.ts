import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../Domain/Entities/ProductEntity';
import { IProductRepository } from '../../../Domain/Interfaces/IProductRepository';
import { ProductOrmMapper } from '../../Mappers/ProductOrmMapper';
import { ProductOrmEntity } from '../Entities/ProductOrmEntity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly products: Repository<ProductOrmEntity>,
  ) {}

  public async FindById(id: string): Promise<ProductEntity | null> {
    const entity = await this.products.findOne({ where: { Id: id } });
    return entity ? ProductOrmMapper.ToDomain(entity) : null;
  }

  public async FindBySku(sku: string): Promise<ProductEntity | null> {
    const normalized = sku.trim().toLowerCase();
    const entity = await this.products
      .createQueryBuilder('product')
      .where('LOWER(product.Sku) = :sku', { sku: normalized })
      .getOne();
    return entity ? ProductOrmMapper.ToDomain(entity) : null;
  }

  public async FindByBarcode(barcode: string): Promise<ProductEntity | null> {
    const normalized = barcode.trim().toLowerCase();
    const entity = await this.products
      .createQueryBuilder('product')
      .where('LOWER(product.Barcode) = :barcode', { barcode: normalized })
      .getOne();
    return entity ? ProductOrmMapper.ToDomain(entity) : null;
  }

  public async Create(product: ProductEntity): Promise<ProductEntity> {
    const created = await this.products.save(ProductOrmMapper.ToOrm(product));
    return ProductOrmMapper.ToDomain(created);
  }

  public async Update(product: ProductEntity): Promise<void> {
    await this.products.save(ProductOrmMapper.ToOrm(product));
  }

  public async Delete(id: string): Promise<void> {
    await this.products.delete({ Id: id });
  }

  public async List(
    skip: number,
    take: number,
    search?: string,
    categoryId?: string,
  ): Promise<{ Items: ProductEntity[]; TotalItems: number }> {
    const query = this.products.createQueryBuilder('product').orderBy('product.CreatedAt', 'DESC');

    if (search && search.trim().length > 0) {
      const term = `%${search.trim().toLowerCase()}%`;
      query.andWhere(
        '(LOWER(product.Name) LIKE :term OR LOWER(product.Sku) LIKE :term OR LOWER(product.Barcode) LIKE :term)',
        { term },
      );
    }

    if (categoryId && categoryId.trim().length > 0) {
      query.andWhere('product.CategoryId = :categoryId', { categoryId: categoryId.trim() });
    }

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();

    return {
      Items: items.map(ProductOrmMapper.ToDomain),
      TotalItems: total,
    };
  }
}
