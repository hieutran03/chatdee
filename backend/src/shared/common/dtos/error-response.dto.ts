import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ErrorCode, StatusCodeEnum } from '../enums/error-code.enum';
import { ApiResponseDto } from './api-response.dto';

// class IErrorFieldDto {
//   @ApiProperty()
//   field: string;
//   @ApiProperty()
//   message: string;
// }

export class ErrorResponseDto extends ApiResponseDto {
  @ApiProperty()
  message: string;
  @ApiPropertyOptional({ enum: StatusCodeEnum })
  code?: ErrorCode;
}
