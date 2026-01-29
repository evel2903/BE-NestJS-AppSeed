export type CreateAlbumDto = {
  OwnerUserId: string;
  Name: string;
  DriveFolderUrl: string;
  Pin: string;
  MaxSelectable: number;
  ExpiredAt?: Date | null;
};
