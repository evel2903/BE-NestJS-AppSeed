import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'photos' })
@Index(['AlbumId', 'DriveFileId'], { unique: true })
export class PhotoOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Index()
  @Column({ type: 'char', length: 36 })
  public AlbumId!: string;

  @Column({ type: 'varchar', length: 128 })
  public DriveFileId!: string;

  @Column({ type: 'varchar', length: 255 })
  public FileName!: string;

  @Column({ type: 'varchar', length: 100 })
  public MimeType!: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  public ThumbnailUrl!: string | null;

  @Column({ type: 'int', nullable: true })
  public OrderIndex!: number | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;

  @Column({ type: 'datetime' })
  public LastSyncedAt!: Date;
}
