import { randomUUID } from 'crypto';
import { BusinessRuleException, ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IGoodsRepository } from '../../../Goods/Domain/Interfaces/IGoodsRepository';
import { IProductRepository } from '../../../Product/Domain/Interfaces/IProductRepository';
import { StockEntity } from '../../Domain/Entities/StockEntity';
import { IStockRepository } from '../../Domain/Interfaces/IStockRepository';
import { CreateStockDto } from '../DTOs/CreateStockDto';
import { StockDto } from '../DTOs/StockDto';
import { StockDtoMapper } from '../Mappers/StockDtoMapper';

const ParseDate = (value: string | Date): Date => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BusinessRuleException('Invalid date');
  }
  return date;
};

export class CreateStockUseCase {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly goodsRepository: IGoodsRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  public async Execute(request: CreateStockDto): Promise<StockDto> {
    const goodsId = request.GoodsId?.trim() ?? null;
    const productId = request.ProductId?.trim() ?? null;

    if ((goodsId && productId) || (!goodsId && !productId)) {
      throw new BusinessRuleException('Stock must have either GoodsId or ProductId');
    }

    if (goodsId) {
      const goods = await this.goodsRepository.FindById(goodsId);
      if (!goods) throw new NotFoundException('Goods not found');
    }

    if (productId) {
      const product = await this.productRepository.FindById(productId);
      if (!product) throw new NotFoundException('Product not found');
    }

    const batchCode = request.BatchCode.trim();
    const existing = await this.stockRepository.FindByBatchCode(goodsId, productId, batchCode);
    if (existing) {
      throw new ConflictException('Batch code already exists');
    }

    const receivedDate = ParseDate(request.ReceivedDate);
    const expiredDate = request.ExpiredDate ? ParseDate(request.ExpiredDate) : null;
    if (expiredDate && expiredDate < receivedDate) {
      throw new BusinessRuleException('ExpiredDate must be after ReceivedDate');
    }

    const now = new Date();
    const stock = new StockEntity({
      Id: randomUUID(),
      GoodsId: goodsId,
      ProductId: productId,
      BatchCode: batchCode,
      Qty: request.Qty,
      UnitCost: request.UnitCost,
      ReceivedDate: receivedDate,
      ExpiredDate: expiredDate,
      Note: request.Note?.trim() ?? null,
      CreatedAt: now,
      UpdatedAt: now,
    });

    const created = await this.stockRepository.Create(stock);
    return StockDtoMapper.ToDto(created);
  }
}
