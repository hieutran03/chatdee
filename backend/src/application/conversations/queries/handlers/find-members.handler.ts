import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMembersQuery } from "../find-members.query";
import { ConversationService } from "../../services/conversation.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { FindMembersOutput } from "../../dtos/find-members.output";

@QueryHandler(FindMembersQuery)
export class FindMembersHandler implements IQueryHandler<FindMembersQuery>{
  constructor(private readonly conversationService: ConversationService) {}
  async execute(query: FindMembersQuery){
    const result = await this.conversationService.getMembers(query.conversationId, query.input);
    if(result instanceof Error) return responseErrorResult(result);
    return new FindMembersOutput(result);
  }
}