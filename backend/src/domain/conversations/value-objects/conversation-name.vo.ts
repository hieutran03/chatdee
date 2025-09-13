import { ValueObject } from "src/domain/abstractions/primitives/value-object";

export class ConversationTitleVO extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(name: string): ConversationTitleVO {
    return new ConversationTitleVO(name);
  }



  equals(other: ValueObject): boolean {
    if (!(other instanceof ConversationTitleVO)) {
      return false;
    }

    return this.value === other.value;
  }
}