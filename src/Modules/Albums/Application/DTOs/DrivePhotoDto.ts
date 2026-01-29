export type DrivePhotoDto = {
  DriveFileId: string;
  FileName: string;
  MimeType: string;
  ThumbnailUrl?: string | null;
  IsSelected?: boolean;
  Note?: string | null;
};
