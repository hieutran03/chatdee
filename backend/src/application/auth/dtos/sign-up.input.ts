import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/domain/users/users";

export class SignupInput{
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  password: string;

  @ApiProperty({
    description: 'User birth year',
    example: 1990
  })
  bornYear: number;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg'
  })
  avatar?: string;

  async toEntity(): Promise<User>{
    return User.create(
      null, 
      this.email,
      this.bornYear,
      this.password,
      this.name,
      this.avatar
    );
  }
}