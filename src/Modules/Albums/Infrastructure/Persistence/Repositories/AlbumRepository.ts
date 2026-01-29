import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../../../Domain/Entities/AlbumEntity';
import { AlbumStatus } from '../../../Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../../Domain/Interfaces/IAlbumRepository';
import { AlbumOrmMapper } from '../../Mappers/AlbumOrmMapper';
import { AlbumOrmEntity } from '../Entities/AlbumOrmEntity';

@Injectable()
export class AlbumRepository implements IAlbumRepository {
  constructor(
    @InjectRepository(AlbumOrmEntity)
    private readonly albums: Repository<AlbumOrmEntity>,
  ) {}

  public async Create(album: AlbumEntity): Promise<AlbumEntity> {
    const created = await this.albums.save(AlbumOrmMapper.ToOrm(album));
    return AlbumOrmMapper.ToDomain(created);
  }

  public async Update(album: AlbumEntity): Promise<void> {
    await this.albums.save(AlbumOrmMapper.ToOrm(album));
  }

  public async FindById(id: string): Promise<AlbumEntity | null> {
    const entity = await this.albums.findOne({ where: { Id: id } });
    return entity ? AlbumOrmMapper.ToDomain(entity) : null;
  }

  public async FindByPublicId(publicId: string): Promise<AlbumEntity | null> {
    const entity = await this.albums.findOne({ where: { PublicId: publicId } });
    return entity ? AlbumOrmMapper.ToDomain(entity) : null;
  }

  public async ListByOwner(
    ownerUserId: string,
    skip: number,
    take: number,
    status?: AlbumStatus,
  ): Promise<{ Items: AlbumEntity[]; TotalItems: number }> {
    const where = status ? { OwnerUserId: ownerUserId, Status: status } : { OwnerUserId: ownerUserId };
    const [items, total] = await this.albums.findAndCount({
      where,
      order: { CreatedAt: 'DESC' },
      skip,
      take,
    });

    return { Items: items.map(AlbumOrmMapper.ToDomain), TotalItems: total };
  }
}
