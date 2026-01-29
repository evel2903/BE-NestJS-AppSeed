import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAlbumsTables20260129002857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE albums (
        Id char(36) NOT NULL,
        OwnerUserId char(36) NOT NULL,
        PublicId varchar(32) NOT NULL,
        Name varchar(255) NOT NULL,
        DriveFolderUrl varchar(1024) NOT NULL,
        DriveFolderId varchar(128) NOT NULL,
        PinHash varchar(255) NOT NULL,
        MaxSelectable int NOT NULL,
        Status varchar(20) NOT NULL,
        ExpiredAt datetime NULL,
        CreatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (Id),
        UNIQUE KEY UQ_albums_PublicId (PublicId),
        KEY IX_albums_OwnerUserId (OwnerUserId)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE photos (
        Id char(36) NOT NULL,
        AlbumId char(36) NOT NULL,
        DriveFileId varchar(128) NOT NULL,
        FileName varchar(255) NOT NULL,
        MimeType varchar(100) NOT NULL,
        ThumbnailUrl varchar(2048) NULL,
        OrderIndex int NULL,
        CreatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        LastSyncedAt datetime NOT NULL,
        PRIMARY KEY (Id),
        UNIQUE KEY UQ_photos_AlbumId_DriveFileId (AlbumId, DriveFileId),
        KEY IX_photos_AlbumId (AlbumId)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE client_sessions (
        Id char(36) NOT NULL,
        AlbumId char(36) NOT NULL,
        SessionTokenHash varchar(255) NOT NULL,
        DeviceFingerprint varchar(255) NULL,
        CreatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        LastSeenAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        ExpiresAt datetime NULL,
        PRIMARY KEY (Id),
        UNIQUE KEY UQ_client_sessions_AlbumId (AlbumId)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE selections (
        Id char(36) NOT NULL,
        AlbumId char(36) NOT NULL,
        PhotoId char(36) NULL,
        DriveFileId varchar(128) NOT NULL,
        ClientSessionId char(36) NOT NULL,
        Note text NULL,
        CreatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (Id),
        UNIQUE KEY UQ_selections_AlbumId_DriveFileId (AlbumId, DriveFileId),
        KEY IX_selections_AlbumId (AlbumId),
        KEY IX_selections_ClientSessionId (ClientSessionId)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE drive_credentials (
        Id char(36) NOT NULL,
        UserId char(36) NOT NULL,
        Provider varchar(50) NOT NULL,
        RefreshTokenEnc text NOT NULL,
        AccessTokenEnc text NULL,
        TokenExpiry datetime NULL,
        Scope varchar(255) NULL,
        CreatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (Id),
        KEY IX_drive_credentials_UserId (UserId)
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS drive_credentials');
    await queryRunner.query('DROP TABLE IF EXISTS selections');
    await queryRunner.query('DROP TABLE IF EXISTS client_sessions');
    await queryRunner.query('DROP TABLE IF EXISTS photos');
    await queryRunner.query('DROP TABLE IF EXISTS albums');
  }
}

