import { ConflictException, NotFoundException } from '../../../src/Common/Exceptions/AppException';
import { CategoryEntity } from '../../../src/Modules/Category/Domain/Entities/CategoryEntity';
import { ICategoryRepository } from '../../../src/Modules/Category/Domain/Interfaces/ICategoryRepository';
import { ProductEntity } from '../../../src/Modules/Product/Domain/Entities/ProductEntity';
import { IProductRepository } from '../../../src/Modules/Product/Domain/Interfaces/IProductRepository';
import { CreateProductUseCase } from '../../../src/Modules/Product/Application/UseCases/CreateProductUseCase';
import { UpdateProductUseCase } from '../../../src/Modules/Product/Application/UseCases/UpdateProductUseCase';
import { GetProductByIdUseCase } from '../../../src/Modules/Product/Application/UseCases/GetProductByIdUseCase';
import { DeleteProductUseCase } from '../../../src/Modules/Product/Application/UseCases/DeleteProductUseCase';
import { ListProductsUseCase } from '../../../src/Modules/Product/Application/UseCases/ListProductsUseCase';

class FakeProductRepository implements IProductRepository {
  public FindById = jest.fn<Promise<ProductEntity | null>, [string]>();
  public FindBySku = jest.fn<Promise<ProductEntity | null>, [string]>();
  public FindByBarcode = jest.fn<Promise<ProductEntity | null>, [string]>();
  public Create = jest.fn<Promise<ProductEntity>, [ProductEntity]>();
  public Update = jest.fn<Promise<void>, [ProductEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: ProductEntity[]; TotalItems: number }>, [number, number, string?, string?]>();
}

class FakeCategoryRepository implements ICategoryRepository {
  public FindById = jest.fn<Promise<CategoryEntity | null>, [string]>();
  public FindByName = jest.fn<Promise<CategoryEntity | null>, [string]>();
  public FindByCode = jest.fn<Promise<CategoryEntity | null>, [string]>();
  public Create = jest.fn<Promise<CategoryEntity>, [CategoryEntity]>();
  public Update = jest.fn<Promise<void>, [CategoryEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: CategoryEntity[]; TotalItems: number }>, [number, number, string?]>();
}

const BuildProduct = (overrides: Partial<ProductEntity> = {}): ProductEntity => {
  return new ProductEntity({
    Id: overrides.Id ?? 'p1',
    Name: overrides.Name ?? 'Product A',
    Sku: overrides.Sku ?? 'SKU-P1',
    Barcode: overrides.Barcode ?? 'BAR-P1',
    CategoryId: overrides.CategoryId ?? 'c1',
    Unit: overrides.Unit ?? 'pcs',
    IsActive: overrides.IsActive ?? true,
    HasSerial: overrides.HasSerial ?? true,
    CreatedAt: overrides.CreatedAt ?? new Date('2025-01-01T00:00:00Z'),
    UpdatedAt: overrides.UpdatedAt ?? new Date('2025-01-01T00:00:00Z'),
  });
};

const BuildCategory = (id = 'c1'): CategoryEntity => {
  return new CategoryEntity({
    Id: id,
    Name: 'Category A',
    Code: 'CAT-A',
    Description: null,
    IsActive: true,
    CreatedAt: new Date('2025-01-01T00:00:00Z'),
    UpdatedAt: new Date('2025-01-01T00:00:00Z'),
  });
};

