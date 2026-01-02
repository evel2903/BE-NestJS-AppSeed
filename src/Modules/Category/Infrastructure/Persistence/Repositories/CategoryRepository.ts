import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../Domain/Entities/CategoryEntity';
import { ICategoryRepository } from '../../../Domain/Interfaces/ICategoryRepository';
import { CategoryOrmMapper } from '../../Mappers/CategoryOrmMapper';
import { CategoryOrmEntity } from '../Entities/CategoryOrmEntity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly categories: Repository<CategoryOrmEntity>,
  ) {}

  public async FindById(id: string): Promise<CategoryEntity | null> {
    const entity = await this.categories.findOne({ where: { Id: id } });
    return entity ? CategoryOrmMapper.ToDomain(entity) : null;
  }

  public async FindByName(name: string): Promise<CategoryEntity | null> {
    const normalized = name.trim().toLowerCase();
    const entity = await this.categories
      .createQueryBuilder('category')
      .where('LOWER(category.Name) = :name', { name: normalized })
      .getOne();
    return entity ? CategoryOrmMapper.ToDomain(entity) : null;
  }

  public async FindByCode(code: string): Promise<CategoryEntity | null> {
    const normalized = code.trim().toLowerCase();
    const entity = await this.categories
      .createQueryBuilder('category')
      .where('LOWER(category.Code) = :code', { code: normalized })
      .getOne();
    return entity ? CategoryOrmMapper.ToDomain(entity) : null;
  }

  public async Create(category: CategoryEntity): Promise<CategoryEntity> {
    const created = await this.categories.save(CategoryOrmMapper.ToOrm(category));
    return CategoryOrmMapper.ToDomain(created);
  }

  public async Update(category: CategoryEntity): Promise<void> {
    await this.categories.save(CategoryOrmMapper.ToOrm(category));
  }

  public async Delete(id: string): Promise<void> {
    await this.categories.delete({ Id: id });
  }

  public async List(
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ Items: CategoryEntity[]; TotalItems: number }> {
    const query = this.categories.createQueryBuilder('category').orderBy('category.CreatedAt', 'DESC');

    if (search && search.trim().length > 0) {
      const term = `%${search.trim().toLowerCase()}%`;
      query.andWhere('(LOWER(category.Name) LIKE :term OR LOWER(category.Code) LIKE :term)', { term });
    }

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();

    return {
      Items: items.map(CategoryOrmMapper.ToDomain),
      TotalItems: total,
    };
  }
}
