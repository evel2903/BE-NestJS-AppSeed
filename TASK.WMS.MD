# TASK - WMS Master Data (Category, Goods, Product, Stock, Serial)

Tài liệu này chuyển nội dung trong `PLAN.WMS.MD` thành checklist công việc chi tiết để triển khai giai đoạn master data.

## 0) Nguyên tắc bắt buộc

- Tuân thủ Clean Architecture theo từng module (Domain → Application → Infrastructure → Presentation)
- Naming convention theo C#/.NET:
  - Class/Interface/Method/Property: `PascalCase`
  - Interface có prefix `I` (vd: `IGoodsRepository`)
  - Biến cục bộ: `camelCase`
  - File/folder: `PascalCase`
- Domain không phụ thuộc layer khác; Application chỉ phụ thuộc Domain; Infrastructure implement interface từ Domain; Presentation chỉ gọi Application
- Không expose TypeORM entity ra ngoài Infrastructure; dùng mapper để convert
- Validate ở Presentation (request DTO) bằng `class-validator` + `class-transformer`
- Dependency injection qua constructor; provider wiring rõ ràng trong module

## 1) Phase 1 - Module Category

### 1.1 Domain
- [ ] `Entities/CategoryEntity` (Id, Name, Code?, Description?, IsActive, CreatedAt, UpdatedAt)
- [ ] `Interfaces/ICategoryRepository` (FindById, FindByCode, FindByName, Create, Update, Delete, List/Paginate)

### 1.2 Application
- [ ] `DTOs/CategoryDto`, `CreateCategoryDto`, `UpdateCategoryDto`
- [ ] `UseCases/CreateCategoryUseCase`
- [ ] `UseCases/GetCategoryByIdUseCase`
- [ ] `UseCases/ListCategoriesUseCase`
- [ ] `UseCases/UpdateCategoryUseCase`
- [ ] `UseCases/DeleteCategoryUseCase`
- [ ] Rules: unique Name/Code (nếu có)

### 1.3 Infrastructure
- [ ] `Persistence/Entities/CategoryOrmEntity`
- [ ] `Persistence/Repositories/CategoryRepository` implements `ICategoryRepository`
- [ ] `Mappers/CategoryOrmMapper` (Domain ↔ ORM)
- [ ] Index unique: Name, Code

### 1.4 Presentation
- [ ] `Requests/CreateCategoryRequest` (validate)
- [ ] `Requests/UpdateCategoryRequest` (validate)
- [ ] `Requests/ListCategoriesQuery` (paging + search)
- [ ] `Controllers/CategoryController` (CRUD)

### 1.5 Module wiring
- [ ] `CategoryModule` register providers + `TypeOrmModule.forFeature([...])`

## 2) Phase 2 - Module Goods

### 2.1 Domain
- [ ] `Entities/GoodsEntity` (Id, Name, Sku, Barcode?, CategoryId, Unit?, IsActive, CreatedAt, UpdatedAt)
- [ ] `Interfaces/IGoodsRepository`

### 2.2 Application
- [ ] `DTOs/GoodsDto`, `CreateGoodsDto`, `UpdateGoodsDto`
- [ ] `UseCases/CreateGoodsUseCase`
- [ ] `UseCases/GetGoodsByIdUseCase`
- [ ] `UseCases/ListGoodsUseCase` (filter CategoryId)
- [ ] `UseCases/UpdateGoodsUseCase`
- [ ] `UseCases/DeleteGoodsUseCase`
- [ ] Rules: unique Sku, Category tồn tại

### 2.3 Infrastructure
- [ ] `Persistence/Entities/GoodsOrmEntity`
- [ ] `Persistence/Repositories/GoodsRepository` implements `IGoodsRepository`
- [ ] `Mappers/GoodsOrmMapper` (Domain ↔ ORM)
- [ ] Index unique: Sku, Barcode (nếu có)

### 2.4 Presentation
- [ ] `Requests/CreateGoodsRequest` (validate)
- [ ] `Requests/UpdateGoodsRequest` (validate)
- [ ] `Requests/ListGoodsQuery` (paging + search + CategoryId)
- [ ] `Controllers/GoodsController` (CRUD)

### 2.5 Module wiring
- [ ] `GoodsModule` register providers + `TypeOrmModule.forFeature([...])`

## 3) Phase 3 - Module Product

### 3.1 Domain
- [ ] `Entities/ProductEntity` (Id, Name, Sku, Barcode?, CategoryId, Unit?, IsActive, HasSerial, CreatedAt, UpdatedAt)
- [ ] `Interfaces/IProductRepository`

### 3.2 Application
- [ ] `DTOs/ProductDto`, `CreateProductDto`, `UpdateProductDto`
- [ ] `UseCases/CreateProductUseCase`
- [ ] `UseCases/GetProductByIdUseCase`
- [ ] `UseCases/ListProductsUseCase` (filter CategoryId)
- [ ] `UseCases/UpdateProductUseCase`
- [ ] `UseCases/DeleteProductUseCase`
- [ ] Rules: unique Sku, Category tồn tại

