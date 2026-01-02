export type StockDto = {
  Id: string;
  GoodsId: string | null;
  ProductId: string | null;
  BatchCode: string;
  Qty: number;
  UnitCost: number;
  ReceivedDate: string;
  ExpiredDate: string | null;
  Note: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};
