import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateStockUseCase } from '../../Application/UseCases/CreateStockUseCase';
import { DeleteStockUseCase } from '../../Application/UseCases/DeleteStockUseCase';
import { GetStockByIdUseCase } from '../../Application/UseCases/GetStockByIdUseCase';
import { ListStocksUseCase } from '../../Application/UseCases/ListStocksUseCase';
import { UpdateStockUseCase } from '../../Application/UseCases/UpdateStockUseCase';
import { CreateStockRequest } from '../Requests/CreateStockRequest';
import { ListStocksQuery } from '../Requests/ListStocksQuery';
import { UpdateStockRequest } from '../Requests/UpdateStockRequest';

@Controller('stocks')
export class StockController {
  constructor(
    private readonly createStockUseCase: CreateStockUseCase,
    private readonly getStockByIdUseCase: GetStockByIdUseCase,
    private readonly listStocksUseCase: ListStocksUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
    private readonly deleteStockUseCase: DeleteStockUseCase,
  ) {}

  @Post()
  public async Create(@Body() request: CreateStockRequest) {
    return await this.createStockUseCase.Execute(request);
  }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    return await this.getStockByIdUseCase.Execute(id);
  }

  @Get()
  public async List(@Query() query: ListStocksQuery) {
    return await this.listStocksUseCase.Execute(query);
  }

  @Patch(':id')
  public async Update(@Param('id') id: string, @Body() request: UpdateStockRequest) {
    return await this.updateStockUseCase.Execute({ Id: id, ...request });
  }

  @Delete(':id')
  public async Delete(@Param('id') id: string) {
    await this.deleteStockUseCase.Execute(id);
    return { Deleted: true };
  }
}
