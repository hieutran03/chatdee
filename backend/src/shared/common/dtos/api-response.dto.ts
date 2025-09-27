import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto {
  @ApiProperty()
  readonly statusCode: number;
  @ApiProperty()
  readonly success: boolean;
}