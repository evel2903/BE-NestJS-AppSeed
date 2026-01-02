import { ProductEntity } from '../../Domain/Entities/ProductEntity';
import { ProductDto } from '../DTOs/ProductDto';

export class ProductDtoMapper {
  public static ToDto(product: ProductEntity): ProductDto {
    return {
      Id: product.Id,
      Name: product.Name,
      Sku: product.Sku,
      Barcode: product.Barcode,
      CategoryId: product.CategoryId,
      Unit: product.Unit,
      IsActive: product.IsActive,
      HasSerial: product.HasSerial,
      CreatedAt: product.CreatedAt.toISOString(),
      UpdatedAt: product.UpdatedAt.toISOString(),
    };
  }
}
