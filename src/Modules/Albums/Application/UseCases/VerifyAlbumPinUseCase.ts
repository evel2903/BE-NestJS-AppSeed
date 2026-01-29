import { randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { BusinessRuleException, NotFoundException, UnauthorizedAppException } from '../../../../Common/Exceptions/AppException';
import { AlbumStatus } from '../../Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../Domain/Interfaces/IClientSessionRepository';
import { VerifyPinResultDto } from '../DTOs/VerifyPinResultDto';
import { PublicAlbumDtoMapper } from '../Mappers/PublicAlbumDtoMapper';
import { ClientSessionEntity } from '../../Domain/Entities/ClientSessionEntity';
import { TokenHasher } from '../../Infrastructure/Services/TokenHasher';

export class VerifyAlbumPinUseCase {
  constructor(
    private readonly albumRepository: IAlbumRepository,
    private readonly clientSessionRepository: IClientSessionRepository,
  ) {}

  public async Execute(publicId: string, pin: string): Promise<VerifyPinResultDto> {
    const album = await this.albumRepository.FindByPublicId(publicId);
    if (!album) throw new NotFoundException('Album not found');

    if (album.Status === AlbumStatus.Closed) {
      throw new BusinessRuleException('Album is closed', { Code: 'ALBUM_CLOSED' });
    }
    if (album.Status === AlbumStatus.Expired || album.IsExpired()) {
      throw new BusinessRuleException('Album is expired', { Code: 'ALBUM_EXPIRED' });
    }

    const validPin = await bcrypt.compare(pin, album.PinHash);
    if (!validPin) {
      throw new UnauthorizedAppException('Invalid PIN', { Code: 'INVALID_PIN' });
    }

    const existingSession = await this.clientSessionRepository.FindByAlbumId(album.Id);
    if (existingSession) {
      throw new BusinessRuleException('Album already assigned', { Code: 'ALBUM_ALREADY_ASSIGNED' });
    }

    const token = randomBytes(24).toString('hex');
    const now = new Date();
    const session = new ClientSessionEntity({
      Id: randomUUID(),
      AlbumId: album.Id,
      SessionTokenHash: TokenHasher.Hash(token),
      CreatedAt: now,
      LastSeenAt: now,
      ExpiresAt: album.ExpiredAt ?? null,
    });
    await this.clientSessionRepository.Create(session);

    return { GuestToken: token, Album: PublicAlbumDtoMapper.ToDto(album) };
  }
}
