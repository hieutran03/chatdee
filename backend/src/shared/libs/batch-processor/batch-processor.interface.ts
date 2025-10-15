export interface IBatchProcessor<T>{
  push(item: T): void;
}