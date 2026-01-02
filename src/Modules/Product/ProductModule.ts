import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../Category/CategoryModule';
import { CreateProductUseCase } from './Application/UseCases/CreateProductUseCase';
import { DeleteProductUseCase } from './Application/UseCases/DeleteProductUseCase';
import { GetProductByIdUseCase } from './Application/UseCases/GetProductByIdUseCase';
import { ListProductsUseCase } from './Application/UseCases/ListProductsUseCase';
import { UpdateProductUseCase } from './Application/UseCases/UpdateProductUseCase';
import { PRODUCT_REPOSITORY, IProductRepository } from './Domain/Interfaces/IProductRepository';
import { ProductRepository } from './Infrastructure/Persistence/Repositories/ProductRepository';
import { ProductOrmEntity } from './Infrastructure/Persistence/Entities/ProductOrmEntity';
import { ProductController } from './Presentation/Controllers/ProductController';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../Category/Domain/Interfaces/ICategoryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity]), CategoryModule],
  controllers: [ProductController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    {
      provide: CreateProductUseCase,
      useFactory: (productRepo: IProductRepository, categoryRepo: ICategoryRepository) =>
        new CreateProductUseCase(productRepo, categoryRepo),
      inject: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (repo: IProductRepository) => new GetProductByIdUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (repo: IProductRepository) => new ListProductsUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (productRepo: IProductRepository, categoryRepo: ICategoryRepository) =>
        new UpdateProductUseCase(productRepo, categoryRepo),
      inject: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo: IProductRepository) => new DeleteProductUseCase(repo),
      inject: [PRODUCT_REPOSITORY],
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
