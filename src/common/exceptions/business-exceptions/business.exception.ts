export abstract class BusinessException extends Error {
  public readonly entityId?: number | string;
  public readonly entityName?: string;

  protected constructor(
    entityName?: string,
    entityId?: number | string,
    message?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.entityName = entityName;
    this.entityId = entityId;
  }
}
