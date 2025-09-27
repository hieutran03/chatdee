import { UUID } from 'crypto'

export abstract class Entity{
  constructor() {
  }

  abstract equals(entity: Entity): boolean;
}
