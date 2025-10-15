import { UUID } from "crypto";

export const IChatServiceCacheToken = 'IChatCache';
export interface IChatServiceCache {
  addSocketIdToMember(conversationId: UUID, userId: UUID,socketId: string): Promise<void>;
  // getAllSocketKeysOfMember(conversationId: UUID, userId: UUID): Promise<string[]>;
  removeMemberAndGetSocketIds(conversationId: UUID, userId: UUID): Promise<string[]>;
  deleteSocketId(socketId: string): Promise<void>;
}