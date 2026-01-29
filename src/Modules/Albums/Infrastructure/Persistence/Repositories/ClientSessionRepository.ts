import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientSessionEntity } from '../../../Domain/Entities/ClientSessionEntity';
import { IClientSessionRepository } from '../../../Domain/Interfaces/IClientSessionRepository';
import { ClientSessionOrmMapper } from '../../Mappers/ClientSessionOrmMapper';
import { ClientSessionOrmEntity } from '../Entities/ClientSessionOrmEntity';

@Injectable()
export class ClientSessionRepository implements IClientSessionRepository {
  constructor(
    @InjectRepository(ClientSessionOrmEntity)
    private readonly sessions: Repository<ClientSessionOrmEntity>,
  ) {}

  public async FindByAlbumId(albumId: string): Promise<ClientSessionEntity | null> {
    const entity = await this.sessions.findOne({ where: { AlbumId: albumId } });
    return entity ? ClientSessionOrmMapper.ToDomain(entity) : null;
  }

  public async Create(session: ClientSessionEntity): Promise<void> {
    await this.sessions.save(ClientSessionOrmMapper.ToOrm(session));
  }

  public async Update(session: ClientSessionEntity): Promise<void> {
    await this.sessions.save(ClientSessionOrmMapper.ToOrm(session));
  }
}
