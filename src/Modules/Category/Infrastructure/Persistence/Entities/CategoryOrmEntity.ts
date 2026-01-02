import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryOrmEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  public Id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  public Name!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  public Code!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public Description!: string | null;

  @Column({ type: 'boolean', default: true })
  public IsActive!: boolean;

  @CreateDateColumn({ type: 'datetime' })
  public CreatedAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public UpdatedAt!: Date;
}
