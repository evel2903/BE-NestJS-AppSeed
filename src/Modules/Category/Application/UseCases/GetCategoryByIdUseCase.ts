import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../Domain/Interfaces/ICategoryRepository';
import { CategoryDto } from '../DTOs/CategoryDto';
import { CategoryDtoMapper } from '../Mappers/CategoryDtoMapper';

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async Execute(id: string): Promise<CategoryDto> {
    const category = await this.categoryRepository.FindById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return CategoryDtoMapper.ToDto(category);
  }
}
