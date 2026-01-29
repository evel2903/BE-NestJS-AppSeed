import { Body, Controller, Get, Headers, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnauthorizedAppException } from '../../../../Common/Exceptions/AppException';
import { BulkSetSelectionsUseCase } from '../../Application/UseCases/BulkSetSelectionsUseCase';
import { ListPublicAlbumPhotosUseCase } from '../../Application/UseCases/ListPublicAlbumPhotosUseCase';
import { SetSelectionUseCase } from '../../Application/UseCases/SetSelectionUseCase';
import { VerifyAlbumPinUseCase } from '../../Application/UseCases/VerifyAlbumPinUseCase';
import { BulkSelectionsRequest } from '../Requests/BulkSelectionsRequest';
import { ListPhotosQuery } from '../Requests/ListPhotosQuery';
import { SetSelectionRequest } from '../Requests/SetSelectionRequest';
import { VerifyPinRequest } from '../Requests/VerifyPinRequest';

@ApiTags('Albums.Public')
@Controller('public/albums')
export class PublicAlbumController {
  constructor(
    private readonly verifyAlbumPinUseCase: VerifyAlbumPinUseCase,
    private readonly listPublicAlbumPhotosUseCase: ListPublicAlbumPhotosUseCase,
    private readonly setSelectionUseCase: SetSelectionUseCase,
    private readonly bulkSetSelectionsUseCase: BulkSetSelectionsUseCase,
  ) {}

  @Post(':publicId/verify-pin')
  public async VerifyPin(@Param('publicId') publicId: string, @Body() request: VerifyPinRequest) {
    return await this.verifyAlbumPinUseCase.Execute(publicId, request.Pin);
  }

  @Get(':publicId/photos')
  public async ListPhotos(
    @Param('publicId') publicId: string,
    @Headers('x-guest-token') guestToken: string | undefined,
    @Query() query: ListPhotosQuery,
  ) {
    return await this.listPublicAlbumPhotosUseCase.Execute(
      publicId,
      this.RequireGuestToken(guestToken),
      query.PageToken,
    );
  }

  @Patch(':publicId/selections/:driveFileId')
  public async SetSelection(
    @Param('publicId') publicId: string,
    @Param('driveFileId') driveFileId: string,
    @Headers('x-guest-token') guestToken: string | undefined,
    @Body() request: SetSelectionRequest,
  ) {
    return await this.setSelectionUseCase.Execute({
      PublicId: publicId,
      GuestToken: this.RequireGuestToken(guestToken),
      DriveFileId: driveFileId,
      IsSelected: request.IsSelected,
      Note: request.Note,
    });
  }

  @Put(':publicId/selections')
  public async BulkSetSelections(
    @Param('publicId') publicId: string,
    @Headers('x-guest-token') guestToken: string | undefined,
    @Body() request: BulkSelectionsRequest,
  ) {
    return await this.bulkSetSelectionsUseCase.Execute({
      PublicId: publicId,
      GuestToken: this.RequireGuestToken(guestToken),
      Items: request.Items.map((item) => ({
        DriveFileId: item.DriveFileId,
        IsSelected: item.IsSelected,
        Note: item.Note,
      })),
    });
  }

  private RequireGuestToken(value: string | undefined): string {
    if (!value || value.trim().length === 0) {
      throw new UnauthorizedAppException('Missing guest token', { Code: 'INVALID_GUEST_TOKEN' });
    }
    return value;
  }
}
