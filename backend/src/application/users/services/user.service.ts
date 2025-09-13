import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/domain/abstractions/repositories/user-repository.interface';
import { User } from 'src/domain/users/users';
import { CreateUserInput } from 'src/application/users/dtos/create-user.input';
import { FindAllUsersInput } from 'src/application/users/dtos/find-all-users.input';
import { FindAllUsersOutput } from 'src/application/users/dtos/find-all-users.output';
import { UpdateUserInput } from 'src/application/users/dtos/update-user.input';
import { UserOutput } from 'src/application/users/dtos/user.output';
import { UserAlreadyExistException } from 'src/shared/core/exceptions/user-already-exists.exception';
import { UserNotFoundException } from 'src/shared/core/exceptions/user-not-found.exception';
import { hashPassword } from 'src/shared/core/utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAllUsers(query: FindAllUsersInput) {
    const { page, limit } = query;
    const [users, count] = await this.userRepository.findAllAndCount(
      page,
      limit,
    );
    const output = new FindAllUsersOutput(users, count, page, limit);
    return output;
  }

  async findUserById(id: UUID) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return new UserOutput(user);
  }

  async createUser(dto: CreateUserInput) {
    await this.checkEmailConflict(dto.email);

    const user = dto.toEntity();

    const userWithHashedPassword = await this.assignUserWithHashedPassword(
      user,
      dto.password,
    );

    const newUser = await this.userRepository.save(userWithHashedPassword);

    return new UserOutput(newUser);
  }

  async updateUser(userId: UUID, dto: UpdateUserInput) {
    const user = await this.checkUserExists(userId);

    const contract = dto.toContract();

    user.update(contract);

    await this.userRepository.save(user);
  }

  async deleteUser(userId: UUID) {
    await this.checkUserExists(userId);
    await this.userRepository.delete(userId);
  }

  async assignUserWithHashedPassword(user: User, password: string) {
    const hashedPassword = await hashPassword(password);
    user.setPassword(hashedPassword);
    return user;
  }

  async checkEmailConflict(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user) throw new UserAlreadyExistException(email);
  }

  async checkUserExists(userId: UUID) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundException(userId);
    return user;
  }
}
