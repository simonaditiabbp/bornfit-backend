import { checkinRepository } from './checkin.repository.js';

export const checkinController = {
  // untuk menampilkan semua riwayat checkin
  getAllCheckins: async (req, res) => {
    try {
      const data = await checkinRepository.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

    // untuk menampilkan riwayat checkin berdasarkan userId
    getCheckinsByUserId: async (req, res) => {
      try {
        const { userId } = req.params;
        const data = await checkinRepository.findByUserId(Number(userId));
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },

  // untuk proses checkin via QR code
  createCheckin: async (req, res) => {
    try {
      const { qr_code } = req.body;

      // cari user berdasarkan qr code
      const user = await checkinRepository.findUserByQrCode(qr_code);
      if (!user) {
        return res.status(404).json({ message: 'Member tidak ditemukan' });
      }

      // cari membership user
      const membership = await checkinRepository.findMembershipByUserId(user.id);
      if (!membership) {
        return res.status(400).json({ message: 'Membership tidak ditemukan' });
      }

      // validasi membership masih aktif
      // Ambil waktu sekarang dalam UTC lalu tambahkan offset +7 jam (WIB)
      const nowUtc = new Date();
      const nowWib = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);
      const endDate = new Date(membership.end_date);

      if (membership.is_active === false || endDate < nowUtc) {
        return res
          .status(400)
          .json({ message: 'Membership sudah tidak aktif atau expired' });
      }

      // simpan checkin baru dengan waktu WIB

      // set created_at manual ke WIB
      const checkin = await checkinRepository.create({
        user_id: user.id,
        checkin_time: nowWib,
        created_at: nowWib,
      });

      res.status(201).json({
        message: `Check-in berhasil untuk ${user.name} pada ${nowUtc.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
        data: checkin,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
