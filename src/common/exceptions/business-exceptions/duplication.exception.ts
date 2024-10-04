import { BusinessException } from './business.exception';

export class DuplicationException<T = object> extends BusinessException {
  public readonly duplicateFields?: (keyof T)[];

  public constructor(
    entityName?: string,
    duplicateFields?: (keyof T)[],
    message?: string,
  ) {
    super(
      entityName,
      undefined,
      message ?? `A duplicate ${entityName ?? 'Entity'} has been found`,
    );

    this.duplicateFields = duplicateFields;
  }
}
