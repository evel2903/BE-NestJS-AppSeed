export class PhotoEntity {
  public Id: string;
  public AlbumId: string;
  public DriveFileId: string;
  public FileName: string;
  public MimeType: string;
  public ThumbnailUrl: string | null;
  public OrderIndex: number | null;
  public CreatedAt: Date;
  public UpdatedAt: Date;
  public LastSyncedAt: Date;

  constructor(params: {
    Id: string;
    AlbumId: string;
    DriveFileId: string;
    FileName: string;
    MimeType: string;
    ThumbnailUrl?: string | null;
    OrderIndex?: number | null;
    CreatedAt: Date;
    UpdatedAt: Date;
    LastSyncedAt: Date;
  }) {
    this.Id = params.Id;
    this.AlbumId = params.AlbumId;
    this.DriveFileId = params.DriveFileId;
    this.FileName = params.FileName;
    this.MimeType = params.MimeType;
    this.ThumbnailUrl = params.ThumbnailUrl ?? null;
    this.OrderIndex = params.OrderIndex ?? null;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
    this.LastSyncedAt = params.LastSyncedAt;
  }
}
