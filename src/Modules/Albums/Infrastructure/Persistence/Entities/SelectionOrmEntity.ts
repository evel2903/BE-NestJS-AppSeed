import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'selections' })
@Index(['AlbumId', 'DriveFileId'], { unique: true })
export class SelectionOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Index()
  @Column({ type: 'char', length: 36 })
  public AlbumId!: string;

  @Column({ type: 'char', length: 36, nullable: true })
  public PhotoId!: string | null;

  @Column({ type: 'varchar', length: 128 })
  public DriveFileId!: string;

  @Index()
  @Column({ type: 'char', length: 36 })
  public ClientSessionId!: string;

  @Column({ type: 'text', nullable: true })
  public Note!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;
}
