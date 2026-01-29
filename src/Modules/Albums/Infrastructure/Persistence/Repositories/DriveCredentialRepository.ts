import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriveCredentialEntity } from '../../../Domain/Entities/DriveCredentialEntity';
import { IDriveCredentialRepository } from '../../../Domain/Interfaces/IDriveCredentialRepository';
import { DriveCredentialOrmMapper } from '../../Mappers/DriveCredentialOrmMapper';
import { DriveCredentialOrmEntity } from '../Entities/DriveCredentialOrmEntity';

@Injectable()
export class DriveCredentialRepository implements IDriveCredentialRepository {
  constructor(
    @InjectRepository(DriveCredentialOrmEntity)
    private readonly creds: Repository<DriveCredentialOrmEntity>,
  ) {}

  public async FindByUserId(userId: string): Promise<DriveCredentialEntity | null> {
    const entity = await this.creds.findOne({ where: { UserId: userId } });
    return entity ? DriveCredentialOrmMapper.ToDomain(entity) : null;
  }

  public async Upsert(credential: DriveCredentialEntity): Promise<void> {
    await this.creds.save(DriveCredentialOrmMapper.ToOrm(credential));
  }

  public async DeleteByUserId(userId: string): Promise<void> {
    await this.creds.delete({ UserId: userId });
  }
}
