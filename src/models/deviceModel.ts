import prisma from '../config/prisma';

export const findAllDevices = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

