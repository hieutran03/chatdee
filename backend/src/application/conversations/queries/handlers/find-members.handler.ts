import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMembersQuery } from "../find-members.query";
import { ConversationService } from "../../services/conversation.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { MemberOutput } from "../../dtos/member.output";
import { SuccessResult } from "src/shared/libs/result";

@QueryHandler(FindMembersQuery)
export class FindMembersHandler implements IQueryHandler<FindMembersQuery>{
  constructor(private readonly conversationService: ConversationService) {}
  async execute(query: FindMembersQuery){
    const result = await this.conversationService.getMembers(query.conversationId);
    if(result instanceof Error) return responseErrorResult(result);
    const output = result.map((member) => new MemberOutput(member));
    return SuccessResult.responseOk(output);
  }
}