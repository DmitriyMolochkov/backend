import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public serializeUser(
    user: { walletAddress: string },
    done: (err: Error | null, user: unknown) => void,
  ): void {
    done(null, { walletAddress: user.walletAddress.toLowerCase() });
  }

  public deserializeUser(
    payload: { walletAddress: string },
    done: (err: Error | null, payload: { walletAddress: string }) => void,
  ): void {
    done(null, { walletAddress: payload.walletAddress.toLowerCase() });
  }
}
