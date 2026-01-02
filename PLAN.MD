# Backend Seed Project - NestJS + MySQL + Clean Architecture

## 📋 Tổng Quan Dự Án

Dự án này là một hạt giống (seed/template) để xây dựng Backend API sử dụng NestJS với MySQL, tuân thủ Clean Architecture trong từng module và áp dụng quy ước đặt tên theo phong cách C#/.NET.

### Mục Tiêu
- Tạo cấu trúc dự án chuẩn, có thể tái sử dụng cho các dự án mới
- Áp dụng Clean Architecture để tách biệt business logic khỏi infrastructure
- Sử dụng quy ước đặt tên PascalCase theo C#/.NET cho consistency
- Dễ dàng mở rộng và maintain theo thời gian

### Tech Stack
- **Framework**: NestJS (Node.js framework)
- **Database**: MySQL
- **ORM**: TypeORM
- **Language**: TypeScript
- **Architecture**: Clean Architecture trong Module-based
- **Naming Convention**: C#/.NET style (PascalCase)

## Updates
- `src/Infrastructure` has been renamed to `src/Shared`.
- Runtime DB config uses `src/Shared/Database/Config/DatabaseConfig.ts` via `CreateDatabaseConfig()` in `src/App.module.ts`.
- TypeORM CLI (migrations) uses `src/Shared/Database/TypeOrmDataSource.ts`.

---

## 🏗️ Kiến Trúc Tổng Quan

### Module-Based Architecture
```
src/
├── Common/                    # Shared utilities và base classes
├── Core/                      # Core business logic interfaces
├── Infrastructure/            # External services, database, configs
└── Modules/                   # Feature modules
    ├── Users/                 # User module
    ├── Authentication/        # Auth module
    └── [FeatureName]/        # Other feature modules
```

### Clean Architecture Trong Mỗi Module
Mỗi module tuân thủ Clean Architecture với 4 layers:

```
Modules/[FeatureName]/
├── Domain/                    # Enterprise Business Rules
│   ├── Entities/             # Domain entities
│   ├── ValueObjects/         # Value objects
│   └── Interfaces/           # Repository interfaces
│
├── Application/              # Application Business Rules
│   ├── UseCases/            # Use cases / Services
│   ├── DTOs/                # Data Transfer Objects
│   └── Interfaces/          # Service interfaces
│
├── Infrastructure/           # Frameworks & Drivers
│   ├── Persistence/         # TypeORM repositories
│   ├── Mappers/             # Entity ↔ DTO mappers
│   └── External/            # External API clients
│
└── Presentation/            # Interface Adapters
    ├── Controllers/         # REST controllers
    ├── Requests/            # Request DTOs
    └── Responses/           # Response DTOs
```

---

## 📐 Quy Ước Đặt Tên (C#/.NET Style)

### Tổng Quan Naming Convention

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `UserEntity`, `AuthenticationService` |
| Interfaces | PascalCase với prefix `I` | `IUserRepository`, `IAuthService` |
| Methods | PascalCase | `GetUserById()`, `CreateUser()` |
| Properties | PascalCase | `UserId`, `EmailAddress` |
| Variables | camelCase | `userId`, `emailAddress` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS` |
| Files | PascalCase | `UserEntity.ts`, `IUserRepository.ts` |
| Folders | PascalCase | `Domain/`, `Application/` |

### Chi Tiết Naming Rules

#### 1. Entities (Domain Layer)
```typescript
// ✅ Correct
export class UserEntity {
    public Id: string;
    public FirstName: string;
    public LastName: string;
    public EmailAddress: string;
    public CreatedAt: Date;
}

// ❌ Incorrect
export class user {
    public id: string;
    public first_name: string;
}
```

#### 2. Interfaces
```typescript
// ✅ Correct - Prefix với 'I'
export interface IUserRepository {
    FindById(id: string): Promise<UserEntity | null>;
    Create(user: UserEntity): Promise<UserEntity>;
    Update(user: UserEntity): Promise<void>;
    Delete(id: string): Promise<void>;
}

