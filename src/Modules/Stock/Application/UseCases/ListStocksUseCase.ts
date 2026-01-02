import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { IStockRepository } from '../../Domain/Interfaces/IStockRepository';
import { StockDto } from '../DTOs/StockDto';
import { StockDtoMapper } from '../Mappers/StockDtoMapper';

export class ListStocksUseCase {
  constructor(private readonly stockRepository: IStockRepository) {}

  public async Execute(query: {
    Page?: number;
    PageSize?: number;
    GoodsId?: string;
    ProductId?: string;
    FromDate?: string;
    ToDate?: string;
  }): Promise<{
    Items: StockDto[];
    Meta: { Page: number; PageSize: number; TotalItems: number; TotalPages: number };
  }> {
    const paging = GetPagination({ Page: query.Page, PageSize: query.PageSize });
    const goodsId = (query.GoodsId ?? '').trim();
    const productId = (query.ProductId ?? '').trim();
    const fromDate = query.FromDate ? new Date(query.FromDate) : undefined;
    const toDate = query.ToDate ? new Date(query.ToDate) : undefined;

    const result = await this.stockRepository.List(
      paging.Skip,
      paging.Take,
      goodsId.length > 0 ? goodsId : undefined,
      productId.length > 0 ? productId : undefined,
      fromDate,
      toDate,
    );

    return ToPagedResult(result.Items.map(StockDtoMapper.ToDto), result.TotalItems, paging.Page, paging.PageSize);
  }
}
