import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from 'src/domain/abstractions/repositories/user-repository.interface';
import { Inject } from '@nestjs/common';
import { AppJwtService } from 'src/infrastructure/utils/services/app-jwt.service';
import { UUID } from 'crypto';
import { AccountNotFoundException } from 'src/shared/core/exceptions/account-not-found.exception';
import { InvalidCredentialException } from 'src/shared/core/exceptions/invallid-credential.exception';
import { IUserToSign } from '../interfaces/user-to-sign.interface';
import { User } from 'src/domain/users/users';
import { comparePassword } from 'src/shared/core/utils/password.util';
import { LoginOutput } from 'src/application/auth/dtos/login.output';
import { GetProfileOutput } from 'src/application/auth/dtos/get-profile.output';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly appJwtService: AppJwtService,
  ) {}

  async getCredential(email: string, password: string): Promise<LoginOutput> {
    const user = await this.checkValidEmail(email);
    await this.checkCredential(user, password);
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

  private async checkCredential(user: User, password: string) {
    const isValid = await comparePassword(password, user.hashedPassword);
    if(!isValid) throw new InvalidCredentialException();

    return user;
  }

  private async generateAccessToken(user: User) {
    const userToSign: IUserToSign = {
      id: user._id,
      email: user.email,
      role: user.role,
      bornYear: user.bornYear,
      avatar: user.avatar,
    };
    return this.appJwtService.sign(userToSign);
  }
}
