export type UpdateCategoryDto = {
  Id: string;
  Name?: string;
  Code?: string | null;
  Description?: string | null;
  IsActive?: boolean;
};
