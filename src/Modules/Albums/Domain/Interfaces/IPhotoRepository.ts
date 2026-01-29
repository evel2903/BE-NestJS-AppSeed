import { PhotoEntity } from '../Entities/PhotoEntity';

export const PHOTO_REPOSITORY = Symbol('IPhotoRepository');

export interface IPhotoRepository {
  UpsertMany(photos: PhotoEntity[]): Promise<void>;
  FindByAlbumAndDriveFileIds(albumId: string, driveFileIds: string[]): Promise<PhotoEntity[]>;
}
