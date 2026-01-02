import { ConflictException, NotFoundException } from '../../../src/Common/Exceptions/AppException';
import { ProductEntity } from '../../../src/Modules/Product/Domain/Entities/ProductEntity';
import { IProductRepository } from '../../../src/Modules/Product/Domain/Interfaces/IProductRepository';
import { StockEntity } from '../../../src/Modules/Stock/Domain/Entities/StockEntity';
import { IStockRepository } from '../../../src/Modules/Stock/Domain/Interfaces/IStockRepository';
import { SerialEntity } from '../../../src/Modules/Serial/Domain/Entities/SerialEntity';
import { ISerialRepository } from '../../../src/Modules/Serial/Domain/Interfaces/ISerialRepository';
import { CreateSerialUseCase } from '../../../src/Modules/Serial/Application/UseCases/CreateSerialUseCase';
import { UpdateSerialUseCase } from '../../../src/Modules/Serial/Application/UseCases/UpdateSerialUseCase';
import { GetSerialByIdUseCase } from '../../../src/Modules/Serial/Application/UseCases/GetSerialByIdUseCase';
import { DeleteSerialUseCase } from '../../../src/Modules/Serial/Application/UseCases/DeleteSerialUseCase';
import { ListSerialsUseCase } from '../../../src/Modules/Serial/Application/UseCases/ListSerialsUseCase';

