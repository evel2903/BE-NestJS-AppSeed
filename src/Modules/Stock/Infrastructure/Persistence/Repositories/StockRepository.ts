import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockEntity } from '../../../Domain/Entities/StockEntity';
import { IStockRepository } from '../../../Domain/Interfaces/IStockRepository';
import { StockOrmMapper } from '../../Mappers/StockOrmMapper';
import { StockOrmEntity } from '../Entities/StockOrmEntity';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(StockOrmEntity)
    private readonly stocks: Repository<StockOrmEntity>,
  ) {}

  public async FindById(id: string): Promise<StockEntity | null> {
    const entity = await this.stocks.findOne({ where: { Id: id } });
    return entity ? StockOrmMapper.ToDomain(entity) : null;
  }

  public async FindByBatchCode(
    goodsId: string | null,
    productId: string | null,
    batchCode: string,
  ): Promise<StockEntity | null> {
    const normalized = batchCode.trim().toLowerCase();
    const query = this.stocks.createQueryBuilder('stock').where('LOWER(stock.BatchCode) = :batch', {
      batch: normalized,
    });

    if (goodsId) {
      query.andWhere('stock.GoodsId = :goodsId', { goodsId });
    }

    if (productId) {
      query.andWhere('stock.ProductId = :productId', { productId });
    }

    if (!goodsId && !productId) {
      return null;
    }

    const entity = await query.getOne();
    return entity ? StockOrmMapper.ToDomain(entity) : null;
  }

  public async Create(stock: StockEntity): Promise<StockEntity> {
    const created = await this.stocks.save(StockOrmMapper.ToOrm(stock));
    return StockOrmMapper.ToDomain(created);
  }

  public async Update(stock: StockEntity): Promise<void> {
    await this.stocks.save(StockOrmMapper.ToOrm(stock));
  }

  public async Delete(id: string): Promise<void> {
    await this.stocks.delete({ Id: id });
  }

  public async List(
    skip: number,
    take: number,
    goodsId?: string,
    productId?: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<{ Items: StockEntity[]; TotalItems: number }> {
    const query = this.stocks.createQueryBuilder('stock').orderBy('stock.ReceivedDate', 'DESC');

    if (goodsId && goodsId.trim().length > 0) {
      query.andWhere('stock.GoodsId = :goodsId', { goodsId: goodsId.trim() });
    }

    if (productId && productId.trim().length > 0) {
      query.andWhere('stock.ProductId = :productId', { productId: productId.trim() });
    }

    if (fromDate && !Number.isNaN(fromDate.getTime())) {
      query.andWhere('stock.ReceivedDate >= :fromDate', { fromDate });
    }

    if (toDate && !Number.isNaN(toDate.getTime())) {
      query.andWhere('stock.ReceivedDate <= :toDate', { toDate });
    }

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();

    return {
      Items: items.map(StockOrmMapper.ToDomain),
      TotalItems: total,
    };
  }
}
