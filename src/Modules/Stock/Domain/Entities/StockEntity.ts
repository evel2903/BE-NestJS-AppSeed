export class StockEntity {
  public readonly Id: string;
  public GoodsId: string | null;
  public ProductId: string | null;
  public BatchCode: string;
  public Qty: number;
  public UnitCost: number;
  public ReceivedDate: Date;
  public ExpiredDate: Date | null;
  public Note: string | null;
  public readonly CreatedAt: Date;
  public UpdatedAt: Date;

  constructor(params: {
    Id: string;
    GoodsId?: string | null;
    ProductId?: string | null;
    BatchCode: string;
    Qty: number;
    UnitCost: number;
    ReceivedDate: Date;
    ExpiredDate?: Date | null;
    Note?: string | null;
    CreatedAt: Date;
    UpdatedAt: Date;
  }) {
    this.Id = params.Id;
    this.GoodsId = params.GoodsId ?? null;
    this.ProductId = params.ProductId ?? null;
    this.BatchCode = params.BatchCode;
    this.Qty = params.Qty;
    this.UnitCost = params.UnitCost;
    this.ReceivedDate = params.ReceivedDate;
    this.ExpiredDate = params.ExpiredDate ?? null;
    this.Note = params.Note ?? null;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
  }
}
