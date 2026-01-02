import { CategoryEntity } from '../Entities/CategoryEntity';

export const CATEGORY_REPOSITORY = Symbol('ICategoryRepository');

export interface ICategoryRepository {
  FindById(id: string): Promise<CategoryEntity | null>;
  FindByName(name: string): Promise<CategoryEntity | null>;
  FindByCode(code: string): Promise<CategoryEntity | null>;
  Create(category: CategoryEntity): Promise<CategoryEntity>;
  Update(category: CategoryEntity): Promise<void>;
  Delete(id: string): Promise<void>;
  List(
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ Items: CategoryEntity[]; TotalItems: number }>;
}
