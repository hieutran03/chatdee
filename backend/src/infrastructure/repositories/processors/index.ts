import { UpdateLastMessageProcessor, UpdateLastMessageProcessorToken } from "./update-last-message.processor";

export const processors = [
  {
    provide: UpdateLastMessageProcessorToken,
    useClass: UpdateLastMessageProcessor
  }
];