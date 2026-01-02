export class CategoryEntity {
  public readonly Id: string;
  public Name: string;
  public Code: string | null;
  public Description: string | null;
  public IsActive: boolean;
  public readonly CreatedAt: Date;
  public UpdatedAt: Date;

  constructor(params: {
    Id: string;
    Name: string;
    Code?: string | null;
    Description?: string | null;
    IsActive?: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
  }) {
    this.Id = params.Id;
    this.Name = params.Name;
    this.Code = params.Code ?? null;
    this.Description = params.Description ?? null;
    this.IsActive = params.IsActive ?? true;
    this.CreatedAt = params.CreatedAt;
    this.UpdatedAt = params.UpdatedAt;
  }
}
