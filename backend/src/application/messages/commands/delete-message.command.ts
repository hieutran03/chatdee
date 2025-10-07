import { UUID } from 'crypto';

export class DeleteMessageCommand {
  constructor(
    public readonly userId: UUID,
    public readonly messageId: UUID,
    public readonly conversationId: UUID,
  ) {}
}
