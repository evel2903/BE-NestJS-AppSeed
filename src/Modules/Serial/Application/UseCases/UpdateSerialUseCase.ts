import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IStockRepository } from '../../../Stock/Domain/Interfaces/IStockRepository';
import { ISerialRepository } from '../../Domain/Interfaces/ISerialRepository';
import { UpdateSerialDto } from '../DTOs/UpdateSerialDto';
import { SerialDto } from '../DTOs/SerialDto';
import { SerialDtoMapper } from '../Mappers/SerialDtoMapper';

export class UpdateSerialUseCase {
  constructor(
    private readonly serialRepository: ISerialRepository,
    private readonly stockRepository: IStockRepository,
  ) {}

  public async Execute(request: UpdateSerialDto): Promise<SerialDto> {
    const serial = await this.serialRepository.FindById(request.Id);
    if (!serial) {
      throw new NotFoundException('Serial not found');
    }

    if (request.StockId !== undefined) {
      const stock = await this.stockRepository.FindById(request.StockId);
      if (!stock) {
        throw new NotFoundException('Stock not found');
      }
      if (stock.ProductId !== serial.ProductId) {
        throw new NotFoundException('Stock does not belong to product');
      }
      serial.StockId = request.StockId;
    }

    if (request.Status !== undefined) {
      serial.Status = request.Status?.trim() ?? null;
    }

    serial.UpdatedAt = new Date();
    await this.serialRepository.Update(serial);

    const updated = await this.serialRepository.FindById(serial.Id);
    if (!updated) {
      throw new NotFoundException('Serial not found');
    }
    return SerialDtoMapper.ToDto(updated);
  }
}
