import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetLiveUseCase } from '../../Application/UseCases/GetLiveUseCase';
import { GetReadyUseCase } from '../../Application/UseCases/GetReadyUseCase';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly getLiveUseCase: GetLiveUseCase,
    private readonly getReadyUseCase: GetReadyUseCase,
  ) {}

  @Get('live')
  public async Live() {
    return await this.getLiveUseCase.Execute();
  }

  @Get('ready')
  public async Ready() {
    return await this.getReadyUseCase.Execute();
  }
}
