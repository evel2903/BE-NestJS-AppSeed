import { BusinessRuleException, ConflictException, NotFoundException } from '../../../src/Common/Exceptions/AppException';
import { GoodsEntity } from '../../../src/Modules/Goods/Domain/Entities/GoodsEntity';
import { IGoodsRepository } from '../../../src/Modules/Goods/Domain/Interfaces/IGoodsRepository';
import { ProductEntity } from '../../../src/Modules/Product/Domain/Entities/ProductEntity';
import { IProductRepository } from '../../../src/Modules/Product/Domain/Interfaces/IProductRepository';
import { StockEntity } from '../../../src/Modules/Stock/Domain/Entities/StockEntity';
import { IStockRepository } from '../../../src/Modules/Stock/Domain/Interfaces/IStockRepository';
import { CreateStockUseCase } from '../../../src/Modules/Stock/Application/UseCases/CreateStockUseCase';
import { UpdateStockUseCase } from '../../../src/Modules/Stock/Application/UseCases/UpdateStockUseCase';
import { GetStockByIdUseCase } from '../../../src/Modules/Stock/Application/UseCases/GetStockByIdUseCase';
import { DeleteStockUseCase } from '../../../src/Modules/Stock/Application/UseCases/DeleteStockUseCase';
import { ListStocksUseCase } from '../../../src/Modules/Stock/Application/UseCases/ListStocksUseCase';

class FakeStockRepository implements IStockRepository {
  public FindById = jest.fn<Promise<StockEntity | null>, [string]>();
  public FindByBatchCode = jest.fn<Promise<StockEntity | null>, [string | null, string | null, string]>();
  public Create = jest.fn<Promise<StockEntity>, [StockEntity]>();
  public Update = jest.fn<Promise<void>, [StockEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: StockEntity[]; TotalItems: number }>, [number, number, string?, string?, Date?, Date?]>();
}

class FakeGoodsRepository implements IGoodsRepository {
  public FindById = jest.fn<Promise<GoodsEntity | null>, [string]>();
  public FindBySku = jest.fn<Promise<GoodsEntity | null>, [string]>();
  public FindByBarcode = jest.fn<Promise<GoodsEntity | null>, [string]>();
  public Create = jest.fn<Promise<GoodsEntity>, [GoodsEntity]>();
  public Update = jest.fn<Promise<void>, [GoodsEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: GoodsEntity[]; TotalItems: number }>, [number, number, string?, string?]>();
}

class FakeProductRepository implements IProductRepository {
  public FindById = jest.fn<Promise<ProductEntity | null>, [string]>();
  public FindBySku = jest.fn<Promise<ProductEntity | null>, [string]>();
  public FindByBarcode = jest.fn<Promise<ProductEntity | null>, [string]>();
  public Create = jest.fn<Promise<ProductEntity>, [ProductEntity]>();
  public Update = jest.fn<Promise<void>, [ProductEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: ProductEntity[]; TotalItems: number }>, [number, number, string?, string?]>();
}

const BuildStock = (overrides: Partial<StockEntity> = {}): StockEntity => {
  return new StockEntity({
    Id: overrides.Id ?? 's1',
    GoodsId: overrides.GoodsId ?? 'g1',
    ProductId: overrides.ProductId ?? null,
    BatchCode: overrides.BatchCode ?? 'BATCH-1',
    Qty: overrides.Qty ?? 10,
    UnitCost: overrides.UnitCost ?? 100,
    ReceivedDate: overrides.ReceivedDate ?? new Date('2025-01-01T00:00:00Z'),
    ExpiredDate: overrides.ExpiredDate ?? null,
    Note: overrides.Note ?? null,
    CreatedAt: overrides.CreatedAt ?? new Date('2025-01-01T00:00:00Z'),
    UpdatedAt: overrides.UpdatedAt ?? new Date('2025-01-01T00:00:00Z'),
  });
};

