import prisma from '../../config/database.js';

export const authRepository = {
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },

  updateLocation: async (id, latitude, longitude) => {
    return await prisma.user.update({
      where: { id },
      data: { latitude, longitude },
    });
  },
};
