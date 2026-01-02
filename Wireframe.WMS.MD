# Wireframe - WMS

## 1) Màn hình Đăng nhập

- Logo + tên hệ thống
- Email
- Mật khẩu
- Nút Đăng nhập
- Quên mật khẩu (tuỳ chọn)

## 2) Dashboard

- Tổng quan tồn kho
  - Tổng số Goods
  - Tổng số Product
  - Tổng số Stock (lô)
  - Tổng số Serial
- Biểu đồ nhập kho theo ngày (tuỳ chọn)
- Cảnh báo hàng sắp hết (tuỳ chọn)

## 3) Danh mục (Category)

### 3.1 Danh sách
- Bảng: Name, Code, IsActive, CreatedAt, Actions
- Tìm kiếm theo Name/Code
- Pagination
- Nút Thêm mới

### 3.2 Form tạo/sửa
- Name (required)
- Code (optional)
- Description (optional)
- IsActive (checkbox)
- Lưu / Huỷ

## 4) Hàng hoá (Goods - quản lý số lượng)

### 4.1 Danh sách
- Bảng: Name, Sku, Barcode, Category, Unit, IsActive, Actions
- Filter: Category
- Tìm kiếm theo Name/Sku/Barcode
- Pagination
- Nút Thêm mới

### 4.2 Form tạo/sửa
- Name (required)
- Sku (required)
- Barcode (optional)
- Category (required)
- Unit (optional)
- IsActive (checkbox)
- Lưu / Huỷ

## 5) Hàng giá trị (Product - quản lý serial)

### 5.1 Danh sách
- Bảng: Name, Sku, Barcode, Category, Unit, IsActive, Actions
- Filter: Category
- Tìm kiếm theo Name/Sku/Barcode
- Pagination
- Nút Thêm mới

### 5.2 Form tạo/sửa
- Name (required)
- Sku (required)
- Barcode (optional)
- Category (required)
- Unit (optional)
- IsActive (checkbox)
- Lưu / Huỷ

## 6) Lô hàng (Stock)

### 6.1 Danh sách
- Bảng: BatchCode, Goods/Product, Qty, UnitCost, ReceivedDate, ExpiredDate, Actions
- Filter: GoodsId hoặc ProductId, FromDate, ToDate
- Pagination
- Nút Thêm mới

### 6.2 Form tạo/sửa
- Chọn loại hàng: Goods hoặc Product
- Goods/Product (required)
- BatchCode (required)
- Qty (required)
- UnitCost (required)
- ReceivedDate (required)
- ExpiredDate (optional)
- Note (optional)
- Lưu / Huỷ

## 7) Serial (theo Product)

### 7.1 Danh sách
- Bảng: SerialNumber, Product, Stock, Status, CreatedAt, Actions
- Filter: ProductId, StockId, Status
- Tìm kiếm theo SerialNumber
- Pagination
- Nút Thêm mới

### 7.2 Form tạo/sửa
- Product (required)
- Stock (required)
- SerialNumber (required)
- Status (optional)
- Lưu / Huỷ
