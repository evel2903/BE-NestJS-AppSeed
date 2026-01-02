import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { IProductRepository } from '../../Domain/Interfaces/IProductRepository';
import { ProductDto } from '../DTOs/ProductDto';
import { ProductDtoMapper } from '../Mappers/ProductDtoMapper';

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async Execute(query: {
    Page?: number;
    PageSize?: number;
    Search?: string;
    CategoryId?: string;
  }): Promise<{
    Items: ProductDto[];
    Meta: { Page: number; PageSize: number; TotalItems: number; TotalPages: number };
  }> {
    const paging = GetPagination({ Page: query.Page, PageSize: query.PageSize });
    const search = (query.Search ?? '').trim();
    const categoryId = (query.CategoryId ?? '').trim();

    const result = await this.productRepository.List(
      paging.Skip,
      paging.Take,
      search.length > 0 ? search : undefined,
      categoryId.length > 0 ? categoryId : undefined,
    );

    return ToPagedResult(result.Items.map(ProductDtoMapper.ToDto), result.TotalItems, paging.Page, paging.PageSize);
  }
}
