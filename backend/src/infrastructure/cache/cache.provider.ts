import { repositories } from "./repositories";
import { services } from "./services";

export const providers = [
  ...services,
  ...repositories
]