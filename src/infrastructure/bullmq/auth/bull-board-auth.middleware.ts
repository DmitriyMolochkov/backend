import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BullBoardAuthMiddleware implements NestMiddleware {
  public use(req: Request, _res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
      throw new UnauthorizedException();
    }

    next();
  }
}
