import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../Domain/Interfaces/ICategoryRepository';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async Execute(id: string): Promise<void> {
    const category = await this.categoryRepository.FindById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.Delete(id);
  }
}
