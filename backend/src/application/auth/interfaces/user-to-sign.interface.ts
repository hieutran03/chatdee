import { UUID } from "crypto";
import { RoleEnum } from "src/domain/users/enums/role.enum";

export interface IUserToSign {
  id: UUID;
  name: string
  email: string;
  role: RoleEnum;
  bornYear: number;
  avatar: string;
}