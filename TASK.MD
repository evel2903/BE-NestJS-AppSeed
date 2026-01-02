# TASK - Backend Seed Project (NestJS + MySQL + Clean Architecture)

Tài liệu này chuyển hoá nội dung trong `PLAN.MD` thành checklist công việc chi tiết để triển khai/hoàn thiện seed project.

## 0) Nguyên tắc bắt buộc (áp dụng cho mọi task)

- Tuân thủ Clean Architecture theo từng module (Domain → Application → Infrastructure → Presentation).
- Naming theo phong cách C#/.NET:
  - Class/Interface/Method/Property: `PascalCase`
  - Interface có prefix `I` (vd: `IUserRepository`)
  - Biến cục bộ: `camelCase`
  - File/folder: `PascalCase`
- Domain không phụ thuộc layer khác; Application chỉ phụ thuộc Domain; Infrastructure implement interface từ Domain; Presentation chỉ gọi Application.
- Không expose TypeORM entities ra ngoài Infrastructure; dùng mapper để convert.
- Validate ở Presentation (request DTO) bằng `class-validator` + `class-transformer`.
- Dependency injection qua constructor; provider wiring rõ ràng trong module.

## 1) Phase 0 — Bootstrap dự án (khởi tạo nền tảng)

- [x] Tạo/chuẩn hoá cấu trúc thư mục theo module-based + clean architecture:
  - [x] `src/Common/`
  - [x] `src/Core/`
  - [x] `src/Shared/` (layer dùng chung của app, tách khỏi module Infrastructure)
  - [x] `src/Modules/`
- [x] Thiết lập cấu hình môi trường:
  - [x] `ConfigModule.forRoot({ isGlobal: true })`
  - [x] `.env.example` đầy đủ biến cần thiết (App/DB/JWT)
  - [x] Validate env (khuyến nghị: schema validation) và fail-fast khi thiếu biến
- [x] Thiết lập kết nối MySQL qua TypeORM:
  - [x] Tạo `DatabaseConfig` (host/port/user/pass/db, logging, synchronize theo môi trường)
  - [x] Wiring `TypeOrmModule.forRootAsync(...)`
  - [x] Use `CreateDatabaseConfig` from `src/Shared/Database/Config/DatabaseConfig.ts` in `src/App.module.ts`
