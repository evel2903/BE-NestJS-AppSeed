import { ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../Domain/Interfaces/ICategoryRepository';
import { UpdateCategoryDto } from '../DTOs/UpdateCategoryDto';
import { CategoryDto } from '../DTOs/CategoryDto';
import { CategoryDtoMapper } from '../Mappers/CategoryDtoMapper';

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async Execute(request: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoryRepository.FindById(request.Id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (request.Name !== undefined) {
      const name = request.Name.trim();
      const existingByName = await this.categoryRepository.FindByName(name);
      if (existingByName && existingByName.Id !== category.Id) {
        throw new ConflictException('Category name already exists');
      }
      category.Name = name;
    }

    if (request.Code !== undefined) {
      const code = request.Code?.trim() ?? null;
      if (code) {
        const existingByCode = await this.categoryRepository.FindByCode(code);
        if (existingByCode && existingByCode.Id !== category.Id) {
          throw new ConflictException('Category code already exists');
        }
      }
      category.Code = code;
    }

    if (request.Description !== undefined) {
      category.Description = request.Description?.trim() ?? null;
    }

    if (request.IsActive !== undefined) {
      category.IsActive = request.IsActive;
    }

    category.UpdatedAt = new Date();
    await this.categoryRepository.Update(category);

    const updated = await this.categoryRepository.FindById(category.Id);
    if (!updated) {
      throw new NotFoundException('Category not found');
    }
    return CategoryDtoMapper.ToDto(updated);
  }
}
