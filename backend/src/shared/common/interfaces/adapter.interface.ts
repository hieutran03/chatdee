export interface IAdapter<T, K>{
  toEntity(orm: K): T;
  toOrm(entity: T): K;
}
