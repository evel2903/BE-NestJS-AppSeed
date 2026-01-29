import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';

export type AlbumDto = {
  Id: string;
  PublicId: string;
  Name: string;
  DriveFolderUrl: string;
  DriveFolderId: string;
  Status: AlbumStatus;
  MaxSelectable: number;
  ExpiredAt: Date | null;
  CreatedAt: Date;
  UpdatedAt: Date;
};
