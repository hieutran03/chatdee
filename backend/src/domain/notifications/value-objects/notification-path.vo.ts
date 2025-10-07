import { uuidPattern } from 'src/shared/core/utils/regex.util';
import { NotificationTypeEnum } from '../enums/notification-type.enum';
export class NotificationPathVo{

  private constructor(
    private readonly value: string,
    private readonly type: NotificationTypeEnum,
  ) {}

  static readonly patterns = {
    MENTION: new RegExp(`^/conversation/(${uuidPattern})/message/(${uuidPattern})$`),
    NEW_MESSAGE: new RegExp(`^/conversation/(${uuidPattern})$`),
    // FRIEND_REQUEST: new RegExp(`^/friend-request/(${uuidPattern})$`),
  };

  static create(path: string): NotificationPathVo {
    const normalized = path.trim();

    if (this.patterns.NEW_MESSAGE.test(normalized)) {
      return new NotificationPathVo(normalized, NotificationTypeEnum.NEW_MESSAGE);
    }
    if (this.patterns.MENTION.test(normalized)) {
      return new NotificationPathVo(normalized, NotificationTypeEnum.MENTION);
    }

    throw new Error(`Invalid notification path format: ${path}`);
  }
}