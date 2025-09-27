import { UUID } from "crypto";

export interface IUserToSign {
  id: UUID;
  name: string
  email: string;
  role: string;
  bornYear: number;
  avatar: string;
}