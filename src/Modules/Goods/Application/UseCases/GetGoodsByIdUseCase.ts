import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IGoodsRepository } from '../../Domain/Interfaces/IGoodsRepository';
import { GoodsDto } from '../DTOs/GoodsDto';
import { GoodsDtoMapper } from '../Mappers/GoodsDtoMapper';

export class GetGoodsByIdUseCase {
  constructor(private readonly goodsRepository: IGoodsRepository) {}

  public async Execute(id: string): Promise<GoodsDto> {
    const goods = await this.goodsRepository.FindById(id);
    if (!goods) {
      throw new NotFoundException('Goods not found');
    }
    return GoodsDtoMapper.ToDto(goods);
  }
}
