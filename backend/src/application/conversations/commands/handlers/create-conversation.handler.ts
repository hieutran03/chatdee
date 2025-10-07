import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateConversationCommand } from "../create-conversation.command";
import { Transactional } from "typeorm-transactional";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { ConversationService } from "../../services/conversation.service";
import { SuccessResult } from "src/shared/libs/result";
import { ConversationOutput } from "../../dtos/conversation.output";

@CommandHandler(CreateConversationCommand)
export class CreateConversationHandler implements ICommandHandler<CreateConversationCommand> {
  constructor(
    private readonly conversationService: ConversationService,
  ){}
  
  @Transactional()
  async execute({creatorId,payload}: CreateConversationCommand) {
    try{
      const conversation = await this.conversationService.create(creatorId, payload);
      const topMembers = await this.conversationService.getTopMembers(conversation.id, 3);
      const totalMembers = await this.conversationService.getTotalMembers(conversation.id);
      const output = new ConversationOutput(conversation, topMembers, totalMembers);
      return SuccessResult.responseCreated(output);
    }catch(error){
      return responseErrorResult(error);
    }
  }
}