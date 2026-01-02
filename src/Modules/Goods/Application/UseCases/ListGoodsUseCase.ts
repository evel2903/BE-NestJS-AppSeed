import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { IGoodsRepository } from '../../Domain/Interfaces/IGoodsRepository';
import { GoodsDto } from '../DTOs/GoodsDto';
import { GoodsDtoMapper } from '../Mappers/GoodsDtoMapper';

export class ListGoodsUseCase {
  constructor(private readonly goodsRepository: IGoodsRepository) {}

  public async Execute(query: {
    Page?: number;
    PageSize?: number;
    Search?: string;
    CategoryId?: string;
  }): Promise<{
    Items: GoodsDto[];
    Meta: { Page: number; PageSize: number; TotalItems: number; TotalPages: number };
  }> {
    const paging = GetPagination({ Page: query.Page, PageSize: query.PageSize });
    const search = (query.Search ?? '').trim();
    const categoryId = (query.CategoryId ?? '').trim();

    const result = await this.goodsRepository.List(
      paging.Skip,
      paging.Take,
      search.length > 0 ? search : undefined,
      categoryId.length > 0 ? categoryId : undefined,
    );

    return ToPagedResult(result.Items.map(GoodsDtoMapper.ToDto), result.TotalItems, paging.Page, paging.PageSize);
  }
}
