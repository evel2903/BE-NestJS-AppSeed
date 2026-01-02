import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { ICategoryRepository } from '../../Domain/Interfaces/ICategoryRepository';
import { CategoryDto } from '../DTOs/CategoryDto';
import { CategoryDtoMapper } from '../Mappers/CategoryDtoMapper';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  public async Execute(query: { Page?: number; PageSize?: number; Search?: string }): Promise<{
    Items: CategoryDto[];
    Meta: { Page: number; PageSize: number; TotalItems: number; TotalPages: number };
  }> {
    const paging = GetPagination({ Page: query.Page, PageSize: query.PageSize });
    const search = (query.Search ?? '').trim();

    const result = await this.categoryRepository.List(
      paging.Skip,
      paging.Take,
      search.length > 0 ? search : undefined,
    );

    return ToPagedResult(result.Items.map(CategoryDtoMapper.ToDto), result.TotalItems, paging.Page, paging.PageSize);
  }
}
