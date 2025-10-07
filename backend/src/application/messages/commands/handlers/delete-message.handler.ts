import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteMessageCommand } from "../delete-message.command";
import { MessageService } from "../../services/message.service";
import { SuccessResult } from "src/shared/libs/result";
import { responseErrorResult } from "src/shared/core/utils/exception.util";

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler implements ICommandHandler<DeleteMessageCommand>{
  constructor(
    private readonly messageService: MessageService
  ){}
  async execute({userId, messageId, conversationId}: DeleteMessageCommand){
    try {
      await this.messageService.delete(userId, messageId, conversationId);
      return SuccessResult.responseDeleted();
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}