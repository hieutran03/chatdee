import { CursorBasedPageDto } from "src/shared/common/dtos/cursor-based-page.dto";
import { MessageOutput } from "./message.output";
import { MessagePaginationContract } from "src/domain/messages/contracts/message-pagination.contract";

export class FindMessagesOutput extends CursorBasedPageDto<MessageOutput>{
  constructor(contract: MessagePaginationContract){
    const messagesOutput = contract.messages.map(m => new MessageOutput(m));
    super(messagesOutput, contract.limit, contract.nextCursor, contract.previousCursor);
  }
}