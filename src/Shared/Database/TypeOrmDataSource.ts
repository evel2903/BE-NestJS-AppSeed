import 'dotenv/config';
import { DataSource } from 'typeorm';
import { GetEnv } from '../Config/Env/Env';
import { UserOrmEntity } from '../../Modules/Users/Infrastructure/Persistence/Entities/UserOrmEntity';
import { AlbumOrmEntity } from '../../Modules/Albums/Infrastructure/Persistence/Entities/AlbumOrmEntity';
import { PhotoOrmEntity } from '../../Modules/Albums/Infrastructure/Persistence/Entities/PhotoOrmEntity';
import { SelectionOrmEntity } from '../../Modules/Albums/Infrastructure/Persistence/Entities/SelectionOrmEntity';
import { ClientSessionOrmEntity } from '../../Modules/Albums/Infrastructure/Persistence/Entities/ClientSessionOrmEntity';
import { DriveCredentialOrmEntity } from '../../Modules/Albums/Infrastructure/Persistence/Entities/DriveCredentialOrmEntity';

const env = GetEnv();

export default new DataSource({
  type: 'mysql',
  host: env.DbHost,
  port: env.DbPort,
  username: env.DbUsername,
  password: env.DbPassword,
  database: env.DbDatabase,
  entities: [
    UserOrmEntity,
    AlbumOrmEntity,
    PhotoOrmEntity,
    SelectionOrmEntity,
    ClientSessionOrmEntity,
    DriveCredentialOrmEntity,
  ],
  migrations: [__dirname + '/Migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: env.NodeEnv !== 'production',
});
