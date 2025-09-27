import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDto } from "./api-response.dto";

export class SuccessResponseDto<T> extends ApiResponseDto{
  @ApiProperty({ type: () => Object })
  readonly data: T;
}