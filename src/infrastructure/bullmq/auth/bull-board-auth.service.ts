import { Injectable } from '@nestjs/common';

import { BullBoardConfig } from 'infrastructure/config';

@Injectable()
export class BullBoardAuthService {
  public constructor(
    private readonly config: BullBoardConfig,
  ) {}

  public validate(username: string, password: string): boolean {
    if (username === this.config.username && password === this.config.password) {
      return true;
    }

    return false;
  }
}
