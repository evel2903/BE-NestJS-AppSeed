import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SelectionEntity } from '../../../Domain/Entities/SelectionEntity';
import { ISelectionRepository } from '../../../Domain/Interfaces/ISelectionRepository';
import { SelectionOrmMapper } from '../../Mappers/SelectionOrmMapper';
import { SelectionOrmEntity } from '../Entities/SelectionOrmEntity';

@Injectable()
export class SelectionRepository implements ISelectionRepository {
  constructor(
    @InjectRepository(SelectionOrmEntity)
    private readonly selections: Repository<SelectionOrmEntity>,
  ) {}

  public async FindByAlbumId(
    albumId: string,
    skip: number,
    take: number,
  ): Promise<{ Items: SelectionEntity[]; TotalItems: number }> {
    const [items, total] = await this.selections.findAndCount({
      where: { AlbumId: albumId },
      order: { CreatedAt: 'DESC' },
      skip,
      take,
    });
    return { Items: items.map(SelectionOrmMapper.ToDomain), TotalItems: total };
  }

  public async FindByAlbumAndDriveFileIds(albumId: string, driveFileIds: string[]): Promise<SelectionEntity[]> {
    if (driveFileIds.length === 0) return [];
    const items = await this.selections.find({
      where: { AlbumId: albumId, DriveFileId: In(driveFileIds) },
    });
    return items.map(SelectionOrmMapper.ToDomain);
  }

  public async FindByAlbumAndDriveFileId(albumId: string, driveFileId: string): Promise<SelectionEntity | null> {
    const entity = await this.selections.findOne({ where: { AlbumId: albumId, DriveFileId: driveFileId } });
    return entity ? SelectionOrmMapper.ToDomain(entity) : null;
  }

  public async CountByAlbumId(albumId: string): Promise<number> {
    return await this.selections.count({ where: { AlbumId: albumId } });
  }

  public async Create(selection: SelectionEntity): Promise<void> {
    await this.selections.save(SelectionOrmMapper.ToOrm(selection));
  }

  public async Update(selection: SelectionEntity): Promise<void> {
    await this.selections.save(SelectionOrmMapper.ToOrm(selection));
  }

  public async DeleteByAlbumAndDriveFileId(albumId: string, driveFileId: string): Promise<void> {
    await this.selections.delete({ AlbumId: albumId, DriveFileId: driveFileId });
  }
}
