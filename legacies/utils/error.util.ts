import { ErrorCode, POSTGRES_ERROR_CODE } from "src/common/enums/error-code.enum";

export const checkPostgresError = (error: any): ErrorCode | null => {
  if (error?.code && Object.values(POSTGRES_ERROR_CODE).includes(error.code)) {
    return ErrorCode.POSTGRES_ERROR;
  }
  return null;
};
