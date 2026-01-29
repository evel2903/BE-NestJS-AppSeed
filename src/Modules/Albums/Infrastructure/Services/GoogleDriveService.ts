import { BusinessRuleException } from '../../../../Common/Exceptions/AppException';
import { DriveListResult, DriveTokenResult, IDriveService } from '../../Domain/Interfaces/IDriveService';

export class GoogleDriveService implements IDriveService {
  public BuildAuthUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const scope = process.env.GOOGLE_SCOPE ?? 'https://www.googleapis.com/auth/drive.readonly';

    if (!clientId || !redirectUri) {
      throw new BusinessRuleException('Google Drive OAuth is not configured', { Code: 'DRIVE_NOT_CONFIGURED' });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  public async ExchangeCodeForToken(code: string): Promise<DriveTokenResult> {
    void code;
    throw new BusinessRuleException('Google Drive token exchange not implemented', { Code: 'DRIVE_NOT_IMPLEMENTED' });
  }

  public ResolveFolderIdFromUrl(url: string): string | null {
    const match = url.match(`/\\/folders\\/([a-zA-Z0-9_-]+)/`);
    if (match?.[1]) return match[1];

    const idParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParam?.[1]) return idParam[1];

    return null;
  }

  public async ListPhotos(folderId: string, pageToken?: string | null): Promise<DriveListResult> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new BusinessRuleException('Google Drive API key is not configured', { Code: 'DRIVE_NOT_CONNECTED' });
    }

    const query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    const params = new URLSearchParams({
      q: query,
      fields: 'nextPageToken,files(id,name,mimeType,thumbnailLink)',
      pageSize: '100',
      key: apiKey,
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    });

    if (pageToken) params.set('pageToken', pageToken);

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
    if (!response.ok) {
      const body = await response.text();
      throw new BusinessRuleException('Drive folder not accessible', {
        Code: 'DRIVE_FOLDER_NOT_ACCESSIBLE',
        Details: body,
      });
    }

    const data = (await response.json()) as {
      nextPageToken?: string;
      files?: { id: string; name: string; mimeType: string; thumbnailLink?: string }[];
    };

    return {
      Items:
        data.files?.map((file) => ({
          DriveFileId: file.id,
          FileName: file.name,
          MimeType: file.mimeType,
          ThumbnailUrl: file.thumbnailLink ?? null,
        })) ?? [],
      NextPageToken: data.nextPageToken ?? null,
    };
  }
}
