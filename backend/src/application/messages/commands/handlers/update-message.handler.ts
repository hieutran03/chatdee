import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateMessageCommand } from "../update-message.command";
import { MessageService } from "../../services/message.service";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { SuccessResult } from "src/shared/libs/result";

@CommandHandler(UpdateMessageCommand)
export class UpdateMessageHandler implements ICommandHandler<UpdateMessageCommand>{
  constructor(
    private readonly messageService: MessageService
  ){}
  async execute({ userId, messageId, conversationId, input }: UpdateMessageCommand) {
    try {
      await this.messageService.update(userId, messageId, conversationId, input);
      return SuccessResult.responseUpdated();
    } catch (error) {
      return responseErrorResult(error);
    }
  }
}