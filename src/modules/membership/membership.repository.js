import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const membershipRepository = {
  getAll: async () => {
    return await prisma.membership.findMany();
  },

  getById: async (id) => {
    return await prisma.membership.findUnique({
      where: { id: parseInt(id) },
    });
  },

  create: async (data) => {
    return await prisma.membership.create({ data });
  },

  update: async (id, data) => {
    return await prisma.membership.update({
      where: { id: parseInt(id) },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.membership.delete({
      where: { id: parseInt(id) },
    });
  },

  findByUserId: async (user_id) => {
    return await prisma.membership.findUnique({
      where: { user_id },
    });
  },

};
