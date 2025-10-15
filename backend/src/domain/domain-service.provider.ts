import { ConversationDomainService } from "./conversations/domain-service/conversation.domain-service";
import { MessageDomainService } from "./messages/domain-services/message.domain-service";

export const DomainServices = [
  ConversationDomainService,
  MessageDomainService
];