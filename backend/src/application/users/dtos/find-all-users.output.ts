import { OffsetBasedPageDto } from "src/shared/common/dtos/offset-based-page.dto";
import { UserOutput } from "./user.output";
import { User } from "src/domain/users/users";

export class FindAllUsersOutput extends OffsetBasedPageDto<UserOutput>{
  constructor(users: User[], count: number, page: number, limit: number) {
    const items = users.map(user => new UserOutput(user));
    super(items, count, page, limit);
  }
}