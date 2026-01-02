import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateProductUseCase } from '../../Application/UseCases/CreateProductUseCase';
import { DeleteProductUseCase } from '../../Application/UseCases/DeleteProductUseCase';
import { GetProductByIdUseCase } from '../../Application/UseCases/GetProductByIdUseCase';
import { ListProductsUseCase } from '../../Application/UseCases/ListProductsUseCase';
import { UpdateProductUseCase } from '../../Application/UseCases/UpdateProductUseCase';
import { CreateProductRequest } from '../Requests/CreateProductRequest';
import { ListProductsQuery } from '../Requests/ListProductsQuery';
import { UpdateProductRequest } from '../Requests/UpdateProductRequest';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  public async Create(@Body() request: CreateProductRequest) {
    return await this.createProductUseCase.Execute(request);
  }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    return await this.getProductByIdUseCase.Execute(id);
  }

  @Get()
  public async List(@Query() query: ListProductsQuery) {
    return await this.listProductsUseCase.Execute(query);
  }

  @Patch(':id')
  public async Update(@Param('id') id: string, @Body() request: UpdateProductRequest) {
    return await this.updateProductUseCase.Execute({ Id: id, ...request });
  }

  @Delete(':id')
  public async Delete(@Param('id') id: string) {
    await this.deleteProductUseCase.Execute(id);
    return { Deleted: true };
  }
}
