import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IProductRepository } from '../../Domain/Interfaces/IProductRepository';
import { ProductDto } from '../DTOs/ProductDto';
import { ProductDtoMapper } from '../Mappers/ProductDtoMapper';

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async Execute(id: string): Promise<ProductDto> {
    const product = await this.productRepository.FindById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return ProductDtoMapper.ToDto(product);
  }
}
