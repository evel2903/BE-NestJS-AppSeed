import { NotFoundException } from '../../../../Common/Exceptions/AppException';
import { ISerialRepository } from '../../Domain/Interfaces/ISerialRepository';

export class DeleteSerialUseCase {
  constructor(private readonly serialRepository: ISerialRepository) {}

  public async Execute(id: string): Promise<void> {
    const serial = await this.serialRepository.FindById(id);
    if (!serial) {
      throw new NotFoundException('Serial not found');
    }
    await this.serialRepository.Delete(id);
  }
}
