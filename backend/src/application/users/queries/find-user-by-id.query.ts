import { UUID } from "crypto";

export class FindUserByIdQuery {
  constructor(
    public readonly id: UUID
  ) {}
}