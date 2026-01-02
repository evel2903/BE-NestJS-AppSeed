import { SerialEntity } from '../../Domain/Entities/SerialEntity';
import { SerialDto } from '../DTOs/SerialDto';

export class SerialDtoMapper {
  public static ToDto(serial: SerialEntity): SerialDto {
    return {
      Id: serial.Id,
      ProductId: serial.ProductId,
      StockId: serial.StockId,
      SerialNumber: serial.SerialNumber,
      Status: serial.Status,
      CreatedAt: serial.CreatedAt.toISOString(),
      UpdatedAt: serial.UpdatedAt.toISOString(),
    };
  }
}
