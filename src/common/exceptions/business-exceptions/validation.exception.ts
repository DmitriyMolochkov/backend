import { ValidationError as ClassValidatorError } from 'class-validator';

import { BusinessException } from './business.exception';

export class ValidationException extends BusinessException {
  public readonly errors: ClassValidatorError[];

  public constructor(errors: ClassValidatorError[], entityName?: string, message?: string) {
    super(
      entityName,
      undefined,
      message ?? 'Validation error encountered',
    );
    this.errors = errors;
  }
}
