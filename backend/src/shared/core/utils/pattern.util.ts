import { UUID } from "crypto";
import { ObjectPatternEnum } from "src/shared/common/enums/object-pattern.enum";

export const getObjectIdFromPattern = (pattern: string, objectType: ObjectPatternEnum): string => {
  const parts = pattern.split(':'); 
  const index = parts.indexOf(objectType);

  if (index === -1 || index === parts.length - 1) {
    return ''; 
  }
  return parts[index + 1];
};

export class ChatPatternUtil {
  static readonly chatPrefix = 'chat';
  
  //Figure: chat:conversation:conversationId:member:userId
  static getMemberPattern(conversationId: UUID, userId: UUID): string {
    return `${ChatPatternUtil.chatPrefix}:${ObjectPatternEnum.conversation}:${conversationId}:${ObjectPatternEnum.member}:${userId}`;
  }

  //Figure: chat:conversation:conversationId
  static getConversationPattern(conversationId: UUID): string {
    return `${ChatPatternUtil.chatPrefix}:${ObjectPatternEnum.conversation}:${conversationId}`;
  }

  //Figure: chat:socket:socketId
  static getSocketPattern(socketId: string): string {
    return `${ChatPatternUtil.chatPrefix}:${ObjectPatternEnum.socket}:${socketId}`;
  }

  //Figure: chat:inbox:userId
  static getInBoxPattern(userId: UUID): string {
    return `${ChatPatternUtil.chatPrefix}:${ObjectPatternEnum.inbox}:${userId}`;
  }
}

export class ConversationPatternUtil {
  static readonly conversationPrefix = 'conversation';

  static getConversationPattern(conversationId: UUID): string {
    return `${ConversationPatternUtil.conversationPrefix}:${ObjectPatternEnum.conversation}:${conversationId}`;
  } 
}