- [x] Thiết lập entrypoint và cấu hình global:
  - [x] `Main.ts` bật `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
  - [x] Bật CORS theo config
  - [x] Chuẩn hoá port theo `process.env.PORT`
- [x] Chuẩn hoá tooling (nếu repo có dùng):
  - [x] Scripts npm cho dev/build/test/lint/format
  - [x] ESLint/Prettier (nếu đã có convention trong repo)

## 2) Phase 1 — Common/Core foundation (xài chung)

- [x] `src/Common/`:
  - [x] Base response model (chuẩn hoá format response)
  - [x] Common exceptions (custom exception cho business rule)
  - [x] Common constants/enums (nếu cần)
  - [x] Helpers dùng chung (vd: pagination helper)
- [x] `src/Core/`:
  - [x] Các interface/core contracts dùng chung giữa modules (nếu có)
  - [x] (Tuỳ chọn) Result/Error model chuẩn hoá cho Application layer
- [x] Global Error Handling:
  - [x] Global exception filter (map exception → response chuẩn)
  - [x] Logging lỗi (tối thiểu: error + context request)
- [x] Global Response:
  - [x] Response interceptor (bọc data vào format chuẩn)

## 3) Phase 2 — Module mẫu: Users (đầy đủ 4 layers)

### 3.1 Domain (Modules/Users/Domain)
- [x] `Entities/`:
  - [x] `UserEntity` (Id, FirstName, LastName, EmailAddress, CreatedAt, ...)
- [x] `ValueObjects/` (nếu có):
  - [x] `EmailAddress` (validate format, normalize)
- [x] `Interfaces/`:
  - [x] `IUserRepository` (FindById, FindByEmail, Create, Update, Delete, List/Paginate)

### 3.2 Application (Modules/Users/Application)
- [x] `DTOs/`:
  - [x] `UserDto`, `CreateUserRequest/Response`, `UpdateUserRequest/Response`, ...
- [x] `UseCases/`:
  - [x] `CreateUserUseCase`
  - [x] `GetUserByIdUseCase`
  - [x] `ListUsersUseCase` (pagination)
  - [x] `UpdateUserUseCase`
  - [x] `DeleteUserUseCase`
- [x] Quy tắc nghiệp vụ:
  - [x] Unique email
  - [x] Validate data đầu vào ở Presentation, nhưng business invariants ở Domain/Application

### 3.3 Infrastructure (Modules/Users/Infrastructure)
- [x] `Persistence/`:
  - [x] TypeORM entity (vd: `UserOrmEntity`) mapping DB schema
  - [x] Repository implement `IUserRepository` (vd: `UserRepository`)
- [x] `Mappers/`:
  - [x] Mapper Domain ↔ ORM entity
  - [x] Mapper Domain ↔ DTO (nếu cần tách riêng)
- [x] (Tuỳ chọn) Migration cho bảng Users (nếu dùng migrations)

### 3.4 Presentation (Modules/Users/Presentation)
- [x] `Requests/`:
  - [x] Request DTO + decorators `class-validator`
- [x] `Responses/`:
  - [x] Response DTO (nếu tách riêng với Application DTO)
- [x] `Controllers/`:
  - [x] REST endpoints: create/get/list/update/delete
  - [x] Return response theo chuẩn global response format

### 3.5 Module wiring
- [x] `UserModule`:
  - [x] Register providers cho UseCases
  - [x] Bind `IUserRepository` → implementation trong Infrastructure
  - [x] Import `TypeOrmModule.forFeature([...])` cho Users persistence

## 4) Phase 3 — Authentication & Authorization (Priority 1)

- [x] Tạo module `Authentication` theo 4 layers:
  - [x] Domain: contracts liên quan auth (vd: token, session) + interfaces (vd: `IAuthService` nếu cần)
  - [x] Application: use cases `Login`, `Logout`, (tuỳ chọn) `RefreshToken`, `Register`
  - [x] Infrastructure: JWT implementation, password hashing (bcrypt/argon2), persistence refresh token (nếu dùng)
  - [x] Presentation: controller + request validation
- [x] JWT:
  - [x] Config `JWT_SECRET`, `JWT_EXPIRATION`
  - [x] Guard/Strategy cho JWT (NestJS Passport strategy)
- [x] Authorization:
  - [x] Roles/Permissions model (tối thiểu: role-based)
  - [x] Decorators + Guards (`@Roles(...)`, `RolesGuard`)
- [x] Bảo mật tối thiểu:
  - [x] Hash password, không log credential
  - [x] Chuẩn hoá error message (không leak thông tin nhạy cảm)

## 5) Phase 4 — Tính năng bổ sung (theo priority trong PLAN.MD)

### Priority 1 (Core)
- [x] Configuration management (tách config theo module, validate)
- [x] Logging service (request logging + error logging)
- [x] Global exception filter (hoàn thiện mapping + codes)
- [x] Response interceptor (chuẩn hoá response envelope)

### Priority 2 (Common Features)
- [x] Pagination helper (query params, response metadata)
- [x] File upload module
- [x] Email service (provider interface + implementation)
- [x] Caching (Redis)
- [x] Rate limiting
- [x] API versioning

### Priority 3 (Advanced)
- [x] Database migrations (TypeORM CLI)
- [x] Seeding data
- [x] Background jobs (Bull queue)
- [x] Monitoring & health checks
- [x] Swagger/OpenAPI docs
- [x] Docker configuration

## 6) Phase 5 — Testing & Documentation

- [x] Unit tests:
  - [x] UseCases (happy path + error cases)
  - [x] Domain invariants/value objects
- [ ] Integration tests:
  - [ ] Repository + MySQL (hoặc test container) (nếu có hạ tầng)
- [x] E2E tests (NestJS e2e) cho Users/Auth endpoints
- [x] Tests for all existing modules (Users/Auth/Cache/Email/FileUpload/Jobs/Health/Common)
- [x] Organize tests by module folders under `test/Modules/*`
- [x] Swagger:
  - [x] Setup Swagger module + decorators cơ bản cho DTO
- [x] README:
  - [x] Hướng dẫn setup `.env`, chạy migrations, chạy dev server
  - [x] Scripts cần dùng (dev/test/migration)

## 7) Definition of Done (DoD)

- [ ] Đúng cấu trúc folder/layer theo Clean Architecture cho mỗi module
- [ ] Naming convention PascalCase/C# style được giữ nhất quán
- [ ] Validation hoạt động và chặn field thừa (`whitelist` + `forbidNonWhitelisted`)
- [ ] Không lộ TypeORM entity ra ngoài Infrastructure
- [ ] Error/response chuẩn hoá qua global filter/interceptor
- [x] Tests chạy pass (tối thiểu unit; integration/e2e theo phạm vi)

