# API SPEC - Hệ thống chọn ảnh (Album Google Drive)

## 0) Quy ước chung
- Base URL: `/api`
- Versioning: header `X-API-Version` (mặc định `1` nếu thiếu)
- Auth Admin: `Authorization: Bearer <JWT>`
- Auth Guest: `X-Guest-Token: <token>`
- Response chuẩn:

```json
{
  "Success": true,
  "Data": { }
}
```

```json
{
  "Success": false,
  "Errors": [
    { "Code": "ERROR_CODE", "Message": "...", "Details": {} }
  ]
}
```

## 1) Auth & Drive Integration (Admin)

### 1.1 Lấy URL OAuth Google Drive
- **GET** `/admin/drive/google/auth-url`
- **Response**
```json
{
  "AuthUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### 1.2 Callback OAuth (Google redirect)
- **GET** `/admin/drive/google/callback?code=...`
- **Kết quả**: exchange code -> token, lưu `RefreshTokenEnc`.

### 1.3 Ngắt kết nối Drive
- **POST** `/admin/drive/google/disconnect`

## 2) Album (Admin)

### 2.1 Tạo album
- **POST** `/admin/albums`
- **Body**
```json
{
  "Name": "Wedding - Linh & Nam",
  "DriveFolderUrl": "https://drive.google.com/drive/folders/...",
  "Pin": "1234",
  "MaxSelectable": 30,
  "ExpiredAt": "2026-03-01T00:00:00Z"
}
```
- **Response**
```json
{
  "Id": "uuid",
  "PublicId": "ALB_8X2KQ",
  "ShareUrl": "https://your-domain.com/a/ALB_8X2KQ",
  "Status": "Active",
  "MaxSelectable": 30
}
```

### 2.2 Danh sách album
- **GET** `/admin/albums`
- **Query**: `Page`, `Limit`, `Status`

### 2.3 Chi tiết album
- **GET** `/admin/albums/{albumId}`

### 2.4 Cập nhật album
- **PATCH** `/admin/albums/{albumId}`
- **Body**
```json
{
  "Name": "Wedding - Linh & Nam",
  "Pin": "5678",
  "MaxSelectable": 40,
  "ExpiredAt": "2026-04-01T00:00:00Z",
  "Status": "Closed"
}
```

### 2.5 Xem danh sách ảnh đã chọn
- **GET** `/admin/albums/{albumId}/selections`
- **Query**: `Page`, `Limit`
- **Response**
```json
{
  "TotalSelected": 12,
  "Items": [
    {
      "DriveFileId": "1Abc...",
      "FileName": "IMG_001.jpg",
      "ThumbnailUrl": "...",
      "Note": "Retouch da",
      "SelectedAt": "2026-01-01T10:00:00Z"
    }
  ]
}
```

### 2.6 Xem danh sách ảnh trong album (trực tiếp từ Drive)
- **GET** `/admin/albums/{albumId}/photos`
- **Query**: `Refresh=true|false`, `PageToken` (Drive)

## 3) Album (Guest)

### 3.1 Xác thực PIN
- **POST** `/public/albums/{publicId}/verify-pin`
- **Body**
```json
{ "Pin": "1234" }
```
- **Response**
```json
{
  "GuestToken": "guest_token",
  "Album": {
    "Id": "uuid",
    "Name": "Wedding - Linh & Nam",
    "MaxSelectable": 30,
    "ExpiredAt": "2026-03-01T00:00:00Z"
  }
}
```
- **Rule**: Mỗi album chỉ có 1 khách. Nếu đã có khách khác đang chọn, trả lỗi `ALBUM_ALREADY_ASSIGNED`.

### 3.2 Danh sách ảnh trong album
- **GET** `/public/albums/{publicId}/photos`
- **Header**: `X-Guest-Token`
- **Query**: `PageToken` (Drive)
- **Response**
```json
{
  "Items": [
    {
      "DriveFileId": "1Abc...",
      "FileName": "IMG_001.jpg",
      "MimeType": "image/jpeg",
      "ThumbnailUrl": "...",
      "IsSelected": true,
      "Note": "Retouch da"
    }
  ]
}
```

### 3.3 Chọn/bỏ chọn ảnh (kèm ghi chú)
- **PATCH** `/public/albums/{publicId}/selections/{driveFileId}`
- **Header**: `X-Guest-Token`
- **Body**
```json
{
  "IsSelected": true,
  "Note": "Xoá mụn, làm trắng răng"
}
```
- **Rule**: Tổng số ảnh đã chọn <= `MaxSelectable`. Nếu vượt, trả lỗi `MAX_SELECTION_EXCEEDED`.

### 3.4 Gửi danh sách chọn hàng loạt (tuỳ chọn)
- **PUT** `/public/albums/{publicId}/selections`
- **Header**: `X-Guest-Token`
- **Body**
```json
{
  "Items": [
    { "DriveFileId": "1Abc...", "IsSelected": true, "Note": "..." }
  ]
}
```

## 4) Quy tắc lỗi (Error codes gợi ý)
- `INVALID_PIN`
- `ALBUM_EXPIRED`
- `ALBUM_CLOSED`
- `ALBUM_ALREADY_ASSIGNED`
- `MAX_SELECTION_EXCEEDED`
- `DRIVE_NOT_CONNECTED`
- `DRIVE_FOLDER_NOT_ACCESSIBLE`
