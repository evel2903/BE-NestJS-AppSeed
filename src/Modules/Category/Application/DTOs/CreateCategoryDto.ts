export type CreateCategoryDto = {
  Name: string;
  Code?: string | null;
  Description?: string | null;
  IsActive?: boolean;
};
