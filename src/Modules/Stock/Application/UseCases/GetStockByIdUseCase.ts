import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IStockRepository } from '../../Domain/Interfaces/IStockRepository';
import { StockDto } from '../DTOs/StockDto';
import { StockDtoMapper } from '../Mappers/StockDtoMapper';

export class GetStockByIdUseCase {
  constructor(private readonly stockRepository: IStockRepository) {}

  public async Execute(id: string): Promise<StockDto> {
    const stock = await this.stockRepository.FindById(id);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }
    return StockDtoMapper.ToDto(stock);
  }
}
