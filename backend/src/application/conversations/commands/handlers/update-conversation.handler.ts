import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateConversationCommand } from "../update-conversation.command";
import { ConversationService } from "../../services/conversation.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { SuccessResult } from "src/shared/libs/result";

@CommandHandler(UpdateConversationCommand)
export class UpdateConversationHandler implements ICommandHandler<UpdateConversationCommand>{
  constructor(private readonly conversationService: ConversationService){}
  async execute({conversationId, payload}: UpdateConversationCommand){
    try{
      await this.conversationService.update(conversationId, payload);
      return SuccessResult.responseUpdated();
    } catch(error){
      return responseErrorResult(error);
    }
  }
}