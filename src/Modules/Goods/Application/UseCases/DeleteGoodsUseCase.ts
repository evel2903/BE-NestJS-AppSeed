import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IGoodsRepository } from '../../Domain/Interfaces/IGoodsRepository';

export class DeleteGoodsUseCase {
  constructor(private readonly goodsRepository: IGoodsRepository) {}

  public async Execute(id: string): Promise<void> {
    const goods = await this.goodsRepository.FindById(id);
    if (!goods) {
      throw new NotFoundException('Goods not found');
    }
    await this.goodsRepository.Delete(id);
  }
}
