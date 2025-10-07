import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { ConversationDetailContract } from 'src/domain/conversations/contracts/conversation-detail.contract';
import { Conversation } from 'src/domain/conversations/conversation';
import { ConversationTypeEnum } from 'src/domain/conversations/enums/conversations.enum';
import { MemberOutput } from './member.output';
import { MemberContract } from 'src/domain/conversations/contracts/member.contract';

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
  owner?: MemberOutput;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
  
  @ApiProperty({
    type: () => [MemberOutput],
    example: [
      {
        id: 'user-1',
        conversationRole: 'admin',
        name: 'Nguyen Van A',
        avatar: 'avatar-a.png',
      },
      {
        id: 'user-2',
        conversationRole: 'member',
        name: 'Tran Van B',
        avatar: 'avatar-b.png',
      },
    ],
  })
  topMembers?: MemberOutput[] = undefined;

  @ApiProperty({
    example: 10,
  })
  totalMembers?: number = undefined;
  constructor(
    conversation: ConversationDetailContract | Conversation,
    topMembers?: MemberContract[],
    totalMembers?: number,
  ) {
    this.id = conversation.id;
    this.title = conversation.title.value;
    this.type = conversation.type;
    this.theme = conversation.theme;
    this.avatar = conversation.avatar;
    if(conversation instanceof ConversationDetailContract){
      this.owner = new MemberOutput(conversation.ownerMember);
      // this.members = conversation.members
      //   ? conversation.members.map((member) => new MemberOutput(member))
      //   : [];
      this.createdAt = conversation.createdAt;
      this.updatedAt = conversation.updatedAt;
    }
    if (topMembers) {
      this.topMembers = topMembers.map((member) => new MemberOutput(member));
    }

    if (totalMembers) {
      this.totalMembers = totalMembers;
    }
  }
}
