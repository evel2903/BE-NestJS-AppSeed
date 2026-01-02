import { SerialEntity } from '../Entities/SerialEntity';

export const SERIAL_REPOSITORY = Symbol('ISerialRepository');

export interface ISerialRepository {
  FindById(id: string): Promise<SerialEntity | null>;
  FindBySerial(productId: string, serialNumber: string): Promise<SerialEntity | null>;
  Create(serial: SerialEntity): Promise<SerialEntity>;
  Update(serial: SerialEntity): Promise<void>;
  Delete(id: string): Promise<void>;
  List(
    skip: number,
    take: number,
    productId?: string,
    stockId?: string,
    status?: string,
  ): Promise<{ Items: SerialEntity[]; TotalItems: number }>;
}
