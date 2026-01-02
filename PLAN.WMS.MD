# PLAN - Hệ thống quản lý kho (Master Data)

## 1) Phạm vi giai đoạn 1 (Master Data)

- Category (danh mục)
- Goods (hàng hóa)
- Product (hàng giá trị, quản lý serial)
- Stock (lô hàng nhập) - mỗi Goods có nhiều Stock, mỗi Stock có giá nhập và ngày nhập riêng

## 2) Mục tiêu

- Xây dựng 3 module theo Clean Architecture: Domain, Application, Infrastructure, Presentation
- CRUD + list/paginate + filter cho Category, Goods, Stock
- Ràng buộc nghiệp vụ cơ bản để mở rộng về sau (inventory, movement, costing)

## 3) Mô hình domain (dự kiến)

### 3.1 Category
- Id (uuid)
- Name (string, required, unique)
- Code (string, unique, optional)
- Description (string, optional)
- IsActive (bool)
- CreatedAt, UpdatedAt

### 3.2 Goods
- Id (uuid)
- Name (string, required)
- Sku (string, required, unique)
- Barcode (string, unique, optional)
- CategoryId (fk Category)
- Unit (string, optional) - vd: pcs, kg
- IsActive (bool)
- CreatedAt, UpdatedAt

### 3.3 Product (Hàng giá trị)
- Id (uuid)
- Name (string, required)
- Sku (string, required, unique)
- Barcode (string, unique, optional)
- CategoryId (fk Category)
- Unit (string, optional)
- IsActive (bool)
- HasSerial (bool, default true)
- CreatedAt, UpdatedAt

### 3.4 Stock (Lô hàng nhập)
- Id (uuid)
- GoodsId (fk Goods) - dùng cho hàng quản lý theo số lượng
- ProductId (fk Product) - dùng cho hàng giá trị
- BatchCode (string, required, unique per Goods)
- Qty (number, required)
- UnitCost (number, required) - giá nhập
- ReceivedDate (date, required)
- ExpiredDate (date, optional)
- Note (string, optional)
- CreatedAt, UpdatedAt

### 3.5 Serial (quản lý serial theo Product)
- Id (uuid)
- ProductId (fk Product)
- StockId (fk Stock)
- SerialNumber (string, required, unique per Product)
- Status (string, optional)
- CreatedAt, UpdatedAt

### 3.6 Quan hệ
- Category 1-n Goods
- Category 1-n Product
- Goods 1-n Stock
- Product 1-n Stock
- Product 1-n Serial
- Stock 1-n Serial

### 3.7 Invariants
- Goods phải thuộc Category tồn tại
- Product phải thuộc Category tồn tại
- Stock phải thuộc Goods tồn tại
- Stock phải thuộc Product tồn tại (tùy theo loại hàng)
- Stock batch có UnitCost + ReceivedDate bắt buộc
- Stock Qty >= 0
- Stock ExpiredDate nếu có thì >= ReceivedDate
- Stock chỉ được gắn GoodsId hoặc ProductId (không đồng thời)
- SerialNumber unique theo từng Product
- Serial phải gắn với Product và Stock hợp lệ

## 4) API (dự kiến)

### 4.1 Category
- POST /categories
- GET /categories/:id
- GET /categories?Page=&PageSize=&Search=
- PATCH /categories/:id
- DELETE /categories/:id (soft delete nếu cần)

### 4.2 Goods
- POST /goods
- GET /goods/:id
- GET /goods?Page=&PageSize=&Search=&CategoryId=
- PATCH /goods/:id
- DELETE /goods/:id

### 4.3 Product
- POST /products
- GET /products/:id
- GET /products?Page=&PageSize=&Search=&CategoryId=
- PATCH /products/:id
- DELETE /products/:id

### 4.4 Stock
- POST /stocks
- GET /stocks/:id
- GET /stocks?Page=&PageSize=&GoodsId=&ProductId=&FromDate=&ToDate=
- PATCH /stocks/:id (chỉ cho phép cập nhật thông tin phụ, tránh sửa UnitCost/ReceivedDate nếu đã quy định bất biến)
- DELETE /stocks/:id

## 5) DTO + Validation

- Request DTO dùng class-validator
- Query DTO dùng class-transformer (paging, filter)
- Validation rules:
  - Name, Sku, BatchCode không rỗng, max length
  - UnitCost, Qty là số dương (>= 0)
  - ReceivedDate là date hợp lệ

## 6) Infrastructure

- TypeORM entities cho Category, Goods, Product, Stock, Serial
- Repository implement interface ở Domain
- Mapper: Domain <-> ORM, Domain <-> DTO
- Indexes: unique (Category.Name, Goods.Sku, Product.Sku, Stock.GoodsId+BatchCode, Stock.ProductId+BatchCode, Serial.ProductId+SerialNumber)

## 7) Migrations + Seed

- Migration tạo 5 bảng + constraints
- Seed sample category/goods/product/stock/serial

## 8) Tests

- Unit tests: domain value objects, use cases
- Integration: repository với MySQL
- E2E: CRUD endpoints

## 9) Milestones (gợi ý)

1) Mô hình domain + migrations
2) CRUD Category
3) CRUD Goods
4) CRUD Product
5) CRUD Stock
6) Tests + doc update
