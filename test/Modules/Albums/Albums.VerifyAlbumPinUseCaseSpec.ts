import * as bcrypt from 'bcryptjs';
import { VerifyAlbumPinUseCase } from '../../../src/Modules/Albums/Application/UseCases/VerifyAlbumPinUseCase';
import { AlbumEntity } from '../../../src/Modules/Albums/Domain/Entities/AlbumEntity';
import { ClientSessionEntity } from '../../../src/Modules/Albums/Domain/Entities/ClientSessionEntity';
import { AlbumStatus } from '../../../src/Modules/Albums/Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IClientSessionRepository';
import { BusinessRuleException, UnauthorizedAppException } from '../../../src/Common/Exceptions/AppException';

class FakeAlbumRepository implements IAlbumRepository {
  public Create = jest.fn();
  public Update = jest.fn();
  public FindById = jest.fn();
  public FindByPublicId = jest.fn<Promise<AlbumEntity | null>, [string]>();
  public ListByOwner = jest.fn();
}

class FakeSessionRepository implements IClientSessionRepository {
  public FindByAlbumId = jest.fn<Promise<ClientSessionEntity | null>, [string]>();
  public Create = jest.fn<Promise<void>, [ClientSessionEntity]>();
  public Update = jest.fn();
}

const BuildAlbum = async (overrides?: Partial<AlbumEntity>): Promise<AlbumEntity> => {
  const pinHash = await bcrypt.hash('1234', 10);
  return new AlbumEntity({
    Id: 'a1',
    OwnerUserId: 'u1',
    Name: 'Album',
    PublicId: 'ALB_X',
    DriveFolderUrl: 'url',
    DriveFolderId: 'folder',
    PinHash: pinHash,
    MaxSelectable: 10,
    Status: AlbumStatus.Active,
    ExpiredAt: null,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    ...overrides,
  });
};

describe('VerifyAlbumPinUseCase', () => {
  it('creates session when pin is correct', async () => {
    const albumRepo = new FakeAlbumRepository();
    const sessionRepo = new FakeSessionRepository();
    albumRepo.FindByPublicId.mockResolvedValue(await BuildAlbum());
    sessionRepo.FindByAlbumId.mockResolvedValue(null);

    const useCase = new VerifyAlbumPinUseCase(albumRepo, sessionRepo);
    const result = await useCase.Execute('ALB_X', '1234');

    expect(result.GuestToken).toBeDefined();
    expect(sessionRepo.Create).toHaveBeenCalledTimes(1);
  });

  it('throws when pin is invalid', async () => {
    const albumRepo = new FakeAlbumRepository();
    const sessionRepo = new FakeSessionRepository();
    albumRepo.FindByPublicId.mockResolvedValue(await BuildAlbum());
    const useCase = new VerifyAlbumPinUseCase(albumRepo, sessionRepo);

    await expect(useCase.Execute('ALB_X', '0000')).rejects.toBeInstanceOf(UnauthorizedAppException);
  });

  it('throws when album is closed', async () => {
    const albumRepo = new FakeAlbumRepository();
    const sessionRepo = new FakeSessionRepository();
    albumRepo.FindByPublicId.mockResolvedValue(await BuildAlbum({ Status: AlbumStatus.Closed }));
    const useCase = new VerifyAlbumPinUseCase(albumRepo, sessionRepo);

    await expect(useCase.Execute('ALB_X', '1234')).rejects.toBeInstanceOf(BusinessRuleException);
  });

  it('throws when session already exists', async () => {
    const albumRepo = new FakeAlbumRepository();
    const sessionRepo = new FakeSessionRepository();
    albumRepo.FindByPublicId.mockResolvedValue(await BuildAlbum());
    sessionRepo.FindByAlbumId.mockResolvedValue(
      new ClientSessionEntity({
        Id: 's1',
        AlbumId: 'a1',
        SessionTokenHash: 'hash',
        CreatedAt: new Date(),
        LastSeenAt: new Date(),
      }),
    );
    const useCase = new VerifyAlbumPinUseCase(albumRepo, sessionRepo);

    await expect(useCase.Execute('ALB_X', '1234')).rejects.toBeInstanceOf(BusinessRuleException);
  });
});
