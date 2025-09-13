import * as bcrypt from "bcrypt";

let saltRounds = 10;

export const setSaltRounds = (rounds: number) => {
  saltRounds = rounds;
}

export function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(
  password: string,
  rounds = saltRounds
): Promise<string> {
  const salt = await bcrypt.genSalt(rounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
