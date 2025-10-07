import { CursorBasedPageDto } from 'src/shared/common/dtos/cursor-based-page.dto';
import { ConversationOutput } from './conversation.output';
import { ConversationPaginationContract } from 'src/domain/conversations/contracts/conversation-pagination.contract';
import { UUID } from 'crypto';
import { MemberContract } from 'src/domain/conversations/contracts/member.contract';

export class FindConversationsOutput extends CursorBasedPageDto<ConversationOutput> {
  constructor(
    paginationContract: ConversationPaginationContract,
    topUsersMap: Map<UUID, MemberContract[]>,
    totalMembersMap?: Map<UUID, number>,
  ) {
    const conversationOutput = paginationContract.conversations.map(
      (c) =>
        new ConversationOutput(
          c,
          topUsersMap.get(c.id),
          totalMembersMap?.get(c.id),
        ),
    );
    super(
      conversationOutput,
      paginationContract.limit,
      paginationContract.nextCursor,
      paginationContract.previousCursor,
    );
  }
}
