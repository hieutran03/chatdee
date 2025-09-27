import { StatusCodeEnum } from "src/shared/common/enums/error-code.enum";

export class Result{
  public constructor(
    public readonly success: boolean,
    public readonly statusCode: StatusCodeEnum,
    public message: string,
  ) {}
}

