export class ProductEntity {
  public readonly Id: string;
  public Name: string;
  public Sku: string;
  public Barcode: string | null;
  public CategoryId: string;
  public Unit: string | null;
  public IsActive: boolean;
  public HasSerial: boolean;
  public readonly CreatedAt: Date;
  public UpdatedAt: Date;

  constructor(params: {
    Id: string;
    Name: string;
    Sku: string;
    Barcode?: string | null;
    CategoryId: string;
    Unit?: string | null;
    IsActive?: boolean;
    HasSerial?: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
  }) {
    this.Id = params.Id;
    this.Name = params.Name;
    this.Sku = params.Sku;
    this.Barcode = params.Barcode ?? null;
    this.CategoryId = params.CategoryId;
    this.Unit = params.Unit ?? null;
    this.IsActive = params.IsActive ?? true;
    this.HasSerial = params.HasSerial ?? true;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
  }
}
