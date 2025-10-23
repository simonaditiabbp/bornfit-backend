import bcrypt from 'bcryptjs';
import { userRepository } from './user.repository.js';

export const userController = {
  getAllUsers: async (req, res) => {
    const users = await userRepository.findAll();
    res.json(users);
  },

  getUserById: async (req, res) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  },

  createUser: async (req, res) => {
    const { name, email, qr_code, role, password, membership } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ambil waktu WIB
    const nowUtc = new Date();
    const nowWib = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);

    // Handle photo jika ada
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    // default qr_code untuk admin dan opscan
    const finalQrCode = (role === "admin" || role === "opscan") ? nowWib.toISOString() : qr_code;

    // Buat user baru
    const newUser = await userRepository.create({
      name,
      email,
      qr_code: finalQrCode,
      role,
      password: hashedPassword,
      photo: photoPath,
      created_at: nowWib,
      updated_at: nowWib,
    });

    // Jika ada membership di body, buat membership untuk user baru
    let newMembership = null;
    if (membership && membership.start_date && membership.end_date) {
      // Import repository secara dinamis agar tidak circular
      const mod = await import('../membership/membership.repository.js');
      newMembership = await mod.membershipRepository.create({
        user_id: newUser.id,
        start_date: new Date(membership.start_date),
        end_date: new Date(membership.end_date),
        is_active: true,
        created_at: nowWib,
        updated_at: nowWib,
      });
    }

  res.status(201).json({ user: newUser, membership: newMembership });
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, role, membership } = req.body;

    try {
      const existing = await userRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ message: 'User not found' });
      }


      // Ambil waktu WIB
      const nowUtc = new Date();
      const nowWib = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);

      // Handle photo jika ada
      let photoPath = existing.photo;
      if (req.file) {
        photoPath = `/uploads/${req.file.filename}`;
      }

      const updated = await userRepository.update(id, {
        name,
        email,
        role,
        photo: photoPath,
        updated_at: nowWib,
      });

      let newMembership = null;
      if (membership && membership.start_date && membership.end_date) {
        // Import repository secara dinamis agar tidak circular
        const mod = await import('../membership/membership.repository.js');
        let getMembership = await mod.membershipRepository.findByUserId(updated.id);

        newMembership = await mod.membershipRepository.update(getMembership.id, {
          start_date: new Date(membership.start_date),
          end_date: new Date(membership.end_date),
          updated_at: nowWib,
        });
      }

      res.json({
        message: 'User updated successfully',
        data: updated,
        membership: newMembership,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

    deleteUser: async (req, res) => {
      const { id } = req.params;
      try {
        const user = await userRepository.findById(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const deletedUser = await userRepository.delete(id);
        res.json({ message: 'User deleted (soft delete) successfully', data: deletedUser });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },

};
