import { CategoryEntity } from '../../Domain/Entities/CategoryEntity';
import { CategoryOrmEntity } from '../Persistence/Entities/CategoryOrmEntity';

export class CategoryOrmMapper {
  public static ToDomain(entity: CategoryOrmEntity): CategoryEntity {
    return new CategoryEntity({
      Id: entity.Id,
      Name: entity.Name,
      Code: entity.Code,
      Description: entity.Description,
      IsActive: entity.IsActive,
      CreatedAt: entity.CreatedAt,
      UpdatedAt: entity.UpdatedAt,
    });
  }

  public static ToOrm(entity: CategoryEntity): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    orm.Id = entity.Id;
    orm.Name = entity.Name;
    orm.Code = entity.Code;
    orm.Description = entity.Description;
    orm.IsActive = entity.IsActive;
    orm.CreatedAt = entity.CreatedAt;
    orm.UpdatedAt = entity.UpdatedAt;
    return orm;
  }
}
