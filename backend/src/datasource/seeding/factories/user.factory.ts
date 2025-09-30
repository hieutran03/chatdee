import { Faker } from "@faker-js/faker"
import { RoleEnum } from "src/domain/users/enums/role.enum"
import { UserOrm } from "src/infrastructure/relational-database/orm/user.orm"
import { hashPassword } from "src/shared/core/utils/password.util"
import { setSeederFactory, } from "typeorm-extension"

export const UserFactory = setSeederFactory(UserOrm, async (faker: Faker) => {
  const user = new UserOrm({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    hashedPassword: await hashPassword('password123'),
    avatar: faker.image.avatar(),
    role: RoleEnum.USER
  })
  return user;
})