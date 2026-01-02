import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IProductRepository } from '../../Domain/Interfaces/IProductRepository';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async Execute(id: string): Promise<void> {
    const product = await this.productRepository.FindById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.Delete(id);
  }
}
