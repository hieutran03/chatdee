import { CursorBasedPageDto } from "src/shared/common/dtos/cursor-based-page.dto";
import { ConversationOutput } from "./conversation.output";
import { ConversationPaginationContract } from "src/domain/conversations/contracts/conversation-pagination.contract";
import { ConversationExtraInfoContract } from "src/domain/conversations/contracts/conversation-extra-info.contract";
import { UUID } from "crypto";

export class FindConversationsOutput extends CursorBasedPageDto<ConversationOutput>{
  constructor(paginationContract: ConversationPaginationContract, extraInfoMap: Map<UUID, ConversationExtraInfoContract> ) {
    const conversationOutput = paginationContract.conversations.map(c => new ConversationOutput(c, extraInfoMap.get(c.id)));
    super(conversationOutput, paginationContract.limit, paginationContract.nextCursor, paginationContract.previousCursor);
  }
}