describe('Product use cases', () => {
  it('CreateProductUseCase creates when sku/barcode are unique and category exists', async () => {
    const productRepo = new FakeProductRepository();
    const categoryRepo = new FakeCategoryRepository();
    categoryRepo.FindById.mockResolvedValue(BuildCategory('c1'));
    productRepo.FindBySku.mockResolvedValue(null);
    productRepo.FindByBarcode.mockResolvedValue(null);
    productRepo.Create.mockImplementation(async (product) => product);

    const useCase = new CreateProductUseCase(productRepo, categoryRepo);
    const created = await useCase.Execute({
      Name: '  Product A  ',
      Sku: '  SKU-P1  ',
      Barcode: '  BAR-P1 ',
      CategoryId: 'c1',
      Unit: ' pcs ',
      HasSerial: true,
    });

    expect(productRepo.FindBySku).toHaveBeenCalledWith('SKU-P1');
    expect(productRepo.FindByBarcode).toHaveBeenCalledWith('BAR-P1');
    expect(created.Sku).toBe('SKU-P1');
    expect(created.Barcode).toBe('BAR-P1');
    expect(created.Unit).toBe('pcs');
    expect(created.HasSerial).toBe(true);
  });

  it('CreateProductUseCase throws when category missing', async () => {
    const productRepo = new FakeProductRepository();
    const categoryRepo = new FakeCategoryRepository();
    categoryRepo.FindById.mockResolvedValue(null);

    const useCase = new CreateProductUseCase(productRepo, categoryRepo);
    await expect(
      useCase.Execute({ Name: 'Product', Sku: 'SKU', CategoryId: 'missing' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('CreateProductUseCase throws when sku exists', async () => {
    const productRepo = new FakeProductRepository();
    const categoryRepo = new FakeCategoryRepository();
    categoryRepo.FindById.mockResolvedValue(BuildCategory());
    productRepo.FindBySku.mockResolvedValue(BuildProduct());

    const useCase = new CreateProductUseCase(productRepo, categoryRepo);
    await expect(
      useCase.Execute({ Name: 'Product', Sku: 'SKU-P1', CategoryId: 'c1' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('UpdateProductUseCase updates fields and validates category/sku/barcode', async () => {
    const productRepo = new FakeProductRepository();
    const categoryRepo = new FakeCategoryRepository();
    const existing = BuildProduct({ Id: 'p1', Sku: 'SKU-OLD', Barcode: 'BAR-OLD', HasSerial: true });

    productRepo.FindById.mockResolvedValueOnce(existing).mockResolvedValueOnce(
      BuildProduct({ Id: 'p1', Sku: 'SKU-NEW', Barcode: 'BAR-NEW', CategoryId: 'c2', HasSerial: false }),
    );
    productRepo.FindBySku.mockResolvedValue(null);
    productRepo.FindByBarcode.mockResolvedValue(null);
    categoryRepo.FindById.mockResolvedValue(BuildCategory('c2'));

    const useCase = new UpdateProductUseCase(productRepo, categoryRepo);
    const updated = await useCase.Execute({
      Id: 'p1',
      Sku: 'SKU-NEW',
      Barcode: 'BAR-NEW',
      CategoryId: 'c2',
      HasSerial: false,
    });

    expect(updated.Sku).toBe('SKU-NEW');
    expect(updated.Barcode).toBe('BAR-NEW');
    expect(updated.CategoryId).toBe('c2');
    expect(updated.HasSerial).toBe(false);
  });

  it('GetProductByIdUseCase throws when missing', async () => {
    const repo = new FakeProductRepository();
    repo.FindById.mockResolvedValue(null);

    const useCase = new GetProductByIdUseCase(repo);
    await expect(useCase.Execute('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('DeleteProductUseCase deletes existing product', async () => {
    const repo = new FakeProductRepository();
    repo.FindById.mockResolvedValue(BuildProduct({ Id: 'p1' }));

    const useCase = new DeleteProductUseCase(repo);
    await useCase.Execute('p1');

    expect(repo.Delete).toHaveBeenCalledWith('p1');
  });

  it('ListProductsUseCase uses pagination and filters', async () => {
    const repo = new FakeProductRepository();
    repo.List.mockResolvedValue({ Items: [BuildProduct()], TotalItems: 1 });

    const useCase = new ListProductsUseCase(repo);
    await useCase.Execute({ Page: 2, PageSize: 10, Search: '  prod ', CategoryId: '  c1 ' });

    expect(repo.List).toHaveBeenCalledWith(10, 10, 'prod', 'c1');
  });
});
