import { randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { BusinessRuleException } from '../../../../Common/Exceptions/AppException';
import { AlbumEntity } from '../../Domain/Entities/AlbumEntity';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IDriveService } from '../../Domain/Interfaces/IDriveService';
import { CreateAlbumDto } from '../DTOs/CreateAlbumDto';
import { AlbumDto } from '../DTOs/AlbumDto';
import { AlbumDtoMapper } from '../Mappers/AlbumDtoMapper';

const GeneratePublicId = (): string => `ALB_${randomBytes(4).toString('hex').toUpperCase()}`;

export class CreateAlbumUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly driveService: IDriveService,
  ) {}

  public async Execute(request: CreateAlbumDto): Promise<AlbumDto> {
    const folderId = this.driveService.ResolveFolderIdFromUrl(request.DriveFolderUrl);
    if (!folderId) {
      throw new BusinessRuleException('Invalid Google Drive folder URL', { Code: 'DRIVE_FOLDER_NOT_ACCESSIBLE' });
    }

    const now = new Date();
    const album = new AlbumEntity({
      Id: randomUUID(),
      OwnerUserId: request.OwnerUserId,
      Name: request.Name,
      PublicId: GeneratePublicId(),
      DriveFolderUrl: request.DriveFolderUrl,
      DriveFolderId: folderId,
      PinHash: await bcrypt.hash(request.Pin, 10),
      MaxSelectable: request.MaxSelectable,
      Status: AlbumStatus.Active,
      ExpiredAt: request.ExpiredAt ?? null,
      CreatedAt: now,
      UpdatedAt: now,
    });

    const created = await this.albumRepository.Create(album);
    return AlbumDtoMapper.ToDto(created);
  }
}
