import { UUID } from "crypto";
import { User } from "src/domain/users/users";
import { UserOrm } from "src/infrastructure/relational-database/orm/user.orm";
import { IUserRepository } from "../../../domain/users/repositories/user-repository.interface";
import { UserAdapter } from "../adapter/user.adapter";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";

@Injectable()
export class UserRepository implements IUserRepository{
  constructor(
    @InjectRepository(UserOrm)
    private readonly userRepository: Repository<UserOrm>,
    @Inject(UserAdapter)
    private readonly userAdapter: IAdapter<User, UserOrm>,
  ){}

  // private createQueryBuilder(): SelectQueryBuilder<UserOrm> {
  //   return this.userRepository.createQueryBuilder('user');
  // }

  async save(user: User): Promise<User> {
    const newUserOrm = this.userAdapter.toOrm(user);
    const savedUserOrm = await this.userRepository.save(newUserOrm);
    return this.userAdapter.toEntity(savedUserOrm);
  }

  async findByIds(ids: UUID[]): Promise<User[]> {
    const userOrms = await this.userRepository.findBy({id: In(ids)});
    return userOrms.map(userOrm => this.userAdapter.toEntity(userOrm));
  }

  async findById(id: UUID): Promise<User> {
    const userOrm = await this.userRepository.findOneBy({id});
    return this.userAdapter.toEntity(userOrm);
  }

  async findByEmail(email: string): Promise<User> {
    const userOrm = await this.userRepository.findOneBy({email});
    return this.userAdapter.toEntity(userOrm);
  }
  
  async update(id: UUID, user: User): Promise<void> {
    await this.userRepository.update(id, this.userAdapter.toOrm(user));
  }
  
  async delete(id: UUID): Promise<void> {
    const user = await this.userRepository.findOne({where: {id}});
    if(user){
      user.email = user.email + '_deleted_' + Date.now();
    }
    user.deletedAt = new Date();
    await this.userRepository.save(user);
  }

  async findAllAndCount(page: number, limit: number): Promise<[User[], number]> {
    const [userOrms, count] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const users = userOrms.map(userOrm => this.userAdapter.toEntity(userOrm));
    return [users, count];
  }
}