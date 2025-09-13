export class AbstractOrm<T> {
  constructor(orm: Partial<T>) {
    Object.assign(this, orm);
  }
}