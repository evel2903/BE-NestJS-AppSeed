# ERD - Hệ thống chọn ảnh (Album Google Drive)

## 1) Tổng quan quan hệ
- User (Nhiếp ảnh gia) 1 - N Album
- Album 1 - N Photo (cache metadata)
- Album 1 - 1 ClientSession (mỗi album chỉ có 1 khách)
- Album 1 - N Selection
- User 1 - N DriveCredential (lưu refresh token Google Drive)

## 2) Bảng dữ liệu (chi tiết)

### 2.1 Users (đã có trong seed)
- Id (uuid, PK)
- EmailAddress, PasswordHash, ...
- CreatedAt, UpdatedAt

### 2.2 Albums
- Id (uuid, PK)
- OwnerUserId (uuid, FK -> Users.Id)
- Name (varchar)
- PublicId (varchar, unique)  // mã chia sẻ album
- DriveFolderUrl (varchar)
- DriveFolderId (varchar)
- PinHash (varchar)
- MaxSelectable (int)
- Status (enum: Active | Closed | Expired)
- ExpiredAt (datetime, nullable)
- CreatedAt (datetime)
- UpdatedAt (datetime)

**Index/Constraint**
- UQ(Albums.PublicId)
- IX(Albums.OwnerUserId)
- CHK(MaxSelectable >= 1)

### 2.3 Photos (cache metadata từ Drive)
- Id (uuid, PK)
- AlbumId (uuid, FK -> Albums.Id)
- DriveFileId (varchar)
- FileName (varchar)
- MimeType (varchar)
- ThumbnailUrl (varchar, nullable)
- OrderIndex (int, nullable)
- CreatedAt (datetime)
- UpdatedAt (datetime)
- LastSyncedAt (datetime)

**Index/Constraint**
- IX(Photos.AlbumId)
- UQ(Photos.AlbumId, Photos.DriveFileId)

> Ghi chú: Vì ảnh được load trực tiếp từ Drive, bảng Photos chỉ là cache metadata (không phải nguồn sự thật).

### 2.4 Selections
- Id (uuid, PK)
- AlbumId (uuid, FK -> Albums.Id)
- PhotoId (uuid, FK -> Photos.Id, nullable)  // nếu ảnh chưa cache
- DriveFileId (varchar)  // bắt buộc để map với Drive
- ClientSessionId (uuid, FK -> ClientSessions.Id)
- Note (text, nullable)  // yêu cầu chỉnh sửa
- CreatedAt (datetime)

**Index/Constraint**
- IX(Selections.AlbumId)
- UQ(Selections.AlbumId, Selections.DriveFileId)  // không chọn trùng

### 2.5 ClientSessions
- Id (uuid, PK)
- AlbumId (uuid, FK -> Albums.Id, unique)
- SessionTokenHash (varchar)
- DeviceFingerprint (varchar, nullable)
- CreatedAt (datetime)
- LastSeenAt (datetime)
- ExpiresAt (datetime, nullable)

**Index/Constraint**
- UQ(ClientSessions.AlbumId)  // mỗi album chỉ có 1 khách

### 2.6 DriveCredentials
- Id (uuid, PK)
- UserId (uuid, FK -> Users.Id)
- Provider (enum: GoogleDrive)
- RefreshTokenEnc (text)  // mã hoá
- AccessTokenEnc (text, nullable)  // mã hoá
- TokenExpiry (datetime, nullable)
- Scope (varchar)
- CreatedAt (datetime)
- UpdatedAt (datetime)

**Index/Constraint**
- IX(DriveCredentials.UserId)

## 3) Quy tắc & ràng buộc nghiệp vụ
- Album có tối đa 1 ClientSession (một khách cho một album).
- Giới hạn số ảnh được chọn: tổng Selection của album <= Album.MaxSelectable.
- PIN lưu dưới dạng hash (bcrypt), không lưu plain text.
- Ảnh hiển thị trực tiếp từ Drive; F5 sẽ phản ánh dữ liệu mới nhất.
- Selection lưu theo DriveFileId để đảm bảo ổn định khi metadata thay đổi.
