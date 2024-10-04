import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class UnauthorizedExceptionFilter
implements ExceptionFilter<UnauthorizedException> {
  public catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { message } = exception;

    const indexOfBull = request.originalUrl.indexOf('/bull');
    if (indexOfBull !== -1) {
      const prefix = request.originalUrl.substring(0, indexOfBull);
      
      response.redirect(`${prefix}/bull/auth`);
    } else {
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
