export class ViewByPage<T> {
  public constructor(
    public data: T[],
    public total: number,
  ) {
  }
}
