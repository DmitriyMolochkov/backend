import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // eslint-disable-next-line unused-imports/no-unused-vars
  public validate(walletAddress: string, signature: string): boolean {
    /* if (walletAddress && signature) { // TODO check signature
      return true;
    }

    return false; */
    return true;
  }
}
