import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsEntity } from '../../../Domain/Entities/GoodsEntity';
import { IGoodsRepository } from '../../../Domain/Interfaces/IGoodsRepository';
import { GoodsOrmMapper } from '../../Mappers/GoodsOrmMapper';
import { GoodsOrmEntity } from '../Entities/GoodsOrmEntity';

@Injectable()
export class GoodsRepository implements IGoodsRepository {
  constructor(
    @InjectRepository(GoodsOrmEntity)
    private readonly goods: Repository<GoodsOrmEntity>,
  ) {}

  public async FindById(id: string): Promise<GoodsEntity | null> {
    const entity = await this.goods.findOne({ where: { Id: id } });
    return entity ? GoodsOrmMapper.ToDomain(entity) : null;
  }

  public async FindBySku(sku: string): Promise<GoodsEntity | null> {
    const normalized = sku.trim().toLowerCase();
    const entity = await this.goods
      .createQueryBuilder('goods')
      .where('LOWER(goods.Sku) = :sku', { sku: normalized })
      .getOne();
    return entity ? GoodsOrmMapper.ToDomain(entity) : null;
  }

  public async FindByBarcode(barcode: string): Promise<GoodsEntity | null> {
    const normalized = barcode.trim().toLowerCase();
    const entity = await this.goods
      .createQueryBuilder('goods')
      .where('LOWER(goods.Barcode) = :barcode', { barcode: normalized })
      .getOne();
    return entity ? GoodsOrmMapper.ToDomain(entity) : null;
  }

  public async Create(goods: GoodsEntity): Promise<GoodsEntity> {
    const created = await this.goods.save(GoodsOrmMapper.ToOrm(goods));
    return GoodsOrmMapper.ToDomain(created);
  }

  public async Update(goods: GoodsEntity): Promise<void> {
    await this.goods.save(GoodsOrmMapper.ToOrm(goods));
  }

  public async Delete(id: string): Promise<void> {
    await this.goods.delete({ Id: id });
  }

  public async List(
    skip: number,
    take: number,
    search?: string,
    categoryId?: string,
  ): Promise<{ Items: GoodsEntity[]; TotalItems: number }> {
    const query = this.goods.createQueryBuilder('goods').orderBy('goods.CreatedAt', 'DESC');

    if (search && search.trim().length > 0) {
      const term = `%${search.trim().toLowerCase()}%`;
      query.andWhere(
        '(LOWER(goods.Name) LIKE :term OR LOWER(goods.Sku) LIKE :term OR LOWER(goods.Barcode) LIKE :term)',
        { term },
      );
    }

    if (categoryId && categoryId.trim().length > 0) {
      query.andWhere('goods.CategoryId = :categoryId', { categoryId: categoryId.trim() });
    }

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();

    return {
      Items: items.map(GoodsOrmMapper.ToDomain),
      TotalItems: total,
    };
  }
}
