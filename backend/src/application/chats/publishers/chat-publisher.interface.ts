import { MessageCreatedIntegrationEvent } from "../integration-event/message-created.integration-event";

export interface IChatPublisher {
  publishMessageCreated(event: MessageCreatedIntegrationEvent): Promise<void>;
}