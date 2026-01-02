import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsModule } from '../Goods/GoodsModule';
import { ProductModule } from '../Product/ProductModule';
import { CreateStockUseCase } from './Application/UseCases/CreateStockUseCase';
import { DeleteStockUseCase } from './Application/UseCases/DeleteStockUseCase';
import { GetStockByIdUseCase } from './Application/UseCases/GetStockByIdUseCase';
import { ListStocksUseCase } from './Application/UseCases/ListStocksUseCase';
import { UpdateStockUseCase } from './Application/UseCases/UpdateStockUseCase';
import { STOCK_REPOSITORY, IStockRepository } from './Domain/Interfaces/IStockRepository';
import { StockRepository } from './Infrastructure/Persistence/Repositories/StockRepository';
import { StockOrmEntity } from './Infrastructure/Persistence/Entities/StockOrmEntity';
import { StockController } from './Presentation/Controllers/StockController';
import { GOODS_REPOSITORY, IGoodsRepository } from '../Goods/Domain/Interfaces/IGoodsRepository';
import { PRODUCT_REPOSITORY, IProductRepository } from '../Product/Domain/Interfaces/IProductRepository';

@Module({
  imports: [TypeOrmModule.forFeature([StockOrmEntity]), GoodsModule, ProductModule],
  controllers: [StockController],
  providers: [
    { provide: STOCK_REPOSITORY, useClass: StockRepository },
    {
      provide: CreateStockUseCase,
      useFactory: (
        stockRepo: IStockRepository,
        goodsRepo: IGoodsRepository,
        productRepo: IProductRepository,
      ) => new CreateStockUseCase(stockRepo, goodsRepo, productRepo),
      inject: [STOCK_REPOSITORY, GOODS_REPOSITORY, PRODUCT_REPOSITORY],
    },
    {
      provide: GetStockByIdUseCase,
      useFactory: (repo: IStockRepository) => new GetStockByIdUseCase(repo),
      inject: [STOCK_REPOSITORY],
    },
    {
      provide: ListStocksUseCase,
      useFactory: (repo: IStockRepository) => new ListStocksUseCase(repo),
      inject: [STOCK_REPOSITORY],
    },
    {
      provide: UpdateStockUseCase,
      useFactory: (repo: IStockRepository) => new UpdateStockUseCase(repo),
      inject: [STOCK_REPOSITORY],
    },
    {
      provide: DeleteStockUseCase,
      useFactory: (repo: IStockRepository) => new DeleteStockUseCase(repo),
      inject: [STOCK_REPOSITORY],
    },
  ],
  exports: [STOCK_REPOSITORY],
})
export class StockModule {}
