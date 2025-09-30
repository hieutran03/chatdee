import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/domain/users/repositories/user-repository.interface';
import { Inject } from '@nestjs/common';
import { AppJwtService } from 'src/infrastructure/utils/services/app-jwt.service';
import { IUserToSign } from '../interfaces/user-to-sign.interface';
import { User } from 'src/domain/users/users';
import { comparePassword } from 'src/shared/core/utils/password.util';
import { LoginOutput } from 'src/application/auth/dtos/login.output';
import { GetProfileOutput } from 'src/application/auth/dtos/get-profile.output';
import { AccountNotFoundException } from 'src/shared/core/exceptions/not-found/account-not-found.exception';
import { InvalidCredentialsException } from 'src/shared/core/exceptions/auth/invallid-credential-exception';
import { SignupInput } from '../dtos/sign-up.input';
import { UserAlreadyExistException } from 'src/shared/core/exceptions/conflict/user-already-exist.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly appJwtService: AppJwtService,
  ) {}

  async getCredential(email: string, password: string): Promise<LoginOutput> {
    const user = await this.checkValidEmail(email);
    await this.checkPassword(user.hashedPassword, password);
    const accessToken = await this.generateAccessToken(user);
    return { accessToken };
  }

  async getProfile(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if(!user) throw new AccountNotFoundException(email)

    return new GetProfileOutput(user);
  }

  async checkValidEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if(!user) throw new AccountNotFoundException(email)
    return user;
  }

  async register(input: SignupInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistException(input.email);
    }
    const user = await input.toEntity();
    return this.userRepository.save(user);
  }

  private async checkPassword(hashedPassword: string, password: string) {
    const isValid = await comparePassword(password, hashedPassword);
    if(!isValid) throw new InvalidCredentialsException();
    return true
  }

  private async generateAccessToken(user: User) {
    const userToSign: IUserToSign = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bornYear: user.bornYear,
      avatar: user.avatar,
    };
    return this.appJwtService.sign(userToSign);
  }
}
