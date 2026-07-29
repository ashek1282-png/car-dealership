import { prisma } from '../../shared/prisma/index.js';
import { Prisma } from '../../generated/prisma/client.js';

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};
