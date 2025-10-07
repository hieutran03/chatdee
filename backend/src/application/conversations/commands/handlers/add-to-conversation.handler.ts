import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddToConversationCommand } from "../add-to-conversation.command";
import { ConversationService } from "../../services/conversation.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { SuccessResult } from "src/shared/libs/result";

@CommandHandler(AddToConversationCommand)
export class AddToConversationHandler implements ICommandHandler<AddToConversationCommand> {
  constructor(
    private readonly conversationService: ConversationService
  ){}
  async execute({addedById, conversationId, memberId}: AddToConversationCommand): Promise<any> {
    try{
      await this.conversationService.addToConversation(addedById, conversationId, memberId);
      return SuccessResult.responseOk();
    }catch(error){
      return responseErrorResult(error);
    }
  }
}