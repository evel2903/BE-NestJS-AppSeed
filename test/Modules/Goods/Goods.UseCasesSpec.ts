import { ConflictException, NotFoundException } from '../../../src/Common/Exceptions/AppException';
import { CategoryEntity } from '../../../src/Modules/Category/Domain/Entities/CategoryEntity';
import { ICategoryRepository } from '../../../src/Modules/Category/Domain/Interfaces/ICategoryRepository';
import { GoodsEntity } from '../../../src/Modules/Goods/Domain/Entities/GoodsEntity';
import { IGoodsRepository } from '../../../src/Modules/Goods/Domain/Interfaces/IGoodsRepository';
import { CreateGoodsUseCase } from '../../../src/Modules/Goods/Application/UseCases/CreateGoodsUseCase';
import { UpdateGoodsUseCase } from '../../../src/Modules/Goods/Application/UseCases/UpdateGoodsUseCase';
import { GetGoodsByIdUseCase } from '../../../src/Modules/Goods/Application/UseCases/GetGoodsByIdUseCase';
import { DeleteGoodsUseCase } from '../../../src/Modules/Goods/Application/UseCases/DeleteGoodsUseCase';
import { ListGoodsUseCase } from '../../../src/Modules/Goods/Application/UseCases/ListGoodsUseCase';

class FakeGoodsRepository implements IGoodsRepository {
  public FindById = jest.fn<Promise<GoodsEntity | null>, [string]>();
  public FindBySku = jest.fn<Promise<GoodsEntity | null>, [string]>();
  public FindByBarcode = jest.fn<Promise<GoodsEntity | null>, [string]>();
  public Create = jest.fn<Promise<GoodsEntity>, [GoodsEntity]>();
  public Update = jest.fn<Promise<void>, [GoodsEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: GoodsEntity[]; TotalItems: number }>, [number, number, string?, string?]>();
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

const BuildGoods = (overrides: Partial<GoodsEntity> = {}): GoodsEntity => {
  return new GoodsEntity({
    Id: overrides.Id ?? 'g1',
    Name: overrides.Name ?? 'Goods A',
    Sku: overrides.Sku ?? 'SKU-A',
    Barcode: overrides.Barcode ?? 'BAR-A',
    CategoryId: overrides.CategoryId ?? 'c1',
    Unit: overrides.Unit ?? 'pcs',
    IsActive: overrides.IsActive ?? true,
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

describe('Goods use cases', () => {
  it('CreateGoodsUseCase creates when sku/barcode are unique and category exists', async () => {
    const goodsRepo = new FakeGoodsRepository();
    const categoryRepo = new FakeCategoryRepository();
    categoryRepo.FindById.mockResolvedValue(BuildCategory('c1'));
    goodsRepo.FindBySku.mockResolvedValue(null);
    goodsRepo.FindByBarcode.mockResolvedValue(null);
    goodsRepo.Create.mockImplementation(async (goods) => goods);

    const useCase = new CreateGoodsUseCase(goodsRepo, categoryRepo);
    const created = await useCase.Execute({
      Name: '  Goods A  ',
      Sku: '  SKU-A  ',
      Barcode: '  BAR-A ',
      CategoryId: 'c1',
      Unit: ' pcs ',
    });

    expect(goodsRepo.FindBySku).toHaveBeenCalledWith('SKU-A');
    expect(goodsRepo.FindByBarcode).toHaveBeenCalledWith('BAR-A');
    expect(created.Sku).toBe('SKU-A');
    expect(created.Barcode).toBe('BAR-A');
    expect(created.Unit).toBe('pcs');
  });

  it('CreateGoodsUseCase throws when category missing', async () => {
    const goodsRepo = new FakeGoodsRepository();
    const categoryRepo = new FakeCategoryRepository();
    categoryRepo.FindById.mockResolvedValue(null);

    const useCase = new CreateGoodsUseCase(goodsRepo, categoryRepo);
    await expect(
      useCase.Execute({ Name: 'Goods', Sku: 'SKU', CategoryId: 'missing' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('CreateGoodsUseCase throws when sku exists', async () => {
    const goodsRepo = new FakeGoodsRepository();
    const categoryRepo = new FakeCategoryRepository();
    categoryRepo.FindById.mockResolvedValue(BuildCategory());
    goodsRepo.FindBySku.mockResolvedValue(BuildGoods());

    const useCase = new CreateGoodsUseCase(goodsRepo, categoryRepo);
    await expect(
      useCase.Execute({ Name: 'Goods', Sku: 'SKU-A', CategoryId: 'c1' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('UpdateGoodsUseCase updates fields and validates category/sku/barcode', async () => {
    const goodsRepo = new FakeGoodsRepository();
    const categoryRepo = new FakeCategoryRepository();
    const existing = BuildGoods({ Id: 'g1', Sku: 'SKU-OLD', Barcode: 'BAR-OLD' });

    goodsRepo.FindById.mockResolvedValueOnce(existing).mockResolvedValueOnce(
      BuildGoods({ Id: 'g1', Sku: 'SKU-NEW', Barcode: 'BAR-NEW', CategoryId: 'c2' }),
    );
    goodsRepo.FindBySku.mockResolvedValue(null);
    goodsRepo.FindByBarcode.mockResolvedValue(null);
    categoryRepo.FindById.mockResolvedValue(BuildCategory('c2'));

    const useCase = new UpdateGoodsUseCase(goodsRepo, categoryRepo);
    const updated = await useCase.Execute({
      Id: 'g1',
      Sku: 'SKU-NEW',
      Barcode: 'BAR-NEW',
      CategoryId: 'c2',
    });

    expect(updated.Sku).toBe('SKU-NEW');
    expect(updated.Barcode).toBe('BAR-NEW');
    expect(updated.CategoryId).toBe('c2');
  });

  it('GetGoodsByIdUseCase throws when missing', async () => {
    const repo = new FakeGoodsRepository();
    repo.FindById.mockResolvedValue(null);

    const useCase = new GetGoodsByIdUseCase(repo);
    await expect(useCase.Execute('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('DeleteGoodsUseCase deletes existing goods', async () => {
    const repo = new FakeGoodsRepository();
    repo.FindById.mockResolvedValue(BuildGoods({ Id: 'g1' }));

    const useCase = new DeleteGoodsUseCase(repo);
    await useCase.Execute('g1');

    expect(repo.Delete).toHaveBeenCalledWith('g1');
  });

  it('ListGoodsUseCase uses pagination and filters', async () => {
    const repo = new FakeGoodsRepository();
    repo.List.mockResolvedValue({ Items: [BuildGoods()], TotalItems: 1 });

    const useCase = new ListGoodsUseCase(repo);
    await useCase.Execute({ Page: 3, PageSize: 10, Search: '  goods ', CategoryId: '  c1 ' });

    expect(repo.List).toHaveBeenCalledWith(20, 10, 'goods', 'c1');
  });
});