export interface IAuthenticationService {
    Login(email: string, password: string): Promise<LoginResponse>;
    Logout(userId: string): Promise<void>;
}
```

#### 3. Use Cases / Services (Application Layer)
```typescript
// ✅ Correct
export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: IEmailService
    ) {}

    public async Execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        // Implementation
    }
}

export class UserService implements IUserService {
    public async GetUserById(id: string): Promise<UserDto> {
        // Implementation
    }
}
```

#### 4. Controllers (Presentation Layer)
```typescript
// ✅ Correct
@Controller('users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserUseCase: GetUserUseCase
    ) {}

    @Post()
    public async Create(@Body() request: CreateUserRequest): Promise<CreateUserResponse> {
        return await this.createUserUseCase.Execute(request);
    }

    @Get(':id')
    public async GetById(@Param('id') id: string): Promise<UserResponse> {
        return await this.getUserUseCase.Execute(id);
    }
}
```

#### 5. DTOs (Data Transfer Objects)
```typescript
// ✅ Correct - Suffix với Request/Response/Dto
export class CreateUserRequest {
    public FirstName: string;
    public LastName: string;
    public EmailAddress: string;
    public Password: string;
}

export class CreateUserResponse {
    public UserId: string;
    public Message: string;
}

export class UserDto {
    public Id: string;
    public FullName: string;
    public Email: string;
}
```

---

## 📁 Cấu Trúc Chi Tiết

### Root Structure
```
backend-seed/
├── src/
│   ├── Common/                    # Shared code
│   │   ├── Base/                  # Base classes
│   │   │   ├── BaseEntity.ts
│   │   │   ├── BaseRepository.ts
│   │   │   └── BaseController.ts
│   │   ├── Exceptions/            # Custom exceptions
│   │   │   ├── BusinessException.ts
│   │   │   ├── NotFoundException.ts
│   │   │   └── ValidationException.ts
│   │   ├── Decorators/            # Custom decorators
│   │   ├── Guards/                # Auth guards
│   │   ├── Interceptors/          # Response interceptors
│   │   ├── Pipes/                 # Validation pipes
│   │   └── Utils/                 # Utility functions
│   │
│   ├── Core/                      # Core business interfaces
│   │   ├── Domain/
│   │   │   └── Interfaces/
│   │   │       ├── IEntity.ts
│   │   │       └── IRepository.ts
│   │   └── Application/
│   │       └── Interfaces/
│   │           ├── IUseCase.ts
│   │           └── IMapper.ts
│   │
│   ├── Shared/            # Shared layer
│   │   ├── Database/
│   │   │   ├── Config/
│   │   │   │   └── DatabaseConfig.ts
│   │   │   └── Migrations/
│   │   ├── External/              # External services
│   │   │   ├── Email/
│   │   │   ├── Storage/
│   │   │   └── Payment/
│   │   └── Logging/
│   │
│   ├── Modules/                   # Feature modules
│   │   ├── Users/
│   │   │   ├── Domain/
│   │   │   │   ├── Entities/
│   │   │   │   │   └── UserEntity.ts
│   │   │   │   ├── ValueObjects/
│   │   │   │   │   ├── Email.ts
│   │   │   │   │   └── Password.ts
│   │   │   │   └── Interfaces/
│   │   │   │       └── IUserRepository.ts
│   │   │   │
│   │   │   ├── Application/
│   │   │   │   ├── UseCases/
│   │   │   │   │   ├── CreateUser/
│   │   │   │   │   │   ├── CreateUserUseCase.ts
│   │   │   │   │   │   ├── CreateUserRequest.ts
│   │   │   │   │   │   └── CreateUserResponse.ts
│   │   │   │   │   ├── GetUser/
│   │   │   │   │   ├── UpdateUser/
│   │   │   │   │   └── DeleteUser/
│   │   │   │   ├── DTOs/
│   │   │   │   │   └── UserDto.ts
│   │   │   │   └── Interfaces/
│   │   │   │       └── IUserService.ts
│   │   │   │
│   │   │   ├── Infrastructure/
│   │   │   │   ├── Persistence/
│   │   │   │   │   ├── TypeORM/
│   │   │   │   │   │   ├── Entities/
│   │   │   │   │   │   │   └── UserTypeOrmEntity.ts
│   │   │   │   │   │   └── Repositories/
│   │   │   │   │   │       └── UserRepository.ts
│   │   │   │   │   └── Mappers/
│   │   │   │   │       └── UserMapper.ts
│   │   │   │   └── External/
│   │   │   │
│   │   │   ├── Presentation/
│   │   │   │   ├── Controllers/
│   │   │   │   │   └── UserController.ts
│   │   │   │   ├── Requests/
│   │   │   │   │   ├── CreateUserRequestDto.ts
│   │   │   │   │   └── UpdateUserRequestDto.ts
│   │   │   │   └── Responses/
│   │   │   │       └── UserResponseDto.ts
│   │   │   │
│   │   │   └── UserModule.ts
│   │   │
│   │   ├── Authentication/
│   │   │   └── [Same structure as Users]
│   │   │
│   │   └── [OtherModules]/
│   │
│   ├── Config/                    # Configuration files
│   │   ├── AppConfig.ts
│   │   ├── DatabaseConfig.ts
│   │   └── JwtConfig.ts
│   │
│   ├── App.module.ts
│   └── Main.ts
│
├── test/                          # Test files
│   ├── Unit/
│   └── Integration/
│
├── .env
├── .env.example
├── tsconfig.json
├── package.json
└── nest-cli.json
```

---

## 💻 Code Examples

### 1. Domain Entity
```typescript
// src/Modules/Users/Domain/Entities/UserEntity.ts

