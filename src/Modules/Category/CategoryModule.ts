import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from './Application/UseCases/CreateCategoryUseCase';
import { DeleteCategoryUseCase } from './Application/UseCases/DeleteCategoryUseCase';
import { GetCategoryByIdUseCase } from './Application/UseCases/GetCategoryByIdUseCase';
import { ListCategoriesUseCase } from './Application/UseCases/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from './Application/UseCases/UpdateCategoryUseCase';
import { CATEGORY_REPOSITORY, ICategoryRepository } from './Domain/Interfaces/ICategoryRepository';
import { CategoryRepository } from './Infrastructure/Persistence/Repositories/CategoryRepository';
import { CategoryOrmEntity } from './Infrastructure/Persistence/Entities/CategoryOrmEntity';
import { CategoryController } from './Presentation/Controllers/CategoryController';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoryController],
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
    {
      provide: CreateCategoryUseCase,
      useFactory: (repo: ICategoryRepository) => new CreateCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: GetCategoryByIdUseCase,
      useFactory: (repo: ICategoryRepository) => new GetCategoryByIdUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: ListCategoriesUseCase,
      useFactory: (repo: ICategoryRepository) => new ListCategoriesUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: UpdateCategoryUseCase,
      useFactory: (repo: ICategoryRepository) => new UpdateCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: (repo: ICategoryRepository) => new DeleteCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
