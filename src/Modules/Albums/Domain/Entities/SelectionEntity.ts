export class SelectionEntity {
  public Id: string;
  public AlbumId: string;
  public PhotoId: string | null;
  public DriveFileId: string;
  public ClientSessionId: string;
  public Note: string | null;
  public CreatedAt: Date;

  constructor(params: {
    Id: string;
    AlbumId: string;
    PhotoId?: string | null;
    DriveFileId: string;
    ClientSessionId: string;
    Note?: string | null;
    CreatedAt: Date;
  }) {
    this.Id = params.Id;
    this.AlbumId = params.AlbumId;
    this.PhotoId = params.PhotoId ?? null;
    this.DriveFileId = params.DriveFileId;
    this.ClientSessionId = params.ClientSessionId;
    this.Note = params.Note ?? null;
    this.CreatedAt = params.CreatedAt;
  }
}
