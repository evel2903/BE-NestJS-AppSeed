import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'drive_credentials' })
export class DriveCredentialOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Index()
  @Column({ type: 'char', length: 36 })
  public UserId!: string;

  @Column({ type: 'varchar', length: 50 })
  public Provider!: string;

  @Column({ type: 'text' })
  public RefreshTokenEnc!: string;

  @Column({ type: 'text', nullable: true })
  public AccessTokenEnc!: string | null;

  @Column({ type: 'datetime', nullable: true })
  public TokenExpiry!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public Scope!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;
}
