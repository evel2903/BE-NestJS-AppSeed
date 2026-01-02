import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ISerialRepository } from '../../Domain/Interfaces/ISerialRepository';
import { SerialDto } from '../DTOs/SerialDto';
import { SerialDtoMapper } from '../Mappers/SerialDtoMapper';

export class GetSerialByIdUseCase {
  constructor(private readonly serialRepository: ISerialRepository) {}

  public async Execute(id: string): Promise<SerialDto> {
    const serial = await this.serialRepository.FindById(id);
    if (!serial) {
      throw new NotFoundException('Serial not found');
    }
    return SerialDtoMapper.ToDto(serial);
  }
}