import { IEntity } from '@/Core/Domain/Interfaces/IEntity';

export class UserEntity implements IEntity {
    public Id: string;
    public FirstName: string;
    public LastName: string;
    public EmailAddress: string;
    public PasswordHash: string;
    public IsActive: boolean;
    public CreatedAt: Date;
    public UpdatedAt: Date;

    constructor(data: Partial<UserEntity>) {
        Object.assign(this, data);
    }

    public GetFullName(): string {
        return `${this.FirstName} ${this.LastName}`;
    }

    public Activate(): void {
        this.IsActive = true;
        this.UpdatedAt = new Date();
    }

    public Deactivate(): void {
        this.IsActive = false;
        this.UpdatedAt = new Date();
    }
}
```

### 2. Repository Interface
```typescript
// src/Modules/Users/Domain/Interfaces/IUserRepository.ts

import { UserEntity } from '../Entities/UserEntity';

export interface IUserRepository {
    FindById(id: string): Promise<UserEntity | null>;
    FindByEmail(email: string): Promise<UserEntity | null>;
    FindAll(page: number, limit: number): Promise<UserEntity[]>;
    Create(user: UserEntity): Promise<UserEntity>;
    Update(user: UserEntity): Promise<void>;
    Delete(id: string): Promise<void>;
    Exists(id: string): Promise<boolean>;
}
```

### 3. TypeORM Entity
```typescript
// src/Modules/Users/Infrastructure/Persistence/TypeORM/Entities/UserTypeOrmEntity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Users')
export class UserTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    Id: string;

    @Column({ name: 'FirstName', length: 100 })
    FirstName: string;

    @Column({ name: 'LastName', length: 100 })
    LastName: string;

    @Column({ name: 'EmailAddress', unique: true, length: 255 })
    EmailAddress: string;

    @Column({ name: 'PasswordHash', length: 255 })
    PasswordHash: string;

    @Column({ name: 'IsActive', default: true })
    IsActive: boolean;

    @CreateDateColumn({ name: 'CreatedAt' })
    CreatedAt: Date;

    @UpdateDateColumn({ name: 'UpdatedAt' })
    UpdatedAt: Date;
}
```

### 4. Repository Implementation
```typescript
// src/Modules/Users/Infrastructure/Persistence/TypeORM/Repositories/UserRepository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@/Modules/Users/Domain/Interfaces/IUserRepository';
import { UserEntity } from '@/Modules/Users/Domain/Entities/UserEntity';
import { UserTypeOrmEntity } from '../Entities/UserTypeOrmEntity';
import { UserMapper } from '../Mappers/UserMapper';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserTypeOrmEntity)
        private readonly repository: Repository<UserTypeOrmEntity>,
        private readonly mapper: UserMapper
    ) {}

    public async FindById(id: string): Promise<UserEntity | null> {
        const entity = await this.repository.findOne({ where: { Id: id } });
        return entity ? this.mapper.ToDomain(entity) : null;
    }

    public async FindByEmail(email: string): Promise<UserEntity | null> {
        const entity = await this.repository.findOne({ 
            where: { EmailAddress: email } 
        });
        return entity ? this.mapper.ToDomain(entity) : null;
    }

    public async FindAll(page: number, limit: number): Promise<UserEntity[]> {
        const entities = await this.repository.find({
            skip: (page - 1) * limit,
            take: limit,
        });
        return entities.map(e => this.mapper.ToDomain(e));
    }

    public async Create(user: UserEntity): Promise<UserEntity> {
        const entity = this.mapper.ToPersistence(user);
        const saved = await this.repository.save(entity);
        return this.mapper.ToDomain(saved);
    }

    public async Update(user: UserEntity): Promise<void> {
        const entity = this.mapper.ToPersistence(user);
        await this.repository.save(entity);
    }

    public async Delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async Exists(id: string): Promise<boolean> {
        const count = await this.repository.count({ where: { Id: id } });
        return count > 0;
    }
}
```

### 5. Mapper
```typescript
// src/Modules/Users/Infrastructure/Persistence/Mappers/UserMapper.ts

