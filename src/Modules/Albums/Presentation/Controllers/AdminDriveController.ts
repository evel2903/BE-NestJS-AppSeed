import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BusinessRuleException } from '../../../../Common/Exceptions/AppException';
import { JwtAuthGuard } from '../../../Authentication/Presentation/Guards/JwtAuthGuard';
import { JwtUser } from '../../../Authentication/Infrastructure/Jwt/JwtStrategy';
import { DriveCallbackUseCase } from '../../Application/UseCases/DriveCallbackUseCase';
import { DriveDisconnectUseCase } from '../../Application/UseCases/DriveDisconnectUseCase';
import { GetDriveAuthUrlUseCase } from '../../Application/UseCases/GetDriveAuthUrlUseCase';

@ApiTags('Drive')
@UseGuards(JwtAuthGuard)
@Controller('admin/drive/google')
export class AdminDriveController {
  constructor(
    private readonly getDriveAuthUrlUseCase: GetDriveAuthUrlUseCase,
    private readonly driveCallbackUseCase: DriveCallbackUseCase,
    private readonly driveDisconnectUseCase: DriveDisconnectUseCase,
  ) {}

  @Get('auth-url')
  public AuthUrl() {
    return this.getDriveAuthUrlUseCase.Execute();
  }

  @Get('callback')
  public async Callback(@Req() req: Request, @Query('code') code?: string) {
    if (!code) {
      throw new BusinessRuleException('Missing code', { Code: 'DRIVE_CODE_MISSING' });
    }
    const user = (req as Request & { user: JwtUser }).user;
    return await this.driveCallbackUseCase.Execute(user.UserId, code);
  }

  @Post('disconnect')
  public async Disconnect(@Req() req: Request) {
    const user = (req as Request & { user: JwtUser }).user;
    return await this.driveDisconnectUseCase.Execute(user.UserId);
  }
}
