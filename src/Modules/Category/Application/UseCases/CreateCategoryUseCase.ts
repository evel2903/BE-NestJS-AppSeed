import { randomUUID } from 'crypto';
import { ConflictException } from '../../../../Common/Exceptions/AppException';
import { CategoryEntity } from '../../Domain/Entities/CategoryEntity';
import { ICategoryRepository } from '../../Domain/Interfaces/ICategoryRepository';
import { CreateCategoryDto } from '../DTOs/CreateCategoryDto';
import { CategoryDto } from '../DTOs/CategoryDto';
import { CategoryDtoMapper } from '../Mappers/CategoryDtoMapper';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async Execute(request: CreateCategoryDto): Promise<CategoryDto> {
    const name = request.Name.trim();
    const code = request.Code?.trim() ?? null;
    const description = request.Description?.trim() ?? null;

    const existingByName = await this.categoryRepository.FindByName(name);
    if (existingByName) {
      throw new ConflictException('Category name already exists');
    }

    if (code) {
      const existingByCode = await this.categoryRepository.FindByCode(code);
      if (existingByCode) {
        throw new ConflictException('Category code already exists');
      }
    }

    const now = new Date();
    const category = new CategoryEntity({
      Id: randomUUID(),
      Name: name,
      Code: code,
      Description: description,
      IsActive: request.IsActive ?? true,
      CreatedAt: now,
      UpdatedAt: now,
    });

    const created = await this.categoryRepository.Create(category);
    return CategoryDtoMapper.ToDto(created);
  }
}
