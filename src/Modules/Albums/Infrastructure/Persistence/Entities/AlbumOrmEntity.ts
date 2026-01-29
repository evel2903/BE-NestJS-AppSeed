import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'albums' })
export class AlbumOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Index()
  @Column({ type: 'char', length: 36 })
  public OwnerUserId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 32 })
  public PublicId!: string;

  @Column({ type: 'varchar', length: 255 })
  public Name!: string;

  @Column({ type: 'varchar', length: 1024 })
  public DriveFolderUrl!: string;

  @Column({ type: 'varchar', length: 128 })
  public DriveFolderId!: string;

  @Column({ type: 'varchar', length: 255 })
  public PinHash!: string;

  @Column({ type: 'int' })
  public MaxSelectable!: number;

  @Column({ type: 'varchar', length: 20 })
  public Status!: string;

  @Column({ type: 'datetime', nullable: true })
  public ExpiredAt!: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;
}
