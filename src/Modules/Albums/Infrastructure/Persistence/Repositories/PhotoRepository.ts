import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PhotoEntity } from '../../../Domain/Entities/PhotoEntity';
import { IPhotoRepository } from '../../../Domain/Interfaces/IPhotoRepository';
import { PhotoOrmMapper } from '../../Mappers/PhotoOrmMapper';
import { PhotoOrmEntity } from '../Entities/PhotoOrmEntity';

@Injectable()
export class PhotoRepository implements IPhotoRepository {
  constructor(
    @InjectRepository(PhotoOrmEntity)
    private readonly photos: Repository<PhotoOrmEntity>,
  ) {}

  public async UpsertMany(photos: PhotoEntity[]): Promise<void> {
    if (photos.length === 0) return;
    const ormItems = photos.map(PhotoOrmMapper.ToOrm);
    await this.photos.save(ormItems);
  }

  public async FindByAlbumAndDriveFileIds(albumId: string, driveFileIds: string[]): Promise<PhotoEntity[]> {
    if (driveFileIds.length === 0) return [];
    const items = await this.photos.find({
      where: { AlbumId: albumId, DriveFileId: In(driveFileIds) },
    });
    return items.map(PhotoOrmMapper.ToDomain);
  }
}