class FakeSerialRepository implements ISerialRepository {
  public FindById = jest.fn<Promise<SerialEntity | null>, [string]>();
  public FindBySerial = jest.fn<Promise<SerialEntity | null>, [string, string]>();
  public Create = jest.fn<Promise<SerialEntity>, [SerialEntity]>();
  public Update = jest.fn<Promise<void>, [SerialEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: SerialEntity[]; TotalItems: number }>, [number, number, string?, string?, string?]>();
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

class FakeStockRepository implements IStockRepository {
  public FindById = jest.fn<Promise<StockEntity | null>, [string]>();
  public FindByBatchCode = jest.fn<Promise<StockEntity | null>, [string | null, string | null, string]>();
  public Create = jest.fn<Promise<StockEntity>, [StockEntity]>();
  public Update = jest.fn<Promise<void>, [StockEntity]>();
  public Delete = jest.fn<Promise<void>, [string]>();
  public List = jest.fn<Promise<{ Items: StockEntity[]; TotalItems: number }>, [number, number, string?, string?, Date?, Date?]>();
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

const BuildStock = (overrides: Partial<StockEntity> = {}): StockEntity => {
  return new StockEntity({
    Id: overrides.Id ?? 's1',
    GoodsId: overrides.GoodsId ?? null,
    ProductId: overrides.ProductId ?? 'p1',
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

const BuildSerial = (overrides: Partial<SerialEntity> = {}): SerialEntity => {
  return new SerialEntity({
    Id: overrides.Id ?? 'sr1',
    ProductId: overrides.ProductId ?? 'p1',
    StockId: overrides.StockId ?? 's1',
    SerialNumber: overrides.SerialNumber ?? 'SER-001',
    Status: overrides.Status ?? null,
    CreatedAt: overrides.CreatedAt ?? new Date('2025-01-01T00:00:00Z'),
    UpdatedAt: overrides.UpdatedAt ?? new Date('2025-01-01T00:00:00Z'),
  });
};

describe('Serial use cases', () => {
  it('CreateSerialUseCase creates when unique serial and stock belongs to product', async () => {
    const serialRepo = new FakeSerialRepository();
    const productRepo = new FakeProductRepository();
    const stockRepo = new FakeStockRepository();

    productRepo.FindById.mockResolvedValue(BuildProduct({ Id: 'p1' }));
    stockRepo.FindById.mockResolvedValue(BuildStock({ Id: 's1', ProductId: 'p1' }));
    serialRepo.FindBySerial.mockResolvedValue(null);
    serialRepo.Create.mockImplementation(async (serial) => serial);

    const useCase = new CreateSerialUseCase(serialRepo, productRepo, stockRepo);
    const created = await useCase.Execute({
      ProductId: 'p1',
      StockId: 's1',
      SerialNumber: ' SER-001 ',
      Status: 'active',
    });

    expect(created.SerialNumber).toBe('SER-001');
    expect(created.Status).toBe('active');
  });

  it('CreateSerialUseCase throws when product missing', async () => {
    const serialRepo = new FakeSerialRepository();
    const productRepo = new FakeProductRepository();
    const stockRepo = new FakeStockRepository();
    productRepo.FindById.mockResolvedValue(null);

    const useCase = new CreateSerialUseCase(serialRepo, productRepo, stockRepo);
    await expect(
      useCase.Execute({ ProductId: 'missing', StockId: 's1', SerialNumber: 'SER-001' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('CreateSerialUseCase throws when serial exists', async () => {
    const serialRepo = new FakeSerialRepository();
    const productRepo = new FakeProductRepository();
    const stockRepo = new FakeStockRepository();

    productRepo.FindById.mockResolvedValue(BuildProduct({ Id: 'p1' }));
    stockRepo.FindById.mockResolvedValue(BuildStock({ Id: 's1', ProductId: 'p1' }));
    serialRepo.FindBySerial.mockResolvedValue(BuildSerial());

    const useCase = new CreateSerialUseCase(serialRepo, productRepo, stockRepo);
    await expect(
      useCase.Execute({ ProductId: 'p1', StockId: 's1', SerialNumber: 'SER-001' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('UpdateSerialUseCase updates stock and status when valid', async () => {
    const serialRepo = new FakeSerialRepository();
    const stockRepo = new FakeStockRepository();

    const existing = BuildSerial({ Id: 'sr1', ProductId: 'p1', StockId: 's1', Status: 'active' });
    serialRepo.FindById.mockResolvedValueOnce(existing).mockResolvedValueOnce(
      BuildSerial({ Id: 'sr1', ProductId: 'p1', StockId: 's2', Status: 'inactive' }),
    );
    stockRepo.FindById.mockResolvedValue(BuildStock({ Id: 's2', ProductId: 'p1' }));

    const useCase = new UpdateSerialUseCase(serialRepo, stockRepo);
    const updated = await useCase.Execute({ Id: 'sr1', StockId: 's2', Status: 'inactive' });

    expect(updated.StockId).toBe('s2');
    expect(updated.Status).toBe('inactive');
  });

  it('UpdateSerialUseCase throws when stock not found', async () => {
    const serialRepo = new FakeSerialRepository();
    const stockRepo = new FakeStockRepository();

    serialRepo.FindById.mockResolvedValue(BuildSerial({ Id: 'sr1', ProductId: 'p1' }));
    stockRepo.FindById.mockResolvedValue(null);

    const useCase = new UpdateSerialUseCase(serialRepo, stockRepo);
    await expect(useCase.Execute({ Id: 'sr1', StockId: 'missing' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('GetSerialByIdUseCase throws when missing', async () => {
    const serialRepo = new FakeSerialRepository();
    serialRepo.FindById.mockResolvedValue(null);

    const useCase = new GetSerialByIdUseCase(serialRepo);
    await expect(useCase.Execute('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('DeleteSerialUseCase deletes existing serial', async () => {
    const serialRepo = new FakeSerialRepository();
    serialRepo.FindById.mockResolvedValue(BuildSerial({ Id: 'sr1' }));

    const useCase = new DeleteSerialUseCase(serialRepo);
    await useCase.Execute('sr1');

    expect(serialRepo.Delete).toHaveBeenCalledWith('sr1');
  });

  it('ListSerialsUseCase uses pagination and filters', async () => {
    const serialRepo = new FakeSerialRepository();
    serialRepo.List.mockResolvedValue({ Items: [BuildSerial()], TotalItems: 1 });

    const useCase = new ListSerialsUseCase(serialRepo);
    await useCase.Execute({ Page: 2, PageSize: 10, ProductId: ' p1 ', StockId: ' s1 ', Status: ' active ' });

    expect(serialRepo.List).toHaveBeenCalledWith(10, 10, 'p1', 's1', 'active');
  });
});
