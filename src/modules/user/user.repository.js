import prisma from '../../config/database.js';

export const userRepository = {
  findAll: async () => {
    return await prisma.user.findMany();
  },

  findById: async (id) => {
    return await prisma.user.findUnique({ where: { id: Number(id) } });
  },

  create: async (data) => {
    return await prisma.user.create({ data });
  },


  update: async (id, data) => {
    return await prisma.user.update({
      where: { id: Number(id) },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.user.update({
      where: { id: Number(id) },
      data: { is_deleted: true },
    });
  },

};
