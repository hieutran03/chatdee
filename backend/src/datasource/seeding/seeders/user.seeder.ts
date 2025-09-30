import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { UserOrm } from 'src/infrastructure/relational-database/orm/user.orm'
import { hashPassword } from 'src/shared/core/utils/password.util'
import { RoleEnum } from 'src/domain/users/enums/role.enum'

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(UserOrm)

    // create 10 random users
    await userFactory.saveMany(10)

    // create 1 admin user custom
    const existingAdmin = await dataSource.getRepository(UserOrm).findOneBy({ email: 'admin@example.com' });
    if (existingAdmin) return;
    const adminUser = new UserOrm({
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: await hashPassword('password123'),
      bornYear: 1995,
      role: RoleEnum.ADMIN,
      avatar: 'https://i.pravatar.cc/150?img=1',
    })
    await dataSource.getRepository(UserOrm).save(adminUser)
  }
}