import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/Modules/Users/Domain/Entities/UserEntity';
import { UserTypeOrmEntity } from '../TypeORM/Entities/UserTypeOrmEntity';
import { UserDto } from '@/Modules/Users/Application/DTOs/UserDto';

@Injectable()
export class UserMapper {
    public ToDomain(entity: UserTypeOrmEntity): UserEntity {
        return new UserEntity({
            Id: entity.Id,
            FirstName: entity.FirstName,
            LastName: entity.LastName,
            EmailAddress: entity.EmailAddress,
            PasswordHash: entity.PasswordHash,
            IsActive: entity.IsActive,
            CreatedAt: entity.CreatedAt,
            UpdatedAt: entity.UpdatedAt,
        });
    }

    public ToPersistence(domain: UserEntity): UserTypeOrmEntity {
        const entity = new UserTypeOrmEntity();
        entity.Id = domain.Id;
        entity.FirstName = domain.FirstName;
        entity.LastName = domain.LastName;
        entity.EmailAddress = domain.EmailAddress;
        entity.PasswordHash = domain.PasswordHash;
        entity.IsActive = domain.IsActive;
        entity.CreatedAt = domain.CreatedAt;
        entity.UpdatedAt = domain.UpdatedAt;
        return entity;
    }

    public ToDto(domain: UserEntity): UserDto {
        return {
            Id: domain.Id,
            FullName: domain.GetFullName(),
            Email: domain.EmailAddress,
            IsActive: domain.IsActive,
            CreatedAt: domain.CreatedAt,
        };
    }
}
```

### 6. Use Case
```typescript
// src/Modules/Users/Application/UseCases/CreateUser/CreateUserUseCase.ts

import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@/Modules/Users/Domain/Interfaces/IUserRepository';
import { UserEntity } from '@/Modules/Users/Domain/Entities/UserEntity';
import { CreateUserRequest } from './CreateUserRequest';
import { CreateUserResponse } from './CreateUserResponse';
import { BusinessException } from '@/Common/Exceptions/BusinessException';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    public async Execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        // Validate email uniqueness
        const existingUser = await this.userRepository.FindByEmail(request.EmailAddress);
        if (existingUser) {
            throw new BusinessException('Email address already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(request.Password, 10);

        // Create domain entity
        const user = new UserEntity({
            FirstName: request.FirstName,
            LastName: request.LastName,
            EmailAddress: request.EmailAddress,
            PasswordHash: passwordHash,
            IsActive: true,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        });

        // Persist
        const createdUser = await this.userRepository.Create(user);

        // Return response
        return new CreateUserResponse({
            UserId: createdUser.Id,
            Message: 'User created successfully',
        });
    }
}
```

### 7. Request/Response DTOs
```typescript
// src/Modules/Users/Application/UseCases/CreateUser/CreateUserRequest.ts

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    public FirstName: string;

    @IsString()
    @IsNotEmpty()
    public LastName: string;

    @IsEmail()
    @IsNotEmpty()
    public EmailAddress: string;

    @IsString()
    @MinLength(8)
    public Password: string;
}

