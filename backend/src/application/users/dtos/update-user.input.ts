import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateUserContract } from "src/domain/users/contracts/update-user.contract";
import { RoleEnum } from "src/domain/users/enums/role.enum";

export class UpdateUserInput{
  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   example: 'user@example.com'
  // })
  // @IsEmail()
  // @IsOptional()
  // email?: string;
  
  @ApiProperty({
    required: false,
    type: String,
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  name?: string;
  
  
  @ApiProperty({
    required: false,
    type: String,
    example: 'avatar.png'
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    required: false,
    type: Number,
    example: 1990
  })
  @IsOptional()
  @IsNumber()
  bornYear?: number;
  
  @ApiProperty({
    enum: RoleEnum, 
    required: false,
    example: RoleEnum.USER
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  toContract(): UpdateUserContract{
    return {
      role: this.role,
      name: this.name,
      bornYear: this.bornYear,
      avatar: this.avatar
    };
  }
}