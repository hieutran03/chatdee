import { env } from "./env.util";
import * as bcrypt from "bcrypt";

export function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(
  password: string,
  rounds = env.Int('BCRYPT_SALT_ROUNDS', 12)
): Promise<string> {
  const salt = await bcrypt.genSalt(rounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
