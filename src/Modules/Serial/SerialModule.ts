import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../Product/ProductModule';
import { StockModule } from '../Stock/StockModule';
import { CreateSerialUseCase } from './Application/UseCases/CreateSerialUseCase';
import { DeleteSerialUseCase } from './Application/UseCases/DeleteSerialUseCase';
import { GetSerialByIdUseCase } from './Application/UseCases/GetSerialByIdUseCase';
import { ListSerialsUseCase } from './Application/UseCases/ListSerialsUseCase';
import { UpdateSerialUseCase } from './Application/UseCases/UpdateSerialUseCase';
import { SERIAL_REPOSITORY, ISerialRepository } from './Domain/Interfaces/ISerialRepository';
import { SerialRepository } from './Infrastructure/Persistence/Repositories/SerialRepository';
import { SerialOrmEntity } from './Infrastructure/Persistence/Entities/SerialOrmEntity';
import { SerialController } from './Presentation/Controllers/SerialController';
import { PRODUCT_REPOSITORY, IProductRepository } from '../Product/Domain/Interfaces/IProductRepository';
import { STOCK_REPOSITORY, IStockRepository } from '../Stock/Domain/Interfaces/IStockRepository';

@Module({
  imports: [TypeOrmModule.forFeature([SerialOrmEntity]), ProductModule, StockModule],
  controllers: [SerialController],
  providers: [
    { provide: SERIAL_REPOSITORY, useClass: SerialRepository },
    {
      provide: CreateSerialUseCase,
      useFactory: (
        serialRepo: ISerialRepository,
        productRepo: IProductRepository,
        stockRepo: IStockRepository,
      ) => new CreateSerialUseCase(serialRepo, productRepo, stockRepo),
      inject: [SERIAL_REPOSITORY, PRODUCT_REPOSITORY, STOCK_REPOSITORY],
    },
    {
      provide: GetSerialByIdUseCase,
      useFactory: (repo: ISerialRepository) => new GetSerialByIdUseCase(repo),
      inject: [SERIAL_REPOSITORY],
    },
    {
      provide: ListSerialsUseCase,
      useFactory: (repo: ISerialRepository) => new ListSerialsUseCase(repo),
      inject: [SERIAL_REPOSITORY],
    },
    {
      provide: UpdateSerialUseCase,
      useFactory: (repo: ISerialRepository, stockRepo: IStockRepository) =>
        new UpdateSerialUseCase(repo, stockRepo),
      inject: [SERIAL_REPOSITORY, STOCK_REPOSITORY],
    },
    {
      provide: DeleteSerialUseCase,
      useFactory: (repo: ISerialRepository) => new DeleteSerialUseCase(repo),
      inject: [SERIAL_REPOSITORY],
    },
  ],
  exports: [SERIAL_REPOSITORY],
})
export class SerialModule {}
