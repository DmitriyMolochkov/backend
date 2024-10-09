import { BusinessException } from 'common/exceptions/business-exceptions';

export class InsufficientFundsException extends BusinessException {
  public constructor() {
    super(
      undefined,
      undefined,
      'Insufficient funds',
    );
  }
}
