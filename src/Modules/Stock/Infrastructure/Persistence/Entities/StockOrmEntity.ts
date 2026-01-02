import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'stocks' })
@Index(['GoodsId', 'BatchCode'], { unique: true })
@Index(['ProductId', 'BatchCode'], { unique: true })
export class StockOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Column({ type: 'char', length: 36, nullable: true })
  public GoodsId!: string | null;

  @Column({ type: 'char', length: 36, nullable: true })
  public ProductId!: string | null;

  @Column({ type: 'varchar', length: 100 })
  public BatchCode!: string;

  @Column({ type: 'double' })
  public Qty!: number;

  @Column({ type: 'double' })
  public UnitCost!: number;

  @Column({ type: 'datetime' })
  public ReceivedDate!: Date;

  @Column({ type: 'datetime', nullable: true })
  public ExpiredDate!: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public Note!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;
}
