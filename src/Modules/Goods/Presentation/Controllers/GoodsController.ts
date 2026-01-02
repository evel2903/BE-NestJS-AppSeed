import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateGoodsUseCase } from '../../Application/UseCases/CreateGoodsUseCase';
import { DeleteGoodsUseCase } from '../../Application/UseCases/DeleteGoodsUseCase';
import { GetGoodsByIdUseCase } from '../../Application/UseCases/GetGoodsByIdUseCase';
import { ListGoodsUseCase } from '../../Application/UseCases/ListGoodsUseCase';
import { UpdateGoodsUseCase } from '../../Application/UseCases/UpdateGoodsUseCase';
import { CreateGoodsRequest } from '../Requests/CreateGoodsRequest';
import { ListGoodsQuery } from '../Requests/ListGoodsQuery';
import { UpdateGoodsRequest } from '../Requests/UpdateGoodsRequest';

@Controller('goods')
export class GoodsController {
  constructor(
    private readonly createGoodsUseCase: CreateGoodsUseCase,
    private readonly getGoodsByIdUseCase: GetGoodsByIdUseCase,
    private readonly listGoodsUseCase: ListGoodsUseCase,
    private readonly updateGoodsUseCase: UpdateGoodsUseCase,
    private readonly deleteGoodsUseCase: DeleteGoodsUseCase,
  ) {}

  @Post()
  public async Create(@Body() request: CreateGoodsRequest) {
    return await this.createGoodsUseCase.Execute(request);
  }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    return await this.getGoodsByIdUseCase.Execute(id);
  }

  @Get()
  public async List(@Query() query: ListGoodsQuery) {
    return await this.listGoodsUseCase.Execute(query);
  }

  @Patch(':id')
  public async Update(@Param('id') id: string, @Body() request: UpdateGoodsRequest) {
    return await this.updateGoodsUseCase.Execute({ Id: id, ...request });
  }

  @Delete(':id')
  public async Delete(@Param('id') id: string) {
    await this.deleteGoodsUseCase.Execute(id);
    return { Deleted: true };
  }
}
