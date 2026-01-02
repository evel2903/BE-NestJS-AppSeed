import { CategoryEntity } from '../../Domain/Entities/CategoryEntity';
import { CategoryDto } from '../DTOs/CategoryDto';

export class CategoryDtoMapper {
  public static ToDto(category: CategoryEntity): CategoryDto {
    return {
      Id: category.Id,
      Name: category.Name,
      Code: category.Code,
      Description: category.Description,
      IsActive: category.IsActive,
      CreatedAt: category.CreatedAt.toISOString(),
      UpdatedAt: category.UpdatedAt.toISOString(),
    };
  }
}
