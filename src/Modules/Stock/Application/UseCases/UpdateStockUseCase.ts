import { BusinessRuleException, ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IStockRepository } from '../../Domain/Interfaces/IStockRepository';
import { UpdateStockDto } from '../DTOs/UpdateStockDto';
import { StockDto } from '../DTOs/StockDto';
import { StockDtoMapper } from '../Mappers/StockDtoMapper';

const ParseDate = (value: string | Date): Date => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BusinessRuleException('Invalid date');
  }
  return date;
};

export class UpdateStockUseCase {
  constructor(private readonly stockRepository: IStockRepository) {}

  public async Execute(request: UpdateStockDto): Promise<StockDto> {
    const stock = await this.stockRepository.FindById(request.Id);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    if (request.BatchCode !== undefined) {
      const batchCode = request.BatchCode.trim();
      const existing = await this.stockRepository.FindByBatchCode(stock.GoodsId, stock.ProductId, batchCode);
      if (existing && existing.Id !== stock.Id) {
        throw new ConflictException('Batch code already exists');
      }
      stock.BatchCode = batchCode;
    }

    if (request.Qty !== undefined) {
      stock.Qty = request.Qty;
    }

    if (request.UnitCost !== undefined) {
      stock.UnitCost = request.UnitCost;
    }

    if (request.ReceivedDate !== undefined) {
      stock.ReceivedDate = ParseDate(request.ReceivedDate);
    }

    if (request.ExpiredDate !== undefined) {
      stock.ExpiredDate = request.ExpiredDate ? ParseDate(request.ExpiredDate) : null;
    }

    if (request.ExpiredDate !== undefined || request.ReceivedDate !== undefined) {
      if (stock.ExpiredDate && stock.ExpiredDate < stock.ReceivedDate) {
        throw new BusinessRuleException('ExpiredDate must be after ReceivedDate');
      }
    }

    if (request.Note !== undefined) {
      stock.Note = request.Note?.trim() ?? null;
    }

    stock.UpdatedAt = new Date();
    await this.stockRepository.Update(stock);

    const updated = await this.stockRepository.FindById(stock.Id);
    if (!updated) {
      throw new NotFoundException('Stock not found');
    }
    return StockDtoMapper.ToDto(updated);
  }
}
