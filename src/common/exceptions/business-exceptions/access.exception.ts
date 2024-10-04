import { BusinessException } from './business.exception';

export class AccessException extends BusinessException {
  public constructor(
    entityName?: string,
    entityId?: number,
    message?: string,
  ) {
    super(
      entityName,
      entityId,
      message ?? `Access to the ${entityName ?? 'Entity'} denied`,
    );
  }
}
