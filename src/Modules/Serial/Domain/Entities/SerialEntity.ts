export class SerialEntity {
  public readonly Id: string;
  public ProductId: string;
  public StockId: string;
  public SerialNumber: string;
  public Status: string | null;
  public readonly CreatedAt: Date;
  public UpdatedAt: Date;

  constructor(params: {
    Id: string;
    ProductId: string;
    StockId: string;
    SerialNumber: string;
    Status?: string | null;
    CreatedAt: Date;
    UpdatedAt: Date;
  }) {
    this.Id = params.Id;
    this.ProductId = params.ProductId;
    this.StockId = params.StockId;
    this.SerialNumber = params.SerialNumber;
    this.Status = params.Status ?? null;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
  }
}
