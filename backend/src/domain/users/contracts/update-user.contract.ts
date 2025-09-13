import { RoleEnum } from "../enums/role.enum";

export interface UpdateUserContract {
  name?: string;
  email?: string;
  avatar?: string;
  bornYear?: number;
  role?: RoleEnum;
}