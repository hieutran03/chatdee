import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { UserOutput } from 'src/application/users/dtos/user.output';
import { ConversationDetailContract } from 'src/domain/conversations/contracts/conversation-detail.contract';
import { ConversationExtraInfoContract } from 'src/domain/conversations/contracts/conversation-extra-info.contract';
import { Conversation } from 'src/domain/conversations/conversation';
import { ConversationTypeEnum } from 'src/shared/common/enums/conversations.enum';

export class ConversationOutput {
  @ApiProperty()
  id: UUID;

  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ enum: ConversationTypeEnum, required: false })
  type?: ConversationTypeEnum;

  @ApiProperty({ required: false })
  theme?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  owner?: UserOutput;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: () => [UserOutput] , required: false})
  members: UserOutput[];

  @ApiProperty({
    type: () => [UserOutput],
    example: [
      {
        id: 'user-1',
        role: 'admin',
        name: 'Nguyen Van A',
        bornYear: 1995,
        email: 'a@example.com',
        avatar: 'avatar-a.png',
      },
      {
        id: 'user-2',
        role: 'member',
        name: 'Tran Van B',
        bornYear: 1997,
        email: 'b@example.com',
        avatar: 'avatar-b.png',
      },
    ],
  })
  topUsers?: UserOutput[];

  @ApiProperty({
    example: 10,
  })
  totalUsers?: number;
  constructor(
    conversation: ConversationDetailContract | Conversation,
    conversationExtraInfo?:  ConversationExtraInfoContract
  ) {
    const {topUsers, totalUsers} = conversationExtraInfo || {};
    this.id = conversation.id;
    this.title = conversation.title.value;
    this.type = conversation.type;
    this.theme = conversation.theme;
    this.avatar = conversation.avatar;
    this.topUsers = topUsers ? topUsers.map((user) => new UserOutput(user)) : undefined;
    if(conversation instanceof ConversationDetailContract){
      this.owner = new UserOutput(conversation.ownerUser);
      this.members = conversation.members
        ? conversation.members.map((user) => new UserOutput(user))
        : [];
      this.createdAt = conversation.createdAt;
      this.updatedAt = conversation.updatedAt;
    }

    this.totalUsers = totalUsers;
  }
}
