export type UpdateStockDto = {
  Id: string;
  BatchCode?: string;
  Qty?: number;
  UnitCost?: number;
  ReceivedDate?: string | Date;
  ExpiredDate?: string | Date | null;
  Note?: string | null;
};
