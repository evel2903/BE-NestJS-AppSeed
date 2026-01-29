import { AlbumStatus } from '../Enums/AlbumStatus';

export class AlbumEntity {
  public Id: string;
  public OwnerUserId: string;
  public Name: string;
  public PublicId: string;
  public DriveFolderUrl: string;
  public DriveFolderId: string;
  public PinHash: string;
  public MaxSelectable: number;
  public Status: AlbumStatus;
  public ExpiredAt: Date | null;
  public CreatedAt: Date;
  public UpdatedAt: Date;

  constructor(params: {
    Id: string;
    OwnerUserId: string;
    Name: string;
    PublicId: string;
    DriveFolderUrl: string;
    DriveFolderId: string;
    PinHash: string;
    MaxSelectable: number;
    Status: AlbumStatus;
    ExpiredAt?: Date | null;
    CreatedAt: Date;
    UpdatedAt: Date;
  }) {
    this.Id = params.Id;
    this.OwnerUserId = params.OwnerUserId;
    this.Name = params.Name;
    this.PublicId = params.PublicId;
    this.DriveFolderUrl = params.DriveFolderUrl;
    this.DriveFolderId = params.DriveFolderId;
    this.PinHash = params.PinHash;
    this.MaxSelectable = params.MaxSelectable;
    this.Status = params.Status;
    this.ExpiredAt = params.ExpiredAt ?? null;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
  }

  public IsExpired(now: Date = new Date()): boolean {
    return this.ExpiredAt !== null && this.ExpiredAt.getTime() <= now.getTime();
  }
}