describe('Stock use cases', () => {
  it('CreateStockUseCase rejects when both GoodsId and ProductId provided', async () => {
    const stockRepo = new FakeStockRepository();
    const goodsRepo = new FakeGoodsRepository();
    const productRepo = new FakeProductRepository();

    const useCase = new CreateStockUseCase(stockRepo, goodsRepo, productRepo);
    await expect(
      useCase.Execute({
        GoodsId: 'g1',
        ProductId: 'p1',
        BatchCode: 'BATCH-1',
        Qty: 10,
        UnitCost: 100,
        ReceivedDate: '2025-01-01',
      }),
    ).rejects.toBeInstanceOf(BusinessRuleException);
  });

  it('CreateStockUseCase creates for Goods when unique batch', async () => {
    const stockRepo = new FakeStockRepository();
    const goodsRepo = new FakeGoodsRepository();
    const productRepo = new FakeProductRepository();
    goodsRepo.FindById.mockResolvedValue({
      Id: 'g1',
      Name: 'Goods A',
      Sku: 'SKU-A',
      Barcode: null,
      CategoryId: 'c1',
      Unit: null,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    } as GoodsEntity);
    stockRepo.FindByBatchCode.mockResolvedValue(null);
    stockRepo.Create.mockImplementation(async (stock) => stock);

    const useCase = new CreateStockUseCase(stockRepo, goodsRepo, productRepo);
    const created = await useCase.Execute({
      GoodsId: 'g1',
      BatchCode: 'BATCH-1',
      Qty: 10,
      UnitCost: 100,
      ReceivedDate: '2025-01-01',
    });

    expect(created.GoodsId).toBe('g1');
    expect(created.ProductId).toBeNull();
  });

  it('CreateStockUseCase throws when batch exists', async () => {
    const stockRepo = new FakeStockRepository();
    const goodsRepo = new FakeGoodsRepository();
    const productRepo = new FakeProductRepository();
    goodsRepo.FindById.mockResolvedValue({
      Id: 'g1',
      Name: 'Goods A',
      Sku: 'SKU-A',
      Barcode: null,
      CategoryId: 'c1',
      Unit: null,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    } as GoodsEntity);
    stockRepo.FindByBatchCode.mockResolvedValue(BuildStock());

    const useCase = new CreateStockUseCase(stockRepo, goodsRepo, productRepo);
    await expect(
      useCase.Execute({
        GoodsId: 'g1',
        BatchCode: 'BATCH-1',
        Qty: 10,
        UnitCost: 100,
        ReceivedDate: '2025-01-01',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('CreateStockUseCase throws when ExpiredDate before ReceivedDate', async () => {
    const stockRepo = new FakeStockRepository();
    const goodsRepo = new FakeGoodsRepository();
    const productRepo = new FakeProductRepository();
    goodsRepo.FindById.mockResolvedValue({
      Id: 'g1',
      Name: 'Goods A',
      Sku: 'SKU-A',
      Barcode: null,
      CategoryId: 'c1',
      Unit: null,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    } as GoodsEntity);
    stockRepo.FindByBatchCode.mockResolvedValue(null);

    const useCase = new CreateStockUseCase(stockRepo, goodsRepo, productRepo);
    await expect(
      useCase.Execute({
        GoodsId: 'g1',
        BatchCode: 'BATCH-1',
        Qty: 10,
        UnitCost: 100,
        ReceivedDate: '2025-01-10',
        ExpiredDate: '2025-01-01',
      }),
    ).rejects.toBeInstanceOf(BusinessRuleException);
  });

  it('UpdateStockUseCase updates fields and checks batch uniqueness', async () => {
    const stockRepo = new FakeStockRepository();
    const existing = BuildStock({ Id: 's1', BatchCode: 'B1' });
    stockRepo.FindById.mockResolvedValueOnce(existing).mockResolvedValueOnce(
      BuildStock({ Id: 's1', BatchCode: 'B2', Qty: 20 }),
    );
    stockRepo.FindByBatchCode.mockResolvedValue(null);

    const useCase = new UpdateStockUseCase(stockRepo);
    const updated = await useCase.Execute({ Id: 's1', BatchCode: 'B2', Qty: 20 });

    expect(updated.BatchCode).toBe('B2');
    expect(updated.Qty).toBe(20);
  });

  it('GetStockByIdUseCase throws when missing', async () => {
    const stockRepo = new FakeStockRepository();
    stockRepo.FindById.mockResolvedValue(null);

    const useCase = new GetStockByIdUseCase(stockRepo);
    await expect(useCase.Execute('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('DeleteStockUseCase deletes existing stock', async () => {
    const stockRepo = new FakeStockRepository();
    stockRepo.FindById.mockResolvedValue(BuildStock({ Id: 's1' }));

    const useCase = new DeleteStockUseCase(stockRepo);
    await useCase.Execute('s1');

    expect(stockRepo.Delete).toHaveBeenCalledWith('s1');
  });

  it('ListStocksUseCase uses pagination and filters', async () => {
    const stockRepo = new FakeStockRepository();
    stockRepo.List.mockResolvedValue({ Items: [BuildStock()], TotalItems: 1 });

    const useCase = new ListStocksUseCase(stockRepo);
    await useCase.Execute({ Page: 2, PageSize: 10, GoodsId: ' g1 ', ProductId: ' p1 ' });

    expect(stockRepo.List).toHaveBeenCalledWith(10, 10, 'g1', 'p1', undefined, undefined);
  });
});
