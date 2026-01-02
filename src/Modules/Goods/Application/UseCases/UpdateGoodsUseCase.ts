import { ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../../Category/Domain/Interfaces/ICategoryRepository';
import { IGoodsRepository } from '../../Domain/Interfaces/IGoodsRepository';
import { UpdateGoodsDto } from '../DTOs/UpdateGoodsDto';
import { GoodsDto } from '../DTOs/GoodsDto';
import { GoodsDtoMapper } from '../Mappers/GoodsDtoMapper';

export class UpdateGoodsUseCase {
  constructor(
    private readonly goodsRepository: IGoodsRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async Execute(request: UpdateGoodsDto): Promise<GoodsDto> {
    const goods = await this.goodsRepository.FindById(request.Id);
    if (!goods) {
      throw new NotFoundException('Goods not found');
    }

    if (request.Name !== undefined) {
      goods.Name = request.Name.trim();
    }

    if (request.Sku !== undefined) {
      const sku = request.Sku.trim();
      const existingBySku = await this.goodsRepository.FindBySku(sku);
      if (existingBySku && existingBySku.Id !== goods.Id) {
        throw new ConflictException('Goods SKU already exists');
      }
      goods.Sku = sku;
    }

    if (request.Barcode !== undefined) {
      const barcode = request.Barcode?.trim() ?? null;
      if (barcode) {
        const existingByBarcode = await this.goodsRepository.FindByBarcode(barcode);
        if (existingByBarcode && existingByBarcode.Id !== goods.Id) {
          throw new ConflictException('Goods barcode already exists');
        }
      }
      goods.Barcode = barcode;
    }

    if (request.CategoryId !== undefined) {
      const category = await this.categoryRepository.FindById(request.CategoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      goods.CategoryId = request.CategoryId;
    }

    if (request.Unit !== undefined) {
      goods.Unit = request.Unit?.trim() ?? null;
    }

    if (request.IsActive !== undefined) {
      goods.IsActive = request.IsActive;
    }

    goods.UpdatedAt = new Date();
    await this.goodsRepository.Update(goods);

    const updated = await this.goodsRepository.FindById(goods.Id);
    if (!updated) {
      throw new NotFoundException('Goods not found');
    }
    return GoodsDtoMapper.ToDto(updated);
  }
}
