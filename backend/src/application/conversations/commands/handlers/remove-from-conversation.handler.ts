import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveFromConversationCommand } from "../remove-from-conversation.command";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { ConversationService } from "../../services/conversation.service";
import { SuccessResult } from "src/shared/libs/result";

@CommandHandler(RemoveFromConversationCommand)
export class RemoveFromConversationHandler implements ICommandHandler<RemoveFromConversationCommand> {
  constructor(private readonly conversationService: ConversationService) {}

  async execute({removedById, conversationId, memberId}: RemoveFromConversationCommand): Promise<any> {
    try{
      await this.conversationService.removeFromConversation(removedById, conversationId, memberId);
      return SuccessResult.responseDeleted();
    }catch(error){
      return responseErrorResult(error);
    }
  }
}