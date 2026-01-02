export type CreateStockDto = {
  GoodsId?: string | null;
  ProductId?: string | null;
  BatchCode: string;
  Qty: number;
  UnitCost: number;
  ReceivedDate: string | Date;
  ExpiredDate?: string | Date | null;
  Note?: string | null;
};
