import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';

export type UpdateAlbumDto = {
  Id: string;
  OwnerUserId: string;
  Name?: string;
  Pin?: string;
  MaxSelectable?: number;
  ExpiredAt?: Date | null;
  Status?: AlbumStatus;
};
