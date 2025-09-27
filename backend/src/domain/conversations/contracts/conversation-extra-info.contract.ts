import { User } from "src/domain/users/users";

export interface ConversationExtraInfoContract {
  topUsers: User[];
  totalUsers: number;
}