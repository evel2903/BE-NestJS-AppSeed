import { ConflictException, NotFoundException } from '../../../src/Common/Exceptions/AppException';
import { CategoryEntity } from '../../../src/Modules/Category/Domain/Entities/CategoryEntity';
import { ICategoryRepository } from '../../../src/Modules/Category/Domain/Interfaces/ICategoryRepository';
import { CreateCategoryUseCase } from '../../../src/Modules/Category/Application/UseCases/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../../../src/Modules/Category/Application/UseCases/UpdateCategoryUseCase';
import { GetCategoryByIdUseCase } from '../../../src/Modules/Category/Application/UseCases/GetCategoryByIdUseCase';
import { DeleteCategoryUseCase } from '../../../src/Modules/Category/Application/UseCases/DeleteCategoryUseCase';
import { ListCategoriesUseCase } from '../../../src/Modules/Category/Application/UseCases/ListCategoriesUseCase';

class FakeCategoryRepository implements ICategoryRepository {
  public FindById = jest.fn<Promise<CategoryEntity | null>, [string]>();
  public FindByName = jest.fn<Promise<CategoryEntity | null>, [string]>();
  public FindByCode = jest.fn<Promise<CategoryEntity | null>, [string]>();
  public Create = jest.fn<Promise<CategoryEntity>, [CategoryEntity]>();
  public Update = jest.fn<Promise<void>, [CategoryEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: CategoryEntity[]; TotalItems: number }>, [number, number, string?]>();
}

const BuildCategory = (overrides: Partial<CategoryEntity> = {}): CategoryEntity => {
  return new CategoryEntity({
    Id: overrides.Id ?? 'c1',
    Name: overrides.Name ?? 'Category A',
    Code: overrides.Code ?? 'CAT-A',
    Description: overrides.Description ?? null,
    IsActive: overrides.IsActive ?? true,
    CreatedAt: overrides.CreatedAt ?? new Date('2025-01-01T00:00:00Z'),
    UpdatedAt: overrides.UpdatedAt ?? new Date('2025-01-01T00:00:00Z'),
  });
};

describe('Category use cases', () => {
  it('CreateCategoryUseCase creates when name/code are unique', async () => {
    const repo = new FakeCategoryRepository();
    repo.FindByName.mockResolvedValue(null);
    repo.FindByCode.mockResolvedValue(null);
    repo.Create.mockImplementation(async (category) => category);

    const useCase = new CreateCategoryUseCase(repo);
    const created = await useCase.Execute({
      Name: '  Electronics  ',
      Code: '  ELEC ',
      Description: '  Devices ',
    });

    expect(repo.FindByName).toHaveBeenCalledWith('Electronics');
    expect(repo.FindByCode).toHaveBeenCalledWith('ELEC');
    expect(repo.Create).toHaveBeenCalledTimes(1);
    expect(created.Name).toBe('Electronics');
    expect(created.Code).toBe('ELEC');
    expect(created.Description).toBe('Devices');
  });

  it('CreateCategoryUseCase throws when name exists', async () => {
    const repo = new FakeCategoryRepository();
    repo.FindByName.mockResolvedValue(BuildCategory({ Id: 'c-existing' }));

    const useCase = new CreateCategoryUseCase(repo);
    await expect(useCase.Execute({ Name: 'Electronics' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('CreateCategoryUseCase throws when code exists', async () => {
    const repo = new FakeCategoryRepository();
    repo.FindByName.mockResolvedValue(null);
    repo.FindByCode.mockResolvedValue(BuildCategory({ Id: 'c-existing' }));

    const useCase = new CreateCategoryUseCase(repo);
    await expect(useCase.Execute({ Name: 'Electronics', Code: 'ELEC' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('GetCategoryByIdUseCase throws when missing', async () => {
    const repo = new FakeCategoryRepository();
    repo.FindById.mockResolvedValue(null);

    const useCase = new GetCategoryByIdUseCase(repo);
    await expect(useCase.Execute('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('DeleteCategoryUseCase deletes existing category', async () => {
    const repo = new FakeCategoryRepository();
    repo.FindById.mockResolvedValue(BuildCategory({ Id: 'c1' }));

    const useCase = new DeleteCategoryUseCase(repo);
    await useCase.Execute('c1');

    expect(repo.Delete).toHaveBeenCalledWith('c1');
  });

  it('UpdateCategoryUseCase updates fields and prevents duplicate name/code', async () => {
    const repo = new FakeCategoryRepository();
    const existing = BuildCategory({ Id: 'c1', Name: 'Old Name', Code: 'OLD' });
    repo.FindById.mockResolvedValue(existing);
    repo.FindByName.mockResolvedValue(null);
    repo.FindByCode.mockResolvedValue(null);
    repo.Update.mockResolvedValue(undefined);
    repo.FindById.mockResolvedValueOnce(existing).mockResolvedValueOnce(
      BuildCategory({ Id: 'c1', Name: 'New Name', Code: 'NEW' }),
    );

    const useCase = new UpdateCategoryUseCase(repo);
    const updated = await useCase.Execute({ Id: 'c1', Name: 'New Name', Code: 'NEW' });

    expect(repo.FindByName).toHaveBeenCalledWith('New Name');
    expect(repo.FindByCode).toHaveBeenCalledWith('NEW');
    expect(updated.Name).toBe('New Name');
    expect(updated.Code).toBe('NEW');
  });

  it('ListCategoriesUseCase uses pagination and optional search', async () => {
    const repo = new FakeCategoryRepository();
    repo.List.mockResolvedValue({ Items: [BuildCategory()], TotalItems: 1 });

    const useCase = new ListCategoriesUseCase(repo);
    await useCase.Execute({ Page: 2, PageSize: 10, Search: '  cat ' });

    expect(repo.List).toHaveBeenCalledWith(10, 10, 'cat');
  });
});
