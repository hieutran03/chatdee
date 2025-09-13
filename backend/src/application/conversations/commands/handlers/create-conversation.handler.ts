import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateConversationCommand } from "../create-conversation.command";
import { Transactional } from "typeorm-transactional";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { ConversationService } from "../../services/conversation.service";
import { ConversationToOutputMapper } from "../../mappers/conversation-to-output.mapper";

@CommandHandler(CreateConversationCommand)
export class CreateConversationHandler implements ICommandHandler<CreateConversationCommand> {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly conversationToOutputMapper: ConversationToOutputMapper
  ){}

  @Transactional()
  async execute({creatorId,payload}: CreateConversationCommand) {
    try{
      const result = await this.conversationService.createConversation(creatorId, payload);
      const output = await this.conversationToOutputMapper.toObject(result);
      return output;
    }catch(error){
      responseErrorResult(error);
    }
  }
}