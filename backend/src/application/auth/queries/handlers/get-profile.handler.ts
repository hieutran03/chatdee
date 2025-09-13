import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProfileQuery } from "../get-profile.query";
import { AuthService } from "../../services/auth.service";
import { SuccessResult } from "src/shared/libs/result";

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery>{
  constructor(
    private readonly authService: AuthService
  ){}

  async execute(query: GetProfileQuery) {
    const profile = await this.authService.getProfile(query.email);
    return SuccessResult.responseOk(profile);
  }
}