export interface IMapper<T, U> {
  toObject(data: T): Promise<U>;
}