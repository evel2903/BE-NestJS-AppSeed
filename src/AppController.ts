import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get('health')
  public GetHealth(): { Status: 'OK' } {
    return { Status: 'OK' };
  }
}
