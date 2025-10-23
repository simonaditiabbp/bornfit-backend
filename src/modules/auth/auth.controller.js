import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';

export const authController = {
  login: async (req, res) => {
    try {
  const { email, password, latitude, longitude } = req.body;

      // cek user by email
      const user = await authRepository.findByEmail(email);
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

      // hanya admin yang boleh login
      if (user.role !== 'admin' && user.role !== 'opscan') {
        return res.status(403).json({ message: 'Hanya admin & opscan yang dapat login' });
      }

      // verifikasi password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password salah' });
      }

      // buat JWT
      const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      // update lokasi user jika ada
      let updatedUser = user;
      if (latitude && longitude) {
        updatedUser = await authRepository.updateLocation(user.id, latitude, longitude);
      }

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          latitude: updatedUser.latitude,
          longitude: updatedUser.longitude,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
