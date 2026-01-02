import { ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ICategoryRepository } from '../../../Category/Domain/Interfaces/ICategoryRepository';
import { IProductRepository } from '../../Domain/Interfaces/IProductRepository';
import { UpdateProductDto } from '../DTOs/UpdateProductDto';
import { ProductDto } from '../DTOs/ProductDto';
import { ProductDtoMapper } from '../Mappers/ProductDtoMapper';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  public async Execute(request: UpdateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.FindById(request.Id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (request.Name !== undefined) {
      product.Name = request.Name.trim();
    }

    if (request.Sku !== undefined) {
      const sku = request.Sku.trim();
      const existingBySku = await this.productRepository.FindBySku(sku);
      if (existingBySku && existingBySku.Id !== product.Id) {
        throw new ConflictException('Product SKU already exists');
      }
      product.Sku = sku;
    }

    if (request.Barcode !== undefined) {
      const barcode = request.Barcode?.trim() ?? null;
      if (barcode) {
        const existingByBarcode = await this.productRepository.FindByBarcode(barcode);
        if (existingByBarcode && existingByBarcode.Id !== product.Id) {
          throw new ConflictException('Product barcode already exists');
        }
      }
      product.Barcode = barcode;
    }

    if (request.CategoryId !== undefined) {
      const category = await this.categoryRepository.FindById(request.CategoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.CategoryId = request.CategoryId;
    }

    if (request.Unit !== undefined) {
      product.Unit = request.Unit?.trim() ?? null;
    }

    if (request.IsActive !== undefined) {
      product.IsActive = request.IsActive;
    }

    if (request.HasSerial !== undefined) {
      product.HasSerial = request.HasSerial;
    }

    product.UpdatedAt = new Date();
    await this.productRepository.Update(product);

    const updated = await this.productRepository.FindById(product.Id);
    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return ProductDtoMapper.ToDto(updated);
  }
}
