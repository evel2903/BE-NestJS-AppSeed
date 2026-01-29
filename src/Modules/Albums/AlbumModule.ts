import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAlbumController } from './Presentation/Controllers/AdminAlbumController';
import { PublicAlbumController } from './Presentation/Controllers/PublicAlbumController';
import { AdminDriveController } from './Presentation/Controllers/AdminDriveController';
import { AlbumOrmEntity } from './Infrastructure/Persistence/Entities/AlbumOrmEntity';
import { PhotoOrmEntity } from './Infrastructure/Persistence/Entities/PhotoOrmEntity';
import { SelectionOrmEntity } from './Infrastructure/Persistence/Entities/SelectionOrmEntity';
import { ClientSessionOrmEntity } from './Infrastructure/Persistence/Entities/ClientSessionOrmEntity';
import { DriveCredentialOrmEntity } from './Infrastructure/Persistence/Entities/DriveCredentialOrmEntity';
import { AlbumRepository } from './Infrastructure/Persistence/Repositories/AlbumRepository';
import { PhotoRepository } from './Infrastructure/Persistence/Repositories/PhotoRepository';
import { SelectionRepository } from './Infrastructure/Persistence/Repositories/SelectionRepository';
import { ClientSessionRepository } from './Infrastructure/Persistence/Repositories/ClientSessionRepository';
import { DriveCredentialRepository } from './Infrastructure/Persistence/Repositories/DriveCredentialRepository';
import { GoogleDriveService } from './Infrastructure/Services/GoogleDriveService';
import { CreateAlbumUseCase } from './Application/UseCases/CreateAlbumUseCase';
import { ListAlbumsUseCase } from './Application/UseCases/ListAlbumsUseCase';
import { GetAlbumUseCase } from './Application/UseCases/GetAlbumUseCase';
import { UpdateAlbumUseCase } from './Application/UseCases/UpdateAlbumUseCase';
import { ListAlbumSelectionsUseCase } from './Application/UseCases/ListAlbumSelectionsUseCase';
import { ListAlbumPhotosUseCase } from './Application/UseCases/ListAlbumPhotosUseCase';
import { VerifyAlbumPinUseCase } from './Application/UseCases/VerifyAlbumPinUseCase';
import { ListPublicAlbumPhotosUseCase } from './Application/UseCases/ListPublicAlbumPhotosUseCase';
import { SetSelectionUseCase } from './Application/UseCases/SetSelectionUseCase';
import { BulkSetSelectionsUseCase } from './Application/UseCases/BulkSetSelectionsUseCase';
import { GetDriveAuthUrlUseCase } from './Application/UseCases/GetDriveAuthUrlUseCase';
import { DriveCallbackUseCase } from './Application/UseCases/DriveCallbackUseCase';
import { DriveDisconnectUseCase } from './Application/UseCases/DriveDisconnectUseCase';
import {
  ALBUM_REPOSITORY,
  IAlbumRepository,
} from './Domain/Interfaces/IAlbumRepository';
import {
  PHOTO_REPOSITORY,
  IPhotoRepository,
} from './Domain/Interfaces/IPhotoRepository';
import {
  SELECTION_REPOSITORY,
  ISelectionRepository,
} from './Domain/Interfaces/ISelectionRepository';
import {
  CLIENT_SESSION_REPOSITORY,
  IClientSessionRepository,
} from './Domain/Interfaces/IClientSessionRepository';
import {
  DRIVE_CREDENTIAL_REPOSITORY,
  IDriveCredentialRepository,
} from './Domain/Interfaces/IDriveCredentialRepository';
import { DRIVE_SERVICE, IDriveService } from './Domain/Interfaces/IDriveService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlbumOrmEntity,
      PhotoOrmEntity,
      SelectionOrmEntity,
      ClientSessionOrmEntity,
      DriveCredentialOrmEntity,
    ]),
  ],
  controllers: [AdminAlbumController, PublicAlbumController, AdminDriveController],
  providers: [
    { provide: ALBUM_REPOSITORY, useClass: AlbumRepository },
    { provide: PHOTO_REPOSITORY, useClass: PhotoRepository },
    { provide: SELECTION_REPOSITORY, useClass: SelectionRepository },
    { provide: CLIENT_SESSION_REPOSITORY, useClass: ClientSessionRepository },
    { provide: DRIVE_CREDENTIAL_REPOSITORY, useClass: DriveCredentialRepository },
    { provide: DRIVE_SERVICE, useClass: GoogleDriveService },
    {
      provide: CreateAlbumUseCase,
      useFactory: (repo: IAlbumRepository, drive: IDriveService) => new CreateAlbumUseCase(repo, drive),
      inject: [ALBUM_REPOSITORY, DRIVE_SERVICE],
    },
    {
      provide: ListAlbumsUseCase,
      useFactory: (repo: IAlbumRepository) => new ListAlbumsUseCase(repo),
      inject: [ALBUM_REPOSITORY],
    },
    {
      provide: GetAlbumUseCase,
      useFactory: (repo: IAlbumRepository) => new GetAlbumUseCase(repo),
      inject: [ALBUM_REPOSITORY],
    },
    {
      provide: UpdateAlbumUseCase,
      useFactory: (repo: IAlbumRepository) => new UpdateAlbumUseCase(repo),
      inject: [ALBUM_REPOSITORY],
    },
    {
      provide: ListAlbumSelectionsUseCase,
      useFactory: (repo: IAlbumRepository, selections: ISelectionRepository, photos: IPhotoRepository) =>
        new ListAlbumSelectionsUseCase(repo, selections, photos),
      inject: [ALBUM_REPOSITORY, SELECTION_REPOSITORY, PHOTO_REPOSITORY],
    },
    {
      provide: ListAlbumPhotosUseCase,
      useFactory: (repo: IAlbumRepository, drive: IDriveService) => new ListAlbumPhotosUseCase(repo, drive),
      inject: [ALBUM_REPOSITORY, DRIVE_SERVICE],
    },
    {
      provide: VerifyAlbumPinUseCase,
      useFactory: (repo: IAlbumRepository, sessions: IClientSessionRepository) =>
        new VerifyAlbumPinUseCase(repo, sessions),
      inject: [ALBUM_REPOSITORY, CLIENT_SESSION_REPOSITORY],
    },
    {
      provide: ListPublicAlbumPhotosUseCase,
      useFactory: (
        repo: IAlbumRepository,
        sessions: IClientSessionRepository,
        selections: ISelectionRepository,
        drive: IDriveService,
      ) => new ListPublicAlbumPhotosUseCase(repo, sessions, selections, drive),
      inject: [ALBUM_REPOSITORY, CLIENT_SESSION_REPOSITORY, SELECTION_REPOSITORY, DRIVE_SERVICE],
    },
    {
      provide: SetSelectionUseCase,
      useFactory: (
        repo: IAlbumRepository,
        sessions: IClientSessionRepository,
        selections: ISelectionRepository,
      ) => new SetSelectionUseCase(repo, sessions, selections),
      inject: [ALBUM_REPOSITORY, CLIENT_SESSION_REPOSITORY, SELECTION_REPOSITORY],
    },
    {
      provide: BulkSetSelectionsUseCase,
      useFactory: (
        repo: IAlbumRepository,
        sessions: IClientSessionRepository,
        selections: ISelectionRepository,
      ) => new BulkSetSelectionsUseCase(repo, sessions, selections),
      inject: [ALBUM_REPOSITORY, CLIENT_SESSION_REPOSITORY, SELECTION_REPOSITORY],
    },
    {
      provide: GetDriveAuthUrlUseCase,
      useFactory: (drive: IDriveService) => new GetDriveAuthUrlUseCase(drive),
      inject: [DRIVE_SERVICE],
    },
    {
      provide: DriveCallbackUseCase,
      useFactory: (drive: IDriveService, creds: IDriveCredentialRepository) =>
        new DriveCallbackUseCase(drive, creds),
      inject: [DRIVE_SERVICE, DRIVE_CREDENTIAL_REPOSITORY],
    },
    {
      provide: DriveDisconnectUseCase,
      useFactory: (creds: IDriveCredentialRepository) => new DriveDisconnectUseCase(creds),
      inject: [DRIVE_CREDENTIAL_REPOSITORY],
    },
  ],
})
export class AlbumModule {}
