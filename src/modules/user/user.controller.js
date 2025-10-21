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
    const { name, email, qr_code, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ambil waktu WIB
    const nowUtc = new Date();
    const nowWib = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);

    const newUser = await userRepository.create({
      name,
      email,
      qr_code,
      role,
      password: hashedPassword,
      created_at: nowWib,
      updated_at: nowWib,
    });
    res.status(201).json(newUser);
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
      const existing = await userRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ message: 'User not found' });
      }


      // Ambil waktu WIB
      const nowUtc = new Date();
      const nowWib = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);

      const updated = await userRepository.update(id, {
        name,
        email,
        role,
        updated_at: nowWib,
      });

      res.json({
        message: 'User updated successfully',
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

};
