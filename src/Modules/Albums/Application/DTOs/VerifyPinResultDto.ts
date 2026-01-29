import { PublicAlbumDto } from './PublicAlbumDto';

export type VerifyPinResultDto = {
  GuestToken: string;
  Album: PublicAlbumDto;
};
