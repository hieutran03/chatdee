import { ICommandHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMessagesQuery } from "../find-messages.query";
import { MessageService } from "../../services/message.service";
import { SuccessResult } from "src/shared/libs/result";
import { responseErrorResult } from "src/shared/core/utils/exception.util";
import { FindMessagesOutput } from "../../dtos/find-messages.output";

@QueryHandler(FindMessagesQuery)
export class FindMessagesHandler implements ICommandHandler<FindMessagesQuery> {
  constructor(
    private readonly messageService: MessageService
  ){}
  
  async execute(query: FindMessagesQuery) {
    const { conversationId, input, userId } = query;
    const result = await this.messageService.getMessages(userId,conversationId, input);
    if(result instanceof Error)
      return responseErrorResult(result);
    const output = new FindMessagesOutput(result);
    return SuccessResult.responseOk(output);
  }
}