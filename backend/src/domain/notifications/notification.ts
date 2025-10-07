import { UUID } from "crypto";
import { NotificationPathVo } from "./value-objects/notification-path.vo";

export class Notification {
  _id: UUID;
  _receiverId: UUID;
  _content: string;
  _path: NotificationPathVo;
  _isRead: boolean;
  _createdAt: Date;
  protected constructor(id: UUID, receiverId: UUID, content: string, path: NotificationPathVo, isRead: boolean, createdAt: Date) {
    this._id = id;
    this._receiverId = receiverId;
    this._content = content;
    this._path = path;
    this._isRead = isRead;
    this._createdAt = createdAt;
  }

  static assign(id: UUID, receiverId: UUID, content: string, path: NotificationPathVo, isRead: boolean, createdAt: Date) {
    return new Notification(id, receiverId, content, path, isRead, createdAt);
  }

  static create(receiverId: UUID, content: string, path: string) {
    const id = crypto.randomUUID() as UUID;
    const isRead = false;
    const createdAt = new Date();
    const pathVo = NotificationPathVo.create(path);
    return new Notification(id, receiverId, content, pathVo, isRead, createdAt);
  }
}