import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { BusinessExceptionFilter } from 'common/exceptions/business-exception.filter';
import { BusinessException } from 'common/exceptions/business-exceptions';

import { InsufficientFundsException } from './business-exceptions';

@Catch(BusinessException)
export class UserExceptionFilter extends BusinessExceptionFilter {
  public catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof InsufficientFundsException) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({
          code: exception.name,
          message: exception.message,
          entityName: exception.entityName,
          entityId: exception.entityId,
        });
    } else {
      super.catch(exception, host);
    }
  }
}
