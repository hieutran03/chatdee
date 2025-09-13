import { Module } from "@nestjs/common";
import { repositories, repositoryTokens } from "./impl";
import { adapters } from "./adapter";

@Module({
  providers: [
    ...repositories,
    ...adapters
  ],
  exports: [
    ...repositoryTokens,
    ...adapters
  ]
})
export class RepositoryModule{}