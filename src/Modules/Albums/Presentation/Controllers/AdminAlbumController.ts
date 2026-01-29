import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../Authentication/Presentation/Guards/JwtAuthGuard';
import { JwtUser } from '../../../Authentication/Infrastructure/Jwt/JwtStrategy';
import { CreateAlbumUseCase } from '../../Application/UseCases/CreateAlbumUseCase';
import { GetAlbumUseCase } from '../../Application/UseCases/GetAlbumUseCase';
import { ListAlbumsUseCase } from '../../Application/UseCases/ListAlbumsUseCase';
import { UpdateAlbumUseCase } from '../../Application/UseCases/UpdateAlbumUseCase';
import { ListAlbumSelectionsUseCase } from '../../Application/UseCases/ListAlbumSelectionsUseCase';
import { ListAlbumPhotosUseCase } from '../../Application/UseCases/ListAlbumPhotosUseCase';
import { CreateAlbumRequest } from '../Requests/CreateAlbumRequest';
import { ListAlbumsQuery } from '../Requests/ListAlbumsQuery';
import { UpdateAlbumRequest } from '../Requests/UpdateAlbumRequest';
import { ListSelectionsQuery } from '../Requests/ListSelectionsQuery';
import { ListPhotosQuery } from '../Requests/ListPhotosQuery';

@ApiTags('Albums.Admin')
@UseGuards(JwtAuthGuard)
@Controller('admin/albums')
export class AdminAlbumController {
  constructor(
    private readonly createAlbumUseCase: CreateAlbumUseCase,
    private readonly listAlbumsUseCase: ListAlbumsUseCase,
    private readonly getAlbumUseCase: GetAlbumUseCase,
    private readonly updateAlbumUseCase: UpdateAlbumUseCase,
    private readonly listAlbumSelectionsUseCase: ListAlbumSelectionsUseCase,
    private readonly listAlbumPhotosUseCase: ListAlbumPhotosUseCase,
  ) {}

  @Post()
  public async Create(@Req() req: Request, @Body() request: CreateAlbumRequest) {
    const user = (req as Request & { user: JwtUser }).user;
    const result = await this.createAlbumUseCase.Execute({
      OwnerUserId: user.UserId,
      Name: request.Name,
      DriveFolderUrl: request.DriveFolderUrl,
      Pin: request.Pin,
      MaxSelectable: request.MaxSelectable,
      ExpiredAt: request.ExpiredAt ? new Date(request.ExpiredAt) : null,
    });

    return {
      ...result,
      ShareUrl: this.BuildShareUrl(req, result.PublicId),
    };
  }

  @Get()
  public async List(@Req() req: Request, @Query() query: ListAlbumsQuery) {
    const user = (req as Request & { user: JwtUser }).user;
    return await this.listAlbumsUseCase.Execute(user.UserId, query);
  }

  @Get(':albumId')
  public async GetById(@Req() req: Request, @Param('albumId') albumId: string) {
    const user = (req as Request & { user: JwtUser }).user;
    return await this.getAlbumUseCase.Execute(user.UserId, albumId);
  }

  @Patch(':albumId')
  public async Update(
    @Req() req: Request,
    @Param('albumId') albumId: string,
    @Body() request: UpdateAlbumRequest,
  ) {
    const user = (req as Request & { user: JwtUser }).user;
    return await this.updateAlbumUseCase.Execute({
      Id: albumId,
      OwnerUserId: user.UserId,
      Name: request.Name,
      Pin: request.Pin,
      MaxSelectable: request.MaxSelectable,
      ExpiredAt: request.ExpiredAt ? new Date(request.ExpiredAt) : undefined,
      Status: request.Status,
    });
  }

  @Get(':albumId/selections')
  public async ListSelections(
    @Req() req: Request,
    @Param('albumId') albumId: string,
    @Query() query: ListSelectionsQuery,
  ) {
    const user = (req as Request & { user: JwtUser }).user;
    return await this.listAlbumSelectionsUseCase.Execute(user.UserId, albumId, query);
  }

  @Get(':albumId/photos')
  public async ListPhotos(
    @Req() req: Request,
    @Param('albumId') albumId: string,
    @Query() query: ListPhotosQuery,
  ) {
    const user = (req as Request & { user: JwtUser }).user;
    return await this.listAlbumPhotosUseCase.Execute(user.UserId, albumId, query.PageToken);
  }

  private BuildShareUrl(req: Request, publicId: string): string {
    const host = req.get('host');
    if (!host) return publicId;
    return `${req.protocol}://${host}/a/${publicId}`;
  }
}
