import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SerialEntity } from '../../../Domain/Entities/SerialEntity';
import { ISerialRepository } from '../../../Domain/Interfaces/ISerialRepository';
import { SerialOrmMapper } from '../../Mappers/SerialOrmMapper';
import { SerialOrmEntity } from '../Entities/SerialOrmEntity';

@Injectable()
export class SerialRepository implements ISerialRepository {
  constructor(
    @InjectRepository(SerialOrmEntity)
    private readonly serials: Repository<SerialOrmEntity>,
  ) {}

  public async FindById(id: string): Promise<SerialEntity | null> {
    const entity = await this.serials.findOne({ where: { Id: id } });
    return entity ? SerialOrmMapper.ToDomain(entity) : null;
  }

  public async FindBySerial(productId: string, serialNumber: string): Promise<SerialEntity | null> {
    const normalized = serialNumber.trim().toLowerCase();
    const entity = await this.serials
      .createQueryBuilder('serial')
      .where('serial.ProductId = :productId', { productId })
      .andWhere('LOWER(serial.SerialNumber) = :serialNumber', { serialNumber: normalized })
      .getOne();
    return entity ? SerialOrmMapper.ToDomain(entity) : null;
  }

  public async Create(serial: SerialEntity): Promise<SerialEntity> {
    const created = await this.serials.save(SerialOrmMapper.ToOrm(serial));
    return SerialOrmMapper.ToDomain(created);
  }

  public async Update(serial: SerialEntity): Promise<void> {
    await this.serials.save(SerialOrmMapper.ToOrm(serial));
  }

  public async Delete(id: string): Promise<void> {
    await this.serials.delete({ Id: id });
  }

  public async List(
    skip: number,
    take: number,
    productId?: string,
    stockId?: string,
    status?: string,
  ): Promise<{ Items: SerialEntity[]; TotalItems: number }> {
    const query = this.serials.createQueryBuilder('serial').orderBy('serial.CreatedAt', 'DESC');

    if (productId && productId.trim().length > 0) {
      query.andWhere('serial.ProductId = :productId', { productId: productId.trim() });
    }

    if (stockId && stockId.trim().length > 0) {
      query.andWhere('serial.StockId = :stockId', { stockId: stockId.trim() });
    }

    if (status && status.trim().length > 0) {
      query.andWhere('serial.Status = :status', { status: status.trim() });
    }

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();

    return {
      Items: items.map(SerialOrmMapper.ToDomain),
      TotalItems: total,
    };
  }
}
