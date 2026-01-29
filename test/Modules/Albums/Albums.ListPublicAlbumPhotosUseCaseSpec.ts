import { ListPublicAlbumPhotosUseCase } from '../../../src/Modules/Albums/Application/UseCases/ListPublicAlbumPhotosUseCase';
import { AlbumEntity } from '../../../src/Modules/Albums/Domain/Entities/AlbumEntity';
import { ClientSessionEntity } from '../../../src/Modules/Albums/Domain/Entities/ClientSessionEntity';
import { SelectionEntity } from '../../../src/Modules/Albums/Domain/Entities/SelectionEntity';
import { AlbumStatus } from '../../../src/Modules/Albums/Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IAlbumRepository';
import { IClientSessionRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IClientSessionRepository';
import { IDriveService } from '../../../src/Modules/Albums/Domain/Interfaces/IDriveService';
import { ISelectionRepository } from '../../../src/Modules/Albums/Domain/Interfaces/ISelectionRepository';
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
  public FindByAlbumAndDriveFileIds = jest.fn<Promise<SelectionEntity[]>, [string, string[]]>();
  public FindByAlbumAndDriveFileId = jest.fn();
  public CountByAlbumId = jest.fn();
  public Create = jest.fn();
  public Update = jest.fn();
  public DeleteByAlbumAndDriveFileId = jest.fn();
}

class FakeDriveService implements IDriveService {
  public BuildAuthUrl = jest.fn();
  public ExchangeCodeForToken = jest.fn();
  public ResolveFolderIdFromUrl = jest.fn();
  public ListPhotos = jest.fn();
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
    MaxSelectable: 10,
    Status: AlbumStatus.Active,
    ExpiredAt: null,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  });

describe('ListPublicAlbumPhotosUseCase', () => {
  it('marks selected items', async () => {
    const albumRepo = new FakeAlbumRepository();
    const sessionRepo = new FakeSessionRepository();
    const selectionRepo = new FakeSelectionRepository();
    const drive = new FakeDriveService();

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
    drive.ListPhotos.mockResolvedValue({
      Items: [
        { DriveFileId: 'f1', FileName: 'a.jpg', MimeType: 'image/jpeg', ThumbnailUrl: null },
        { DriveFileId: 'f2', FileName: 'b.jpg', MimeType: 'image/jpeg', ThumbnailUrl: null },
      ],
      NextPageToken: null,
    });
    selectionRepo.FindByAlbumAndDriveFileIds.mockResolvedValue([
      new SelectionEntity({
        Id: 'sel1',
        AlbumId: 'a1',
        DriveFileId: 'f2',
        ClientSessionId: 's1',
        Note: 'note',
        CreatedAt: new Date(),
      }),
    ]);

    const useCase = new ListPublicAlbumPhotosUseCase(albumRepo, sessionRepo, selectionRepo, drive);
    const result = await useCase.Execute('ALB_X', 'token', null);

    const item2 = result.Items.find((i) => i.DriveFileId === 'f2');
    expect(item2?.IsSelected).toBe(true);
    expect(item2?.Note).toBe('note');
  });
});
