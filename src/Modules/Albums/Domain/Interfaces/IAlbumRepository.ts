import { AlbumEntity } from '../Entities/AlbumEntity';
import { AlbumStatus } from '../Enums/AlbumStatus';

export const ALBUM_REPOSITORY = Symbol('IAlbumRepository');

export interface IAlbumRepository {
  Create(album: AlbumEntity): Promise<AlbumEntity>;
  Update(album: AlbumEntity): Promise<void>;
  FindById(id: string): Promise<AlbumEntity | null>;
  FindByPublicId(publicId: string): Promise<AlbumEntity | null>;
  ListByOwner(
    ownerUserId: string,
    skip: number,
    take: number,
    status?: AlbumStatus,
  ): Promise<{ Items: AlbumEntity[]; TotalItems: number }>;
}
