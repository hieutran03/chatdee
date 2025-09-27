import { User } from "src/domain/users/users";
import { ApiProperty } from "@nestjs/swagger";
export class UserOutput {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  bornYear: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;
  constructor(entity: User) {
    this.id = entity.id;
    this.role = entity.role;
    this.name = entity.name;
    this.bornYear = entity.bornYear;
    this.email = entity.email;
    this.avatar = entity.avatar;
  }
}