import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IStockRepository } from '../../Domain/Interfaces/IStockRepository';

export class DeleteStockUseCase {
  constructor(private readonly stockRepository: IStockRepository) {}

  public async Execute(id: string): Promise<void> {
    const stock = await this.stockRepository.FindById(id);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }
    await this.stockRepository.Delete(id);
  }
}
