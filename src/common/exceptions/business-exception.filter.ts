import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

import {
  AccessException,
  BusinessException,
  DuplicationException,
  NotFoundException,
  ValidationException,
} from './business-exceptions';

@Catch(BusinessException)
export class BusinessExceptionFilter extends BaseExceptionFilter {
  public catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const commonFields = {
      code: exception.name,
      message: exception.message,
      entityName: exception.entityName,
      entityId: exception.entityId,
    };
    
    if (exception instanceof ValidationException) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({
          ...commonFields,
          details: exception.errors,
        });
    } else if (exception instanceof NotFoundException) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json({
          ...commonFields,
        });
    } else if (exception instanceof AccessException) {
      response
        .status(HttpStatus.FORBIDDEN)
        .json({
          ...commonFields,
        });
    } else if (exception instanceof DuplicationException) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json({
          ...commonFields,
          duplicationFields: exception.duplicateFields,
        });
    } else {
      super.catch(exception, host);
    }
  }
}
