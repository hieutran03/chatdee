import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMemberCommand } from "../update-member.command";
import { ConversationService } from "../../services/conversation.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { SuccessResult } from "src/shared/libs/result";

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler implements ICommandHandler<UpdateMemberCommand>{
  constructor(
    private readonly conversationService: ConversationService
  ){}
  async execute({conversationId, updatedById, memberId, input}: UpdateMemberCommand) {
    try {
      if(updatedById === memberId){
        return SuccessResult.responseNoContent();
      }
      await this.conversationService.updateMember(conversationId, updatedById, memberId, input);
      return SuccessResult.responseUpdated();
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}