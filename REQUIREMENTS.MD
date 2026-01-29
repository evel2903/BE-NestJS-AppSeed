# PHÂN TÍCH YÊU CẦU - Web chọn ảnh (Google Drive)

## 1) Vấn đề và mục tiêu
- Vấn đề: Sau khi chụp hình, việc gửi ảnh và nhận lựa chọn ảnh cần chỉnh sửa từ khách hàng rất bất tiện.
- Mục tiêu: Tạo web cho phép nhập link Google Drive (thường là folder), tạo link truy cập + PIN, khách hàng xem và đánh dấu ảnh muốn chỉnh sửa, nhiếp ảnh gia theo dõi được danh sách ảnh đã chọn.

## 2) Đối tượng sử dụng (Actors)
- Nhiếp ảnh gia (Admin): tạo album, cài đặt PIN, xem danh sách ảnh được chọn, quản lý link.
- Khách hàng (Guest): truy cập link + PIN, xem ảnh, đánh dấu ảnh muốn chỉnh sửa.

## 3) Phạm vi
### Trong phạm vi (In-scope)
- Tạo album từ link Google Drive (folder).
- Tạo link truy cập + PIN cho từng album.
- Khách hàng truy cập link, nhập PIN, xem danh sách ảnh, đánh dấu ảnh muốn chỉnh sửa.
- Nhiếp ảnh gia xem danh sách ảnh đã được chọn (theo từng album).
- Quản lý trạng thái album: mở/đóng, đổi PIN, hết hạn link.
- Chỉ có một khách hàng chọn ảnh cho mỗi album (không hỗ trợ nhiều khách cùng lúc).

### Ngoài phạm vi (Out-of-scope) hiện tại
- Thanh toán, đặt cọc, hợp đồng.
- Chỉnh sửa ảnh online.
- Tự động đồng bộ nếu ảnh trong Drive thay đổi (nếu chưa có cron/job).
- Tải xuống/zip ảnh trực tiếp từ server (ưu tiên đọc từ Drive).

## 4) User Stories (tóm tắt)
1) Nhiếp ảnh gia tạo album mới với link Drive và PIN.
2) Nhiếp ảnh gia gửi link + PIN cho khách.
3) Khách hàng mở link, nhập PIN, xem ảnh, đánh dấu ảnh muốn chỉnh sửa.
4) Nhiếp ảnh gia xem danh sách ảnh đã chọn (có thể lọc, xuất danh sách).

## 5) Quy trình chính (Core flows)
### 5.1 Tạo album
- Đầu vào: tên album, link Drive (folder), PIN (4–8 số), tuỳ chọn hết hạn, ghi chú.
- Hệ thống: kiểm tra link, đọc metadata folder, lấy danh sách file ảnh, tạo link truy cập và PIN.

### 5.2 Khách hàng chọn ảnh
- Khách mở link, nhập PIN.
- Hệ thống hiển thị danh sách ảnh (ảnh thu nhỏ/preview, tên file, số thứ tự).
- Khách đánh dấu ảnh muốn chỉnh sửa, có thể bỏ chọn.
- Khách có thể ghi chú yêu cầu chỉnh sửa cho từng ảnh.
- Hệ thống lưu danh sách chọn theo khách (nếu không có tài khoản thì theo session/device).

### 5.3 Nhiếp ảnh gia xem kết quả
- Nhiếp ảnh gia xem danh sách ảnh đã chọn theo album.
- Hiển thị tổng số ảnh được chọn, chi tiết từng file (id/tên/số thứ tự).
- Cho phép xuất danh sách (CSV/JSON) nếu cần.

## 6) Chức năng chi tiết
### 6.1 Quản lý album
- Tạo/sửa/xoá (xoá mềm) album.
- Đổi PIN, tắt/mở link, đặt thời hạn hết hạn.
- Hiển thị thông tin cơ bản: tên, ngày tạo, số lượng ảnh, trạng thái.
- Thiết lập giới hạn số ảnh được chọn (do Admin cấu hình).

### 6.2 Lấy danh sách ảnh từ Google Drive
- Hệ thống sử dụng Google Drive API (read-only) để lấy danh sách file trực tiếp từ Drive.
- Chỉ cho phép file hình (jpg, jpeg, png, heic, webp).
- Lưu metadata cần thiết: fileId, fileName, mimeType, thumbnailLink (nếu có).
- Khi Drive thay đổi, việc tải lại (F5) sẽ phản ánh thay đổi mới nhất.

### 6.3 Lựa chọn ảnh
- Khách hàng có thể đánh dấu/unmark.
- Hệ thống lưu danh sách chọn theo album.
- Nhiếp ảnh gia xem danh sách chọn tại giao diện quản trị.

### 6.4 Bảo mật truy cập
- Truy cập link bắt buộc nhập PIN.
- Giới hạn số lần nhập sai PIN (giới hạn tần suất).
- Có thể hết hạn link theo thời gian.

## 7) Dữ liệu và mô hình (Data model sơ bộ)
- Album
  - Id, Name, DriveFolderUrl, DriveFolderId, PinHash, Status, MaxSelectable, ExpiredAt, CreatedAt, UpdatedAt
- Photo
  - Id, AlbumId, DriveFileId, FileName, MimeType, ThumbnailUrl, OrderIndex, CreatedAt
- Selection
  - Id, AlbumId, PhotoId, ClientId (hoặc SessionId), Note, CreatedAt
- ClientSession
  - Id, AlbumId, DeviceFingerprint/SessionId, CreatedAt, LastSeenAt

## 8) Yêu cầu phi chức năng
- Bảo mật: PIN hash (bcrypt), không lưu PIN plain text.
- Quyền riêng tư: chỉ đọc Drive, không sao chép ảnh về server (nếu không cần).
- Hiệu năng: phân trang/lazy load ảnh, cache danh sách metadata.
- Ổn định: có retry cho Drive API, log lỗi rõ ràng.
- Khả năng mở rộng: hỗ trợ nhiều album, nhiều khách.

## 9) Tích hợp & kỹ thuật
- Google Drive API: cần OAuth 2.0; lưu refresh token cho nhiếp ảnh gia.
- Kiểm tra quyền truy cập folder (Drive share).
- Đồng bộ file (on-demand hoặc theo job).
- Sử dụng các module sẵn có: Auth, Cache, FileUpload (nếu cần), Jobs, Email (thông báo).

## 10) Ranh giới bảo mật
- Khách hàng không cần đăng nhập tài khoản, chỉ cần link + PIN.
- Nhiếp ảnh gia cần đăng nhập (JWT).
- Tất cả thao tác admin bắt buộc auth.

## 11) Acceptance criteria (mục tiêu ban đầu)
- Tạo album từ link Drive thành công và tạo link truy cập + PIN.
- Khách hàng xem ảnh và đánh dấu ảnh muốn.
- Nhiếp ảnh gia xem được danh sách ảnh đã chọn theo từng album.
- PIN được lưu an toàn và không rò rỉ.

## 12) Câu hỏi cần làm rõ
### Đã xác nhận
- Một album chỉ có một khách hàng chọn ảnh.
- Có giới hạn số ảnh được chọn (Admin cấu hình).
- Có ghi chú trên từng ảnh (khách ghi yêu cầu chỉnh sửa).
- Ảnh hiển thị trực tiếp từ Drive; khi Drive thay đổi, tải lại (F5) sẽ cập nhật.
