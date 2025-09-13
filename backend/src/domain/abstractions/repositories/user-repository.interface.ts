import { UUID } from "crypto";
import { User } from "src/domain/users/users";

export const IUserRepositoryToken = 'IUserRepository';
export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: UUID): Promise<User>;
  findByIds(ids: UUID[]): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  findAllAndCount(page: number, limit: number): Promise<[User[], number]>;
  update(id: UUID, user: User): Promise<void>;
  delete(id: UUID): Promise<void>;
}