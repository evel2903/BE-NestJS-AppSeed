import { SelectionEntity } from '../Entities/SelectionEntity';

export const SELECTION_REPOSITORY = Symbol('ISelectionRepository');

export interface ISelectionRepository {
  FindByAlbumId(albumId: string, skip: number, take: number): Promise<{ Items: SelectionEntity[]; TotalItems: number }>;
  FindByAlbumAndDriveFileIds(albumId: string, driveFileIds: string[]): Promise<SelectionEntity[]>;
  FindByAlbumAndDriveFileId(albumId: string, driveFileId: string): Promise<SelectionEntity | null>;
  CountByAlbumId(albumId: string): Promise<number>;
  Create(selection: SelectionEntity): Promise<void>;
  Update(selection: SelectionEntity): Promise<void>;
  DeleteByAlbumAndDriveFileId(albumId: string, driveFileId: string): Promise<void>;
}
