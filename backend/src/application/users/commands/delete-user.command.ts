import { UUID } from "crypto";

export class DeleteUserCommand{
  constructor(public readonly id: UUID) {}
}