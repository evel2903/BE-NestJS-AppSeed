import { randomUUID } from 'crypto';
import { ConflictException, NotFoundException } from '../../../../Common/Exceptions/AppException';
import { IProductRepository } from '../../../Product/Domain/Interfaces/IProductRepository';
import { IStockRepository } from '../../../Stock/Domain/Interfaces/IStockRepository';
import { SerialEntity } from '../../Domain/Entities/SerialEntity';
import { ISerialRepository } from '../../Domain/Interfaces/ISerialRepository';
import { CreateSerialDto } from '../DTOs/CreateSerialDto';
import { SerialDto } from '../DTOs/SerialDto';
import { SerialDtoMapper } from '../Mappers/SerialDtoMapper';

export class CreateSerialUseCase {
  constructor(
    private readonly serialRepository: ISerialRepository,
    private readonly productRepository: IProductRepository,
    private readonly stockRepository: IStockRepository,
  ) {}

  public async Execute(request: CreateSerialDto): Promise<SerialDto> {
    const product = await this.productRepository.FindById(request.ProductId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const stock = await this.stockRepository.FindById(request.StockId);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    if (stock.ProductId !== product.Id) {
      throw new NotFoundException('Stock does not belong to product');
    }

    const serialNumber = request.SerialNumber.trim();
    const existing = await this.serialRepository.FindBySerial(product.Id, serialNumber);
    if (existing) {
      throw new ConflictException('Serial number already exists');
    }

    const now = new Date();
    const serial = new SerialEntity({
      Id: randomUUID(),
      ProductId: product.Id,
      StockId: stock.Id,
      SerialNumber: serialNumber,
      Status: request.Status?.trim() ?? null,
      CreatedAt: now,
      UpdatedAt: now,
    });

    const created = await this.serialRepository.Create(serial);
    return SerialDtoMapper.ToDto(created);
  }
}
