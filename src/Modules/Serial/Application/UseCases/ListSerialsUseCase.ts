import { GetPagination, ToPagedResult } from '../../../../Common/Helpers/Pagination';
import { ISerialRepository } from '../../Domain/Interfaces/ISerialRepository';
import { SerialDto } from '../DTOs/SerialDto';
import { SerialDtoMapper } from '../Mappers/SerialDtoMapper';

export class ListSerialsUseCase {
  constructor(private readonly serialRepository: ISerialRepository) {}

  public async Execute(query: {
    Page?: number;
    PageSize?: number;
    ProductId?: string;
    StockId?: string;
    Status?: string;
  }): Promise<{
    Items: SerialDto[];
    Meta: { Page: number; PageSize: number; TotalItems: number; TotalPages: number };
  }> {
    const paging = GetPagination({ Page: query.Page, PageSize: query.PageSize });
    const productId = (query.ProductId ?? '').trim();
    const stockId = (query.StockId ?? '').trim();
    const status = (query.Status ?? '').trim();

    const result = await this.serialRepository.List(
      paging.Skip,
      paging.Take,
      productId.length > 0 ? productId : undefined,
      stockId.length > 0 ? stockId : undefined,
      status.length > 0 ? status : undefined,
    );

    return ToPagedResult(result.Items.map(SerialDtoMapper.ToDto), result.TotalItems, paging.Page, paging.PageSize);
  }
}
