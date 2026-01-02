import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCategoryUseCase } from '../../Application/UseCases/CreateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../Application/UseCases/DeleteCategoryUseCase';
import { GetCategoryByIdUseCase } from '../../Application/UseCases/GetCategoryByIdUseCase';
import { ListCategoriesUseCase } from '../../Application/UseCases/ListCategoriesUseCase';
import { UpdateCategoryUseCase } from '../../Application/UseCases/UpdateCategoryUseCase';
import { CreateCategoryRequest } from '../Requests/CreateCategoryRequest';
import { ListCategoriesQuery } from '../Requests/ListCategoriesQuery';
import { UpdateCategoryRequest } from '../Requests/UpdateCategoryRequest';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Post()
  public async Create(@Body() request: CreateCategoryRequest) {
    return await this.createCategoryUseCase.Execute(request);
  }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    return await this.getCategoryByIdUseCase.Execute(id);
  }

  @Get()
  public async List(@Query() query: ListCategoriesQuery) {
    return await this.listCategoriesUseCase.Execute(query);
  }

  @Patch(':id')
  public async Update(@Param('id') id: string, @Body() request: UpdateCategoryRequest) {
    return await this.updateCategoryUseCase.Execute({ Id: id, ...request });
  }

  @Delete(':id')
  public async Delete(@Param('id') id: string) {
    await this.deleteCategoryUseCase.Execute(id);
    return { Deleted: true };
  }
}
