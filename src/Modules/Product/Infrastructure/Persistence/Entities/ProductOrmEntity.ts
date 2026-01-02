import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Column({ type: 'varchar', length: 200 })
  public Name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  public Sku!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  public Barcode!: string | null;

  @Column({ type: 'char', length: 36 })
  public CategoryId!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public Unit!: string | null;

  @Column({ type: 'boolean', default: true })
  public IsActive!: boolean;

  @Column({ type: 'boolean', default: true })
  public HasSerial!: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;
}
