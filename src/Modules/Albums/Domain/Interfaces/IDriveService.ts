export type DrivePhotoItem = {
  DriveFileId: string;
  FileName: string;
  MimeType: string;
  ThumbnailUrl?: string | null;
};

export type DriveListResult = {
  Items: DrivePhotoItem[];
  NextPageToken?: string | null;
};

export type DriveTokenResult = {
  AccessToken: string;
  RefreshToken: string | null;
  Scope: string | null;
  ExpiryDate: Date | null;
};

export const DRIVE_SERVICE = Symbol('IDriveService');

export interface IDriveService {
  BuildAuthUrl(): string;
  ExchangeCodeForToken(code: string): Promise<DriveTokenResult>;
  ResolveFolderIdFromUrl(url: string): string | null;
  ListPhotos(folderId: string, pageToken?: string | null): Promise<DriveListResult>;
}
