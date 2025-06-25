import prisma from '../config/prisma';
import { User } from '@prisma/client';

export const findAllDevices = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

