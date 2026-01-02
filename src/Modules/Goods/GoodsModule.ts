import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../Category/CategoryModule';
import { CreateGoodsUseCase } from './Application/UseCases/CreateGoodsUseCase';
import { DeleteGoodsUseCase } from './Application/UseCases/DeleteGoodsUseCase';
import { GetGoodsByIdUseCase } from './Application/UseCases/GetGoodsByIdUseCase';
import { ListGoodsUseCase } from './Application/UseCases/ListGoodsUseCase';
import { UpdateGoodsUseCase } from './Application/UseCases/UpdateGoodsUseCase';
import { GOODS_REPOSITORY, IGoodsRepository } from './Domain/Interfaces/IGoodsRepository';
import { GoodsRepository } from './Infrastructure/Persistence/Repositories/GoodsRepository';
import { GoodsOrmEntity } from './Infrastructure/Persistence/Entities/GoodsOrmEntity';
import { GoodsController } from './Presentation/Controllers/GoodsController';
import { CATEGORY_REPOSITORY, ICategoryRepository } from '../Category/Domain/Interfaces/ICategoryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsOrmEntity]), CategoryModule],
  controllers: [GoodsController],
  providers: [
    { provide: GOODS_REPOSITORY, useClass: GoodsRepository },
    {
      provide: CreateGoodsUseCase,
      useFactory: (goodsRepo: IGoodsRepository, categoryRepo: ICategoryRepository) =>
        new CreateGoodsUseCase(goodsRepo, categoryRepo),
      inject: [GOODS_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: GetGoodsByIdUseCase,
      useFactory: (repo: IGoodsRepository) => new GetGoodsByIdUseCase(repo),
      inject: [GOODS_REPOSITORY],
    },
    {
      provide: ListGoodsUseCase,
      useFactory: (repo: IGoodsRepository) => new ListGoodsUseCase(repo),
      inject: [GOODS_REPOSITORY],
    },
    {
      provide: UpdateGoodsUseCase,
      useFactory: (goodsRepo: IGoodsRepository, categoryRepo: ICategoryRepository) =>
        new UpdateGoodsUseCase(goodsRepo, categoryRepo),
      inject: [GOODS_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: DeleteGoodsUseCase,
      useFactory: (repo: IGoodsRepository) => new DeleteGoodsUseCase(repo),
      inject: [GOODS_REPOSITORY],
    },
  ],
  exports: [GOODS_REPOSITORY],
})
export class GoodsModule {}
