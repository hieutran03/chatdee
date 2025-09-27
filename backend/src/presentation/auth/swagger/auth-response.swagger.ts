import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { LoginOutput } from "src/application/auth/dtos/login.output";
import { ErrorResponseDto } from "src/shared/common/dtos/error-response.dto";
import { SuccessResponseDto } from "src/shared/common/dtos/success-response.dto";
import { ErrorCode } from "src/shared/common/enums/error-code.enum";

export enum AuthOperation {
  getProfile = "getProfile",
  login = "login"
}
const swaggerResponse = {
  [AuthOperation.login]: [
    ApiExtraModels(SuccessResponseDto,ErrorResponseDto, LoginOutput),
    ApiResponse({ 
      status: 202, 
      description: 'Login successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              statusCode: { example: 202 },
              data: { $ref: getSchemaPath(LoginOutput) },

            }
          }
        ]
      }
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized',
      schema: { 
        allOf: [
          { $ref: getSchemaPath(ErrorResponseDto) },
          {
            properties: {
              statusCode: { example: 401 },
              message: { example: 'Invalid credentials' },
              code: { example: ErrorCode.AUTH_01},
            }
          }
        ]
       }
    }),
  ]
}

export const AuthResponseSwagger = (option: AuthOperation) => {
  const decorators =  swaggerResponse[option];
  return applyDecorators(...decorators);
}