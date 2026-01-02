import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'serials' })
@Index(['ProductId', 'SerialNumber'], { unique: true })
export class SerialOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Column({ type: 'char', length: 36 })
  public ProductId!: string;

  @Column({ type: 'char', length: 36 })
  public StockId!: string;

  @Column({ type: 'varchar', length: 100 })
  public SerialNumber!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public Status!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;
}
