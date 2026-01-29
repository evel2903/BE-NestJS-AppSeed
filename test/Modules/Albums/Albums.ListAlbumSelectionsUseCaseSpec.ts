import { ListAlbumSelectionsUseCase } from '../../../src/Modules/Albums/Application/UseCases/ListAlbumSelectionsUseCase';
import { AlbumEntity } from '../../../src/Modules/Albums/Domain/Entities/AlbumEntity';
import { PhotoEntity } from '../../../src/Modules/Albums/Domain/Entities/PhotoEntity';
import { SelectionEntity } from '../../../src/Modules/Albums/Domain/Entities/SelectionEntity';
import { AlbumStatus } from '../../../src/Modules/Albums/Domain/Enums/AlbumStatus';
import { IAlbumRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IAlbumRepository';
import { IPhotoRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IPhotoRepository';
import { ISelectionRepository } from '../../../src/Modules/Albums/Domain/Interfaces/ISelectionRepository';

class FakeAlbumRepository implements IAlbumRepository {
  public Create = jest.fn();
  public Update = jest.fn();
  public FindById = jest.fn<Promise<AlbumEntity | null>, [string]>();
  public FindByPublicId = jest.fn();
  public ListByOwner = jest.fn();
}

class FakePhotoRepository implements IPhotoRepository {
  public UpsertMany = jest.fn();
  public FindByAlbumAndDriveFileIds = jest.fn<Promise<PhotoEntity[]>, [string, string[]]>();
}

class FakeSelectionRepository implements ISelectionRepository {
  public FindByAlbumId = jest.fn<Promise<{ Items: SelectionEntity[]; TotalItems: number }>, [string, number, number]>();
  public FindByAlbumAndDriveFileIds = jest.fn();
  public FindByAlbumAndDriveFileId = jest.fn();
  public CountByAlbumId = jest.fn();
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
    MaxSelectable: 10,
    Status: AlbumStatus.Active,
    ExpiredAt: null,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  });

describe('ListAlbumSelectionsUseCase', () => {
  it('returns selections with photo info when available', async () => {
    const albumRepo = new FakeAlbumRepository();
    const selectionRepo = new FakeSelectionRepository();
    const photoRepo = new FakePhotoRepository();

    albumRepo.FindById.mockResolvedValue(BuildAlbum());
    selectionRepo.FindByAlbumId.mockResolvedValue({
      Items: [
        new SelectionEntity({
          Id: 's1',
          AlbumId: 'a1',
          DriveFileId: 'f1',
          ClientSessionId: 'c1',
          CreatedAt: new Date(),
        }),
      ],
      TotalItems: 1,
    });
    photoRepo.FindByAlbumAndDriveFileIds.mockResolvedValue([
      new PhotoEntity({
        Id: 'p1',
        AlbumId: 'a1',
        DriveFileId: 'f1',
        FileName: 'img.jpg',
        MimeType: 'image/jpeg',
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        LastSyncedAt: new Date(),
      }),
    ]);

    const useCase = new ListAlbumSelectionsUseCase(albumRepo, selectionRepo, photoRepo);
    const result = await useCase.Execute('u1', 'a1', { Page: 1, PageSize: 10 });

    expect(result.TotalSelected).toBe(1);
    expect(result.Items[0].FileName).toBe('img.jpg');
  });
});
