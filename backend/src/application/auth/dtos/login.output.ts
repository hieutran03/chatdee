import { ApiProperty } from "@nestjs/swagger";

export class LoginOutput {
  @ApiProperty()
  accessToken: string;
  // refreshToken: string;
}
