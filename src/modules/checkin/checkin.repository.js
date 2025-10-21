import prisma from '../../config/database.js';

export const checkinRepository = {
  create: async (data) => {
    return await prisma.checkin.create({ data });
  },

  findUserByQrCode: async (qr_code) => {
    return await prisma.user.findUnique({
      where: { qr_code },
    });
  },

  findMembershipByUserId: async (user_id) => {
    return await prisma.membership.findFirst({
      where: { user_id },
    });
  },

  findAll: async () => {
    return await prisma.checkin.findMany({
      include: { user: true },
      orderBy: { checkin_time: 'desc' },
    });
  },
};
