import { membershipRepository } from "./membership.Repository.js";

export const membershipController = {
  getAll: async (req, res) => {
    try {
      const data = await membershipRepository.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await membershipRepository.getById(req.params.id);
      if (!data) return res.status(404).json({ message: "Not found" });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
  // Ambil waktu WIB
  const todayUtc = new Date();
  const todayWib = new Date(todayUtc.getTime() + 7 * 60 * 60 * 1000);
  const today = todayUtc;
      const { user_id, start_date, end_date, ...rest } = req.body;

      // Cek apakah user sudah punya membership
      const existingMembership = await membershipRepository.findByUserId(user_id);

      if (existingMembership) {
        return res.status(409).json({
          error: 'User already has a membership. Please update the existing one.'
        });
      }

      // Hitung is_active
      let is_active = false;
      if (start_date && end_date) {
        const start = new Date(start_date);
        const end = new Date(end_date);

        if (start <= today && end >= today) {
          is_active = true;
        }
      }

      const dataToCreate = {
        ...rest,
        user_id,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        is_active,
        created_at: todayWib,
        updated_at: todayWib,
      };

      const data = await membershipRepository.create(dataToCreate);
      res.status(201).json(data);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
  // Ambil waktu WIB
  const todayUtc = new Date();
  const todayWib = new Date(todayUtc.getTime() + 7 * 60 * 60 * 1000);
  const today = todayUtc;
        const { start_date, end_date, ...rest } = req.body;

        let is_active = false;

        if (start_date && end_date) {
        const start = new Date(start_date);
        const end = new Date(end_date);

        if (start <= today && end >= today) {
            is_active = true;
        }
        }

  const dataToUpdate = {
  ...rest,
  start_date: start_date ? new Date(start_date) : undefined,
  end_date: end_date ? new Date(end_date) : undefined,
  is_active,
  updated_at: todayWib,
  };

        const data = await membershipRepository.update(req.params.id, dataToUpdate);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await membershipRepository.delete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
