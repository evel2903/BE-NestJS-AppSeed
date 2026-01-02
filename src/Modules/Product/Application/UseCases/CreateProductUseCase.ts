import { randomUUID } from 'crypto';
import { ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../../Category/Domain/Interfaces/ICategoryRepository';
import { ProductEntity } from '../../Domain/Entities/ProductEntity';
import { IProductRepository } from '../../Domain/Interfaces/IProductRepository';
import { CreateProductDto } from '../DTOs/CreateProductDto';
import { ProductDto } from '../DTOs/ProductDto';
import { ProductDtoMapper } from '../Mappers/ProductDtoMapper';

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async Execute(request: CreateProductDto): Promise<ProductDto> {
    const name = request.Name.trim();
    const sku = request.Sku.trim();
    const barcode = request.Barcode?.trim() ?? null;

    const category = await this.categoryRepository.FindById(request.CategoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existingBySku = await this.productRepository.FindBySku(sku);
    if (existingBySku) {
      throw new ConflictException('Product SKU already exists');
    }

    if (barcode) {
      const existingByBarcode = await this.productRepository.FindByBarcode(barcode);
      if (existingByBarcode) {
        throw new ConflictException('Product barcode already exists');
      }
    }

    const now = new Date();
    const product = new ProductEntity({
      Id: randomUUID(),
      Name: name,
      Sku: sku,
      Barcode: barcode,
      CategoryId: request.CategoryId,
      Unit: request.Unit?.trim() ?? null,
      IsActive: request.IsActive ?? true,
      HasSerial: request.HasSerial ?? true,
      CreatedAt: now,
      UpdatedAt: now,
    });

    const created = await this.productRepository.Create(product);
    return ProductDtoMapper.ToDto(created);
  }
}
