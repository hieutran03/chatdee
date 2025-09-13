import { UUID } from "crypto";
import { UserOutput } from "src/application/users/dtos/user.output";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";

export class ConversationOutput {
  id: UUID;
  title?: string;
  type?: ConversationTypeEnum;
  theme?: string;
  avatar?: string;
  users: UserOutput[];
  constructor(
    id: UUID,
    title?: string,
    type?: ConversationTypeEnum,
    theme?: string,
    avatar?: string,
    users?: UserOutput[],
  ) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.theme = theme;
    this.avatar = avatar;
    this.users = users;
  }
}