import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { BullBoardAuthController } from './bull-board-auth.controller';
import { BullBoardAuthService } from './bull-board-auth.service';
// import { LocalStrategy } from './local.startegy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [BullBoardAuthController],
  providers: [
    BullBoardAuthService,
    // LocalStrategy,
    SessionSerializer,
  ],
})
export class BullBoardAuthModule {}
