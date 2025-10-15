import { Module } from "@nestjs/common";
import { repositories, repositoryTokens } from "./impl";
import { adapters } from "./adapter";
import { processors } from "./processors";

@Module({
  providers: [
    ...repositories,
    ...adapters,
    ...processors
  ],
  exports: [
    ...repositoryTokens,
    ...adapters,
    ...processors
  ]
})
export class RepositoryModule{}