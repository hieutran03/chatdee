import { MessageCreatedIntegrationEvent } from "../integration-event/message-created.integration-event";

export const IChatPublisherToken = 'IChatPublisher';
export interface IChatPublisher {
  publishMessageCreated(event: MessageCreatedIntegrationEvent): Promise<void>;
}