### 3.3 Infrastructure
- [ ] `Persistence/Entities/ProductOrmEntity`
- [ ] `Persistence/Repositories/ProductRepository` implements `IProductRepository`
- [ ] `Mappers/ProductOrmMapper` (Domain ↔ ORM)
- [ ] Index unique: Sku, Barcode (nếu có)

### 3.4 Presentation
- [ ] `Requests/CreateProductRequest` (validate)
- [ ] `Requests/UpdateProductRequest` (validate)
- [ ] `Requests/ListProductsQuery` (paging + search + CategoryId)
- [ ] `Controllers/ProductController` (CRUD)

### 3.5 Module wiring
- [ ] `ProductModule` register providers + `TypeOrmModule.forFeature([...])`

## 4) Phase 4 - Module Stock

### 4.1 Domain
- [ ] `Entities/StockEntity` (Id, GoodsId, ProductId, BatchCode, Qty, UnitCost, ReceivedDate, ExpiredDate?, Note?, CreatedAt, UpdatedAt)
- [ ] `Interfaces/IStockRepository`

### 4.2 Application
- [ ] `DTOs/StockDto`, `CreateStockDto`, `UpdateStockDto`
- [ ] `UseCases/CreateStockUseCase`
- [ ] `UseCases/GetStockByIdUseCase`
- [ ] `UseCases/ListStocksUseCase` (filter GoodsId, ProductId, date range)
- [ ] `UseCases/UpdateStockUseCase` (hạn chế sửa UnitCost/ReceivedDate nếu coi là bất biến)
- [ ] `UseCases/DeleteStockUseCase`
- [ ] Rules: Goods/Product tồn tại, BatchCode unique per Goods/Product, Qty >= 0, ExpiredDate >= ReceivedDate, chỉ có GoodsId hoặc ProductId

### 4.3 Infrastructure
- [ ] `Persistence/Entities/StockOrmEntity`
- [ ] `Persistence/Repositories/StockRepository` implements `IStockRepository`
- [ ] `Mappers/StockOrmMapper` (Domain ↔ ORM)
- [ ] Index unique: (GoodsId, BatchCode) và (ProductId, BatchCode)

### 4.4 Presentation
- [ ] `Requests/CreateStockRequest` (validate)
- [ ] `Requests/UpdateStockRequest` (validate)
- [ ] `Requests/ListStocksQuery` (paging + filter)
- [ ] `Controllers/StockController` (CRUD)

### 4.5 Module wiring
- [ ] `StockModule` register providers + `TypeOrmModule.forFeature([...])`

## 5) Phase 5 - Module Serial

### 5.1 Domain
- [ ] `Entities/SerialEntity` (Id, ProductId, StockId, SerialNumber, Status?, CreatedAt, UpdatedAt)
- [ ] `Interfaces/ISerialRepository`

### 5.2 Application
- [ ] `DTOs/SerialDto`, `CreateSerialDto`, `UpdateSerialDto`
- [ ] `UseCases/CreateSerialUseCase`
- [ ] `UseCases/GetSerialByIdUseCase`
- [ ] `UseCases/ListSerialsUseCase` (filter ProductId, StockId)
- [ ] `UseCases/UpdateSerialUseCase`
- [ ] `UseCases/DeleteSerialUseCase`
- [ ] Rules: SerialNumber unique per Product, Product/Stock tồn tại

### 5.3 Infrastructure
- [ ] `Persistence/Entities/SerialOrmEntity`
- [ ] `Persistence/Repositories/SerialRepository` implements `ISerialRepository`
- [ ] `Mappers/SerialOrmMapper` (Domain ↔ ORM)
- [ ] Index unique: (ProductId, SerialNumber)

### 5.4 Presentation
- [ ] `Requests/CreateSerialRequest` (validate)
- [ ] `Requests/UpdateSerialRequest` (validate)
- [ ] `Requests/ListSerialsQuery` (paging + filter)
- [ ] `Controllers/SerialController` (CRUD)

### 5.5 Module wiring
- [ ] `SerialModule` register providers + `TypeOrmModule.forFeature([...])`

## 6) Database (Migrations + Seed)

- [ ] Migration tạo bảng Category, Goods, Product, Stock, Serial + constraints
- [ ] Index unique (Category.Name, Goods.Sku, Product.Sku, Stock.GoodsId+BatchCode, Stock.ProductId+BatchCode, Serial.ProductId+SerialNumber)
- [ ] Seed mẫu: category/goods/product/stock/serial

## 7) Tests

- [ ] Unit tests cho UseCases (happy path + error cases)
- [ ] Unit tests cho domain rules
- [ ] Integration tests repository (MySQL)
- [ ] E2E tests CRUD endpoints

## 8) Documentation

- [ ] Cập nhật README (mô tả module mới + biến môi trường nếu cần)
- [ ] Swagger decorators cho DTOs mới
