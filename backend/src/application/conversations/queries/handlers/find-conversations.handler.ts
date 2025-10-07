import { QueryHandler } from "@nestjs/cqrs";
import { FindConversationsQuery } from "../find-conversations.query";
import { ConversationService } from "../../services/conversation.service";
import { FindConversationsOutput } from "../../dtos/find-conversations.output";
import { SuccessResult } from "src/shared/libs/result";
import { UUID } from "crypto";
import { MemberContract } from "src/domain/conversations/contracts/member.contract";

@QueryHandler(FindConversationsQuery)
export class FindConversationsHandler{
  constructor(private readonly conversationService: ConversationService) {}

  async execute({ userId, query }: FindConversationsQuery): Promise<any> {
    const result = await this.conversationService.findConversations(userId, query);
    const topMembersMap = new Map<UUID, MemberContract[]>();
    const totalMembersMap = new Map<UUID, number>();
    if (query.include?.includes("topMembers"))
      await Promise.all(result.conversations.map(async (conversation) => {
        const topMembers = await this.conversationService.getTopMembers(conversation.id, 3);
        topMembersMap.set(conversation.id, topMembers);
      }));
    if (query.include?.includes("totalMembers")) {
      await Promise.all(result.conversations.map(async (conversation) => {
        const totalMembers = await this.conversationService.getTotalMembers(conversation.id);
        totalMembersMap.set(conversation.id, totalMembers);
      }));
    }
    const output = new FindConversationsOutput(result, topMembersMap, totalMembersMap);
    return SuccessResult.responseOk(output);
  }
}