// src/Modules/Users/Application/UseCases/CreateUser/CreateUserResponse.ts

export class CreateUserResponse {
    public UserId: string;
    public Message: string;

    constructor(data: Partial<CreateUserResponse>) {
        Object.assign(this, data);
    }
}
```

### 8. Controller
```typescript
// src/Modules/Users/Presentation/Controllers/UserController.ts

import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CreateUserUseCase } from '@/Modules/Users/Application/UseCases/CreateUser/CreateUserUseCase';
import { GetUserUseCase } from '@/Modules/Users/Application/UseCases/GetUser/GetUserUseCase';
import { UpdateUserUseCase } from '@/Modules/Users/Application/UseCases/UpdateUser/UpdateUserUseCase';
import { DeleteUserUseCase } from '@/Modules/Users/Application/UseCases/DeleteUser/DeleteUserUseCase';
import { CreateUserRequest } from '@/Modules/Users/Application/UseCases/CreateUser/CreateUserRequest';
import { UpdateUserRequest } from '@/Modules/Users/Application/UseCases/UpdateUser/UpdateUserRequest';

@Controller('api/users')
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async Create(@Body() request: CreateUserRequest) {
        return await this.createUserUseCase.Execute(request);
    }

    @Get(':id')
    public async GetById(@Param('id') id: string) {
        return await this.getUserUseCase.Execute(id);
    }

    @Get()
    public async GetAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return await this.getUserUseCase.ExecuteGetAll(page, limit);
    }

    @Put(':id')
    public async Update(
        @Param('id') id: string,
        @Body() request: UpdateUserRequest
    ) {
        return await this.updateUserUseCase.Execute(id, request);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async Delete(@Param('id') id: string) {
        await this.deleteUserUseCase.Execute(id);
    }
}
```

### 9. Module Configuration
```typescript
// src/Modules/Users/UserModule.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './Infrastructure/Persistence/TypeORM/Entities/UserTypeOrmEntity';
import { UserRepository } from './Infrastructure/Persistence/TypeORM/Repositories/UserRepository';
import { UserMapper } from './Infrastructure/Persistence/Mappers/UserMapper';
import { CreateUserUseCase } from './Application/UseCases/CreateUser/CreateUserUseCase';
import { GetUserUseCase } from './Application/UseCases/GetUser/GetUserUseCase';
import { UpdateUserUseCase } from './Application/UseCases/UpdateUser/UpdateUserUseCase';
import { DeleteUserUseCase } from './Application/UseCases/DeleteUser/DeleteUserUseCase';
import { UserController } from './Presentation/Controllers/UserController';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserTypeOrmEntity]),
    ],
    controllers: [UserController],
    providers: [
        // Repositories
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        
        // Mappers
        UserMapper,
        
        // Use Cases
        CreateUserUseCase,
        GetUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
    ],
    exports: [
        'IUserRepository',
        CreateUserUseCase,
        GetUserUseCase,
    ],
})
export class UserModule {}
```

---

## 🔧 Implementation Steps

### Phase 1: Project Setup
1. **Khởi tạo NestJS project**
   ```bash
   npm i -g @nestjs/cli
   nest new backend-seed
   cd backend-seed
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install @nestjs/typeorm typeorm mysql2
   npm install @nestjs/config
   npm install class-validator class-transformer
   npm install bcrypt
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt
   npm install --save-dev @types/bcrypt @types/passport-jwt
   ```

3. **Cấu hình TypeScript**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "module": "commonjs",
       "declaration": true,
       "removeComments": true,
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true,
       "allowSyntheticDefaultImports": true,
       "target": "ES2021",
       "sourceMap": true,
       "outDir": "./dist",
       "baseUrl": "./",
       "incremental": true,
       "skipLibCheck": true,
       "strictNullChecks": true,
       "noImplicitAny": false,
       "strictBindCallApply": false,
       "forceConsistentCasingInFileNames": false,
       "noFallthroughCasesInSwitch": false,
       "paths": {
         "@/*": ["src/*"],
         "@/Common/*": ["src/Common/*"],
         "@/Core/*": ["src/Core/*"],
         "@/Shared/*": ["src/Shared/*"],
         "@/Modules/*": ["src/Modules/*"]
       }
     }
   }
   ```

