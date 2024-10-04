import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { LocalAuthGuard } from './local-auth.guard';

@Controller('bull')
export class BullBoardAuthController {
  @ApiExcludeEndpoint()
  @Get('/auth')
  public view(@Req() req: Request, @Res() res: Response): void {
    if (req.isAuthenticated()) {
      const indexOfBull = req.originalUrl.indexOf('/bull');
      const prefix = req.originalUrl.substring(0, indexOfBull);

      return res.redirect(`${prefix}/bull/queues`);
    }

    return res.render('auth');
  }

  @ApiExcludeEndpoint()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public login(@Res() res: Response): void {
    return res.redirect('queues');
  }
}
