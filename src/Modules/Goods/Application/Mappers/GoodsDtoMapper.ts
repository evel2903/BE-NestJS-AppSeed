import { GoodsEntity } from '../../Domain/Entities/GoodsEntity';
import { GoodsDto } from '../DTOs/GoodsDto';

export class GoodsDtoMapper {
  public static ToDto(goods: GoodsEntity): GoodsDto {
    return {
      Id: goods.Id,
      Name: goods.Name,
      Sku: goods.Sku,
      Barcode: goods.Barcode,
      CategoryId: goods.CategoryId,
      Unit: goods.Unit,
      IsActive: goods.IsActive,
      CreatedAt: goods.CreatedAt.toISOString(),
      UpdatedAt: goods.UpdatedAt.toISOString(),
    };
  }
}
