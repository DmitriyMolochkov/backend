import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'walletAddress',
      passwordField: 'walletAddress',
    });
  }

  public validate(
    walletAddress: string,
    signature: string,
  ): { walletAddress: string } {
    const isValid = this.authService.validate(walletAddress, signature);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return { walletAddress };
  }
}
