import { createHash } from 'crypto';

export class TokenHasher {
  public static Hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }
}
