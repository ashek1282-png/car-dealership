import bcrypt from 'bcrypt';
import * as authRepository from './auth.repository.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';
import jwt from 'jsonwebtoken';

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

export const loginUser = async (data: LoginInput) => {
  //Find the user
  const user = await authRepository.findUserByEmail(data.email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  //Verify the password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  //Generate JWT Token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' },
  );

  //Strip the password before returning
  const { password, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};
