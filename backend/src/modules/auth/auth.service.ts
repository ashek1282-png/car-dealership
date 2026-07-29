import bcrypt from 'bcrypt';
import * as authRepository from './auth.repository.js';
import type { RegisterInput } from './auth.schema.js';

export const registerUser = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepository.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
