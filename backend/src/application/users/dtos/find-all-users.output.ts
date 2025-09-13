import { OffsetBasedMetaDto } from "src/shared/common/dtos/offset-based-meta.dto";
import { UserOutput } from "./user.output";
import { User } from "src/domain/users/users";

export class FindAllUsersOutput {
  items: UserOutput[];
  meta: OffsetBasedMetaDto;
  constructor(users: User[], count: number, page: number, limit: number) {
    this.items = users.map(user => new UserOutput(user));
    this.meta = new OffsetBasedMetaDto(count, page, limit);
  }
}