import { DriveCredentialEntity } from '../Entities/DriveCredentialEntity';

export const DRIVE_CREDENTIAL_REPOSITORY = Symbol('IDriveCredentialRepository');

export interface IDriveCredentialRepository {
  FindByUserId(userId: string): Promise<DriveCredentialEntity | null>;
  Upsert(credential: DriveCredentialEntity): Promise<void>;
  DeleteByUserId(userId: string): Promise<void>;
}
