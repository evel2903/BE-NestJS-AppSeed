export type CreateProductDto = {
  Name: string;
  Sku: string;
  Barcode?: string | null;
  CategoryId: string;
  Unit?: string | null;
  IsActive?: boolean;
  HasSerial?: boolean;
};
