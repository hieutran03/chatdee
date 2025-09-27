import { QueryHandler } from "@nestjs/cqrs";
import { FindConversationsQuery } from "../find-conversations.query";
import { ConversationService } from "../../services/conversation.service";
import { FindConversationsOutput } from "../../dtos/find-conversation.output";
import { SuccessResult } from "src/shared/libs/result";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { ConversationExtraInfoContract } from "src/domain/conversations/contracts/conversation-extra-info.contract";
import { UUID } from "crypto";

@QueryHandler(FindConversationsQuery)
export class FindConversationsHandler{
  constructor(private readonly conversationService: ConversationService) {}

  async execute({ userId, query }: FindConversationsQuery): Promise<any> {
    const result = await this.conversationService.findConversations(userId, query);
    const extraInfoMap = new Map<UUID, ConversationExtraInfoContract>();
    for(const conversation of result.conversations){
      if(conversation.type == ConversationTypeEnum.GROUP_CHAT && (!conversation.title || !conversation.avatar)){
        const extraInfo = await this.conversationService.getConversationExtraInfo(conversation, 3);
        if(extraInfo) extraInfoMap.set(conversation.id, extraInfo);
      }
    }
    const output = new FindConversationsOutput(result, extraInfoMap);
    return SuccessResult.responseOk(output);
  }
}