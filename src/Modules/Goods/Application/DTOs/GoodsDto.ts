export type GoodsDto = {
  Id: string;
  Name: string;
  Sku: string;
  Barcode: string | null;
  CategoryId: string;
  Unit: string | null;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};
