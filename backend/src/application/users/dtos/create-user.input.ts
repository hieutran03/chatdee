import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "../../../domain/users/enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/domain/users/users";
export class CreateUserInput{
  @ApiProperty({ 
    enum: RoleEnum, 
    required: false,
    default: RoleEnum.USER
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiProperty({ 
    required: true,
    type: String,
    default: 'John'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    required: true,
    type: Number,
    default: 2003
  })
  @IsNumber()
  bornYear: number;

  @ApiProperty({ 
    required: true,
    type: String,
    default: 'John2003@working.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    required: true,
    type: String,
    default: 'https://resource.com/avatar.png'
  })
  @IsString()
  avatar: string;

  @ApiProperty({ 
    required: true,
    type: String,
    default: 'P@ssw0rd'
  })
  @IsString()
  password: string;

  toEntity(){
    return User.create(
      this.role,
      this.name,
      this.bornYear,
      this.email,
      this.avatar,
      this.password
    )
  }
}