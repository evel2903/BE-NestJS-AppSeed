import { SetSelectionUseCase } from '../../../src/Modules/Albums/Application/UseCases/SetSelectionUseCase';
import { AlbumEntity } from '../../../src/Modules/Albums/Domain/Entities/AlbumEntity';
import { ClientSessionEntity } from '../../../src/Modules/Albums/Domain/Entities/ClientSessionEntity';
import { SelectionEntity } from '../../../src/Modules/Albums/Domain/Entities/SelectionEntity';
import { AlbumStatus } from '../../../src/Modules/Albums/Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IClientSessionRepository';
import { ISelectionRepository } from '../../../src/Modules/Albums/Domain/Interfaces/ISelectionRepository';
import { BusinessRuleException } from '../../../src/Common/Exceptions/AppException';
import { TokenHasher } from '../../../src/Modules/Albums/Infrastructure/Services/TokenHasher';

class FakeAlbumRepository implements IAlbumRepository {
  public Create = jest.fn();
  public Update = jest.fn();
  public FindById = jest.fn();
  public FindByPublicId = jest.fn<Promise<AlbumEntity | null>, [string]>();
  public ListByOwner = jest.fn();
}

class FakeSessionRepository implements IClientSessionRepository {
  public FindByAlbumId = jest.fn<Promise<ClientSessionEntity | null>, [string]>();
  public Create = jest.fn();
  public Update = jest.fn();
}

class FakeSelectionRepository implements ISelectionRepository {
  public FindByAlbumId = jest.fn();
  public FindByAlbumAndDriveFileIds = jest.fn();
  public FindByAlbumAndDriveFileId = jest.fn<Promise<SelectionEntity | null>, [string, string]>();
  public CountByAlbumId = jest.fn<Promise<number>, [string]>();
  public Create = jest.fn();
  public Update = jest.fn();
  public DeleteByAlbumAndDriveFileId = jest.fn();
}

const BuildAlbum = (): AlbumEntity =>
  new AlbumEntity({
    Id: 'a1',
    OwnerUserId: 'u1',
    Name: 'Album',
    PublicId: 'ALB_X',
    DriveFolderUrl: 'url',
    DriveFolderId: 'folder',
    PinHash: 'hash',
    MaxSelectable: 1,
    Status: AlbumStatus.Active,
    ExpiredAt: null,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  });

describe('SetSelectionUseCase', () => {
  it('throws when max selection exceeded', async () => {
    const albumRepo = new FakeAlbumRepository();
    const sessionRepo = new FakeSessionRepository();
    const selectionRepo = new FakeSelectionRepository();

    albumRepo.FindByPublicId.mockResolvedValue(BuildAlbum());
    sessionRepo.FindByAlbumId.mockResolvedValue(
      new ClientSessionEntity({
        Id: 's1',
        AlbumId: 'a1',
        SessionTokenHash: TokenHasher.Hash('token'),
        CreatedAt: new Date(),
        LastSeenAt: new Date(),
      }),
    );
    selectionRepo.FindByAlbumAndDriveFileId.mockResolvedValue(null);
    selectionRepo.CountByAlbumId.mockResolvedValue(1);

    const useCase = new SetSelectionUseCase(albumRepo, sessionRepo, selectionRepo);

    await expect(
      useCase.Execute({
        PublicId: 'ALB_X',
        GuestToken: 'token',
        DriveFileId: 'f1',
        IsSelected: true,
        Note: 'note',
      }),
    ).rejects.toBeInstanceOf(BusinessRuleException);
  });
});
