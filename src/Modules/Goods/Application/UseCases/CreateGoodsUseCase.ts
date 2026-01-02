import { randomUUID } from 'crypto';
import { ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../../Category/Domain/Interfaces/ICategoryRepository';
import { GoodsEntity } from '../../Domain/Entities/GoodsEntity';
import { IGoodsRepository } from '../../Domain/Interfaces/IGoodsRepository';
import { CreateGoodsDto } from '../DTOs/CreateGoodsDto';
import { GoodsDto } from '../DTOs/GoodsDto';
import { GoodsDtoMapper } from '../Mappers/GoodsDtoMapper';

export class CreateGoodsUseCase {
  constructor(
    private readonly goodsRepository: IGoodsRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async Execute(request: CreateGoodsDto): Promise<GoodsDto> {
    const name = request.Name.trim();
    const sku = request.Sku.trim();
    const barcode = request.Barcode?.trim() ?? null;

    const category = await this.categoryRepository.FindById(request.CategoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existingBySku = await this.goodsRepository.FindBySku(sku);
    if (existingBySku) {
      throw new ConflictException('Goods SKU already exists');
    }

    if (barcode) {
      const existingByBarcode = await this.goodsRepository.FindByBarcode(barcode);
      if (existingByBarcode) {
        throw new ConflictException('Goods barcode already exists');
      }
    }

    const now = new Date();
    const goods = new GoodsEntity({
      Id: randomUUID(),
      Name: name,
      Sku: sku,
      Barcode: barcode,
      CategoryId: request.CategoryId,
      Unit: request.Unit?.trim() ?? null,
      IsActive: request.IsActive ?? true,
      CreatedAt: now,
      UpdatedAt: now,
    });

    const created = await this.goodsRepository.Create(goods);
    return GoodsDtoMapper.ToDto(created);
  }
}
