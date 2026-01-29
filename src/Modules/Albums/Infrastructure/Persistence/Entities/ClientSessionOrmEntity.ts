import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'client_sessions' })
export class ClientSessionOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Index({ unique: true })
  @Column({ type: 'char', length: 36 })
  public AlbumId!: string;

  @Column({ type: 'varchar', length: 255 })
  public SessionTokenHash!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public DeviceFingerprint!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public LastSeenAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  public ExpiresAt!: Date | null;
}
