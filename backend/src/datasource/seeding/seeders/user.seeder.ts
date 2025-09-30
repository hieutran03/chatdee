import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { UserOrm } from 'src/infrastructure/relational-database/orm/user.orm'
import { hashPassword } from 'src/shared/core/utils/password.util'

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // lấy factory đã định nghĩa
    const userFactory = factoryManager.get(UserOrm)

    // tạo 10 users
    await userFactory.saveMany(10)

    // tạo 1 admin user custom
    await dataSource.getRepository(UserOrm).insert({
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: await hashPassword('password123'),
      avatar: 'https://i.pravatar.cc/150?img=1',
    })
  }
}
