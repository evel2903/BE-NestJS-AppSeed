# KẾ HOẠCH TRIỂN KHAI - Hệ thống chọn ảnh (Album Google Drive)

## 1) Mục tiêu
- Cho phép nhiếp ảnh gia tạo album từ link Google Drive và tạo link truy cập + PIN.
- Khách hàng xem ảnh và đánh dấu ảnh cần chỉnh sửa.
- Nhiếp ảnh gia xem danh sách ảnh đã được chọn theo từng album.

## 2) Phạm vi (MVP)
- Tạo album từ folder Google Drive.
- Link truy cập + PIN cho khách hàng.
- Giao diện khách chọn ảnh.
- Giao diện quản trị xem danh sách ảnh đã chọn.
- Bảo mật PIN (hash), giới hạn nhập sai, link có thể hết hạn.

## 3) Kiến trúc tổng quan
- Backend: NestJS (Clean Architecture), MySQL, Redis (cache/rate limit).
- Frontend: Web client (khách) + Web admin (nhiếp ảnh gia).
- Tích hợp: Google Drive API (read-only) qua OAuth 2.0.

## 4) Phân rã module backend
- Album: tạo/sửa/xoá mềm, bật/tắt link, hết hạn.
- Photo: lưu metadata ảnh trong album.
- Selection: lưu lựa chọn ảnh của khách.
- ClientSession: định danh khách theo session/device.
- DriveIntegration: xác thực Drive, đọc folder, đồng bộ metadata.
- Auth: đăng nhập cho nhiếp ảnh gia (JWT).

## 5) Lộ trình triển khai (phases)

### Phase 0 - Chuẩn bị
- [x] Xác nhận yêu cầu còn mở (Câu hỏi cần làm rõ trong REQUIREMENTS.MD).
- [x] Chuẩn hoá thuật ngữ: “Album”, “Ảnh”, “Lựa chọn”. (đã đồng bộ trong REQUIREMENTS.MD)
- [x] Xác định scope MVP và V1. (đã xác nhận: tập trung thiết kế API backend)

#### Scope đã xác nhận (backend API)
- Tập trung thiết kế API cho các luồng: tạo album từ Drive, truy cập bằng PIN, chọn ảnh + ghi chú, admin xem kết quả.
- Không làm UI/Frontend trong phạm vi hiện tại.

### Phase 1 - Thiết kế hệ thống
- [x] Thiết kế data model chi tiết (Album, Photo, Selection, ClientSession, User).
- [x] Xây dựng sơ đồ quan hệ (ERD) và quy tắc ràng buộc.
- [x] Thiết kế API (Admin vs Client) + response format.
- [x] Xác định luồng OAuth 2.0 với Google Drive.

### Phase 2 - Backend (MVP)
- [x] Module Album: CRUD, link + PIN, hết hạn, trạng thái.
- [x] Module Photo: lưu metadata ảnh.
- [x] Module Selection: đánh dấu/bỏ chọn ảnh.
- [x] Module ClientSession: tạo/nhận diện khách theo session.
- [x] DriveIntegration: đọc folder, lọc file ảnh, lưu metadata. (public-only qua API key, chưa có OAuth)
- [x] Bảo mật: PIN hash, rate limit nhập sai, log truy cập.

### Phase 3 - Frontend (MVP)
- [ ] Trang khách: nhập PIN, xem ảnh, đánh dấu ảnh.
- [ ] Trang quản trị: tạo album, xem danh sách ảnh được chọn.
- [ ] Trải nghiệm ảnh: phân trang/lazy load, hiển thị ảnh thu nhỏ.

### Phase 4 - Tối ưu & mở rộng (V1)
- [ ] Xuất danh sách ảnh đã chọn (CSV/JSON).
- [ ] Đồng bộ ảnh theo lịch (Jobs).
- [ ] Thông báo khi khách hoàn tất (Email).
- [ ] Nhật ký thao tác (audit log).

### Phase 5 - Kiểm thử & triển khai
- [ ] Unit tests cho use cases chính.
- [ ] Integration tests với MySQL + Drive API (mock).
- [ ] E2E tests cho flow khách + admin.
- [ ] Docker hoá + hướng dẫn triển khai.

## 6) Ưu tiên thực hiện
1) MVP: Album + PIN + chọn ảnh + xem kết quả.
2) V1: export danh sách + đồng bộ ảnh.
3) V2: thông báo email, ghi chú trên ảnh, đa khách.

## 7) Deliverables
- `REQUIREMENTS.MD` (đã có)
- `ALBUM_PLAN.MD` (kế hoạch triển khai)
- `API_SPEC.MD` (đặc tả API)
- `ERD.md` (mô hình dữ liệu)

## 8) Câu hỏi cần xác nhận trước khi code
### Đã xác nhận
- Một album chỉ có một khách hàng chọn ảnh.
- Có giới hạn số ảnh được chọn (Admin cấu hình).
- Có ghi chú trên từng ảnh (khách ghi yêu cầu chỉnh sửa).
- Ảnh hiển thị trực tiếp từ Drive; khi Drive thay đổi, tải lại (F5) sẽ cập nhật.
