import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteConversationCommand } from "../delete-conversation.command";
import { ConversationService } from "../../services/conversation.service";
import { SuccessResult } from "src/shared/libs/result/success";
import { responseErrorResult } from "src/shared/core/utils/exception.util";

@CommandHandler(DeleteConversationCommand)
export class DeleteConversationHandler implements ICommandHandler<DeleteConversationCommand>{
  constructor(private readonly conversationService: ConversationService){}
  async execute({userId, conversationId}: DeleteConversationCommand){
    try{
      await this.conversationService.delete(conversationId, userId);
      return SuccessResult.responseDeleted();
    } catch(error){
      return responseErrorResult(error);
    }
  }
}