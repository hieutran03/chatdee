import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ChangeOwnerCommand } from "../change-owner.command";
import { ConversationService } from "../../services/conversation.service";
import { SuccessResult } from "src/shared/libs/result";
import { responseErrorResult } from "src/shared/core/utils/exception.util";

@CommandHandler(ChangeOwnerCommand)
export class ChangeOwnerHandler implements ICommandHandler<ChangeOwnerCommand>{
  constructor(
    private readonly conversationService: ConversationService
  ){}
  
  async execute(command: ChangeOwnerCommand) {
    try {
      const { conversationId, changedBy, newOwner } = command;
      await this.conversationService.changeOwner(conversationId, changedBy, newOwner);
      return SuccessResult.responseUpdated();
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}