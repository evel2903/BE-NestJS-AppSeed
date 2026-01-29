import { ClientSessionEntity } from '../Entities/ClientSessionEntity';

export const CLIENT_SESSION_REPOSITORY = Symbol('IClientSessionRepository');

export interface IClientSessionRepository {
  FindByAlbumId(albumId: string): Promise<ClientSessionEntity | null>;
  Create(session: ClientSessionEntity): Promise<void>;
  Update(session: ClientSessionEntity): Promise<void>;
}
