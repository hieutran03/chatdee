import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindConversationByIdQuery } from "../find-conversation-by-id.query";
import { ConversationService } from "../../services/conversation.service";
import { ConversationOutput } from "../../dtos/conversation.output";
import { responseErrorResult } from "src/shared/core/utils/exception.util";

@QueryHandler(FindConversationByIdQuery)
export class FindConversationByIdHandler implements IQueryHandler<FindConversationByIdQuery> {
  constructor(private readonly conversationService: ConversationService) {}
  async execute({ conversationId, userId }: FindConversationByIdQuery) {
    const result = await this.conversationService.findById(userId, conversationId);
    if (result instanceof Error) return responseErrorResult(result);
    const output = new ConversationOutput(result.conversation, result.topUsersAndTotal);
    return output;
  }
}