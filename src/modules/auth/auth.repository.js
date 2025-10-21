import prisma from '../../config/database.js';

export const authRepository = {
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },
};
