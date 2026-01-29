import { CreateAlbumUseCase } from '../../../src/Modules/Albums/Application/UseCases/CreateAlbumUseCase';
import { AlbumStatus } from '../../../src/Modules/Albums/Domain/Enums/AlbumStatus';
import { AlbumEntity } from '../../../src/Modules/Albums/Domain/Entities/AlbumEntity';
import { BusinessRuleException } from '../../../src/Common/Exceptions/AppException';
import { IAlbumRepository } from '../../../src/Modules/Albums/Domain/Interfaces/IAlbumRepository';
import { IDriveService } from '../../../src/Modules/Albums/Domain/Interfaces/IDriveService';

class FakeAlbumRepository implements IAlbumRepository {
  public Create = jest.fn<Promise<AlbumEntity>, [AlbumEntity]>();
  public Update = jest.fn<Promise<void>, [AlbumEntity]>();
  public FindById = jest.fn<Promise<AlbumEntity | null>, [string]>();
  public FindByPublicId = jest.fn<Promise<AlbumEntity | null>, [string]>();
  public ListByOwner = jest.fn<
    Promise<{ Items: AlbumEntity[]; TotalItems: number }>,
    [string, number, number, AlbumStatus | undefined]
  >();
}

class FakeDriveService implements IDriveService {
  public BuildAuthUrl = jest.fn<string, []>();
  public ExchangeCodeForToken = jest.fn();
  public ResolveFolderIdFromUrl = jest.fn<string | null, [string]>();
  public ListPhotos = jest.fn();
}

describe('CreateAlbumUseCase', () => {
  it('creates album with resolved folder id', async () => {
    const repo = new FakeAlbumRepository();
    const drive = new FakeDriveService();
    drive.ResolveFolderIdFromUrl.mockReturnValue('folder123');
    repo.Create.mockImplementation(async (album) => album);

    const useCase = new CreateAlbumUseCase(repo, drive);
    const result = await useCase.Execute({
      OwnerUserId: 'u1',
      Name: 'Wedding',
      DriveFolderUrl: 'https://drive.google.com/drive/folders/folder123',
      Pin: '1234',
      MaxSelectable: 10,
    });

    expect(drive.ResolveFolderIdFromUrl).toHaveBeenCalled();
    expect(repo.Create).toHaveBeenCalledTimes(1);
    expect(result.DriveFolderId).toBe('folder123');
    expect(result.Status).toBe(AlbumStatus.Active);
  });

  it('throws when folder url is invalid', async () => {
    const repo = new FakeAlbumRepository();
    const drive = new FakeDriveService();
    drive.ResolveFolderIdFromUrl.mockReturnValue(null);
    const useCase = new CreateAlbumUseCase(repo, drive);

    await expect(
      useCase.Execute({
        OwnerUserId: 'u1',
        Name: 'Wedding',
        DriveFolderUrl: 'invalid',
        Pin: '1234',
        MaxSelectable: 10,
      }),
    ).rejects.toBeInstanceOf(BusinessRuleException);
  });
});