### Phase 2: Core Infrastructure
1. **Tạo cấu trúc thư mục cơ bản**
   ```bash
   mkdir -p src/{Common,Core,Shared,Modules,Config}
   mkdir -p src/Common/{Base,Exceptions,Decorators,Guards,Interceptors,Pipes,Utils}
   mkdir -p src/Core/{Domain,Application}
   mkdir -p src/Shared/{Database,External,Logging}
   ```

2. **Setup Database Configuration**
   ```typescript
   // src/Shared/Database/Config/DatabaseConfig.ts
   import { TypeOrmModuleOptions } from '@nestjs/typeorm';
   
   export const DatabaseConfig: TypeOrmModuleOptions = {
       type: 'mysql',
       host: process.env.DB_HOST || 'localhost',
       port: parseInt(process.env.DB_PORT) || 3306,
       username: process.env.DB_USERNAME || 'root',
       password: process.env.DB_PASSWORD || '',
       database: process.env.DB_DATABASE || 'backend_seed',
       entities: [__dirname + '/../../../**/*.TypeOrmEntity{.ts,.js}'],
       synchronize: process.env.NODE_ENV !== 'production',
       logging: process.env.NODE_ENV === 'development',
   };
   ```

3. **Tạo Base Classes**
   ```typescript
   // src/Common/Base/BaseEntity.ts
   export abstract class BaseEntity {
       public Id: string;
       public CreatedAt: Date;
       public UpdatedAt: Date;
   }
   
   // src/Core/Domain/Interfaces/IEntity.ts
   export interface IEntity {
       Id: string;
   }
   
   // src/Core/Domain/Interfaces/IRepository.ts
   export interface IRepository<T extends IEntity> {
       FindById(id: string): Promise<T | null>;
       Create(entity: T): Promise<T>;
       Update(entity: T): Promise<void>;
       Delete(id: string): Promise<void>;
   }
   ```

4. **Tạo Custom Exceptions**
   ```typescript
   // src/Common/Exceptions/BusinessException.ts
   export class BusinessException extends Error {
       constructor(message: string) {
           super(message);
           this.name = 'BusinessException';
       }
   }
   
   // src/Common/Exceptions/NotFoundException.ts
   export class NotFoundException extends Error {
       constructor(resource: string, id: string) {
           super(`${resource} with ID ${id} not found`);
           this.name = 'NotFoundException';
       }
   }
   ```

### Phase 3: Create First Module (Users)
1. **Tạo cấu trúc User module**
   ```bash
   mkdir -p src/Modules/Users/{Domain,Application,Infrastructure,Presentation}
   mkdir -p src/Modules/Users/Domain/{Entities,ValueObjects,Interfaces}
   mkdir -p src/Modules/Users/Application/{UseCases,DTOs,Interfaces}
   mkdir -p src/Modules/Users/Infrastructure/{Persistence,External}
   mkdir -p src/Modules/Users/Infrastructure/Persistence/{TypeORM,Mappers}
   mkdir -p src/Modules/Users/Presentation/{Controllers,Requests,Responses}
   ```

2. **Implement Domain Layer** (xem code examples phía trên)

3. **Implement Infrastructure Layer** (xem code examples phía trên)

4. **Implement Application Layer** (xem code examples phía trên)

5. **Implement Presentation Layer** (xem code examples phía trên)

6. **Configure Module** (xem code examples phía trên)

