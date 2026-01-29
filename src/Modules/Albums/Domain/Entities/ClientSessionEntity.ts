export class ClientSessionEntity {
  public Id: string;
  public AlbumId: string;
  public SessionTokenHash: string;
  public DeviceFingerprint: string | null;
  public CreatedAt: Date;
  public LastSeenAt: Date;
  public ExpiresAt: Date | null;

  constructor(params: {
    Id: string;
    AlbumId: string;
    SessionTokenHash: string;
    DeviceFingerprint?: string | null;
    CreatedAt: Date;
    LastSeenAt: Date;
    ExpiresAt?: Date | null;
  }) {
    this.Id = params.Id;
    this.AlbumId = params.AlbumId;
    this.SessionTokenHash = params.SessionTokenHash;
    this.DeviceFingerprint = params.DeviceFingerprint ?? null;
    this.CreatedAt = params.CreatedAt;
    this.LastSeenAt = params.LastSeenAt;
    this.ExpiresAt = params.ExpiresAt ?? null;
  }
}
