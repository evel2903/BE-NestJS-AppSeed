import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSerialUseCase } from '../../Application/UseCases/CreateSerialUseCase';
import { DeleteSerialUseCase } from '../../Application/UseCases/DeleteSerialUseCase';
import { GetSerialByIdUseCase } from '../../Application/UseCases/GetSerialByIdUseCase';
import { ListSerialsUseCase } from '../../Application/UseCases/ListSerialsUseCase';
import { UpdateSerialUseCase } from '../../Application/UseCases/UpdateSerialUseCase';
import { CreateSerialRequest } from '../Requests/CreateSerialRequest';
import { ListSerialsQuery } from '../Requests/ListSerialsQuery';
import { UpdateSerialRequest } from '../Requests/UpdateSerialRequest';

@Controller('serials')
export class SerialController {
  constructor(
    private readonly createSerialUseCase: CreateSerialUseCase,
    private readonly getSerialByIdUseCase: GetSerialByIdUseCase,
    private readonly listSerialsUseCase: ListSerialsUseCase,
    private readonly updateSerialUseCase: UpdateSerialUseCase,
    private readonly deleteSerialUseCase: DeleteSerialUseCase,
  ) {}

  @Post()
  public async Create(@Body() request: CreateSerialRequest) {
    return await this.createSerialUseCase.Execute(request);
  }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    return await this.getSerialByIdUseCase.Execute(id);
  }

  @Get()
  public async List(@Query() query: ListSerialsQuery) {
    return await this.listSerialsUseCase.Execute(query);
  }

  @Patch(':id')
  public async Update(@Param('id') id: string, @Body() request: UpdateSerialRequest) {
    return await this.updateSerialUseCase.Execute({ Id: id, ...request });
  }

  @Delete(':id')
  public async Delete(@Param('id') id: string) {
    await this.deleteSerialUseCase.Execute(id);
    return { Deleted: true };
  }
}