### Phase 4: Global Configuration
1. **Setup App Module**
   ```typescript
   // src/App.module.ts
   import { Module } from '@nestjs/common';
   import { ConfigModule } from '@nestjs/config';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { DatabaseConfig } from './Shared/Database/Config/DatabaseConfig';
   import { UserModule } from './Modules/Users/UserModule';
   
   @Module({
       imports: [
           ConfigModule.forRoot({ isGlobal: true }),
           TypeOrmModule.forRoot(DatabaseConfig),
           UserModule,
       ],
   })
   export class AppModule {}
   ```

2. **Setup Main Entry Point**
   ```typescript
   // src/Main.ts
   import { NestFactory } from '@nestjs/core';
   import { ValidationPipe } from '@nestjs/common';
   import { AppModule } from './App.module';
   
   async function Bootstrap() {
       const app = await NestFactory.create(AppModule);
       
       app.useGlobalPipes(
           new ValidationPipe({
               whitelist: true,
               forbidNonWhitelisted: true,
               transform: true,
           })
       );
       
       app.enableCors();
       
       const port = process.env.PORT || 3000;
       await app.listen(port);
       
       console.log(`🚀 Application is running on: http://localhost:${port}`);
   }
   
   Bootstrap();
   ```

### Phase 5: Testing & Documentation
1. **Setup Unit Tests**
2. **Setup Integration Tests**
3. **Add API Documentation (Swagger)**
4. **Add README.md**

---

## ✅ Best Practices

### 1. Dependency Injection
- Luôn sử dụng interface cho dependencies
- Inject qua constructor
- Sử dụng providers trong module config

### 2. Error Handling
- Tạo custom exceptions cho business logic
- Sử dụng global exception filter
- Log errors properly

### 3. Validation
- Validate ở Presentation layer (DTOs)
- Sử dụng class-validator decorators
- Transform data với class-transformer

### 4. Database
- Không expose TypeORM entities ra ngoài Infrastructure layer
- Luôn sử dụng Mapper để convert
- Sử dụng transactions cho operations phức tạp

### 5. Clean Architecture Principles
- Domain layer không depend vào bất kỳ layer nào
- Application layer chỉ depend vào Domain
- Infrastructure implement interfaces từ Domain
- Presentation chỉ gọi Application layer

### 6. Naming Conventions
- Luôn tuân thủ PascalCase cho C#/.NET style
- File names match class names
- Rõ ràng về naming suffix (Entity, Repository, UseCase, etc.)

---

## 📦 Additional Features to Implement

### Priority 1 (Core)
- [ ] Authentication Module (JWT)
- [ ] Authorization (Guards & Decorators)
- [ ] Global Exception Filter
- [ ] Response Interceptor (standardized response format)
- [ ] Logging Service
- [ ] Configuration Management

### Priority 2 (Common Features)
- [ ] Pagination Helper
- [ ] File Upload Module
- [ ] Email Service
- [ ] Caching (Redis)
- [ ] Rate Limiting
- [ ] API Versioning

### Priority 3 (Advanced)
- [ ] Database Migrations
- [ ] Seeding Data
- [ ] Background Jobs (Bull Queue)
- [ ] Monitoring & Health Checks
- [ ] Documentation (Swagger/OpenAPI)
- [ ] Docker Configuration

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn

### Quick Start
```bash
# Clone seed project
git clone <repository-url>
cd backend-seed

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env với database credentials

# Run migrations
npm run migration:run

# Start development server
npm run start:dev

# Application runs on http://localhost:3000
```

### Environment Variables
```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=backend_seed

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h
```

---

## 📚 References

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)

---

## 📝 Notes

### Khi thêm module mới:
1. Tạo cấu trúc thư mục theo template
2. Implement các layers theo thứ tự: Domain → Infrastructure → Application → Presentation
3. Register module trong App.module.ts
4. Viết tests
5. Update documentation

### Migration Strategy:
- Development: Sử dụng `synchronize: true`
- Production: Sử dụng migrations với TypeORM CLI

### Code Review Checklist:
- [ ] Naming conventions đúng chuẩn PascalCase
- [ ] Separation of concerns rõ ràng
- [ ] Dependencies inject đúng cách
- [ ] Error handling đầy đủ
- [ ] Validation đầy đủ
- [ ] Tests coverage đủ

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Author**: Backend Team
