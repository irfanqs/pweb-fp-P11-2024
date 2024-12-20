const Report = require('../models/Report');

module.exports.createReport = async (req, res) => {
  try {
    const { username, type, description } = req.body;

    if (!username || !type || !description) {
      return res.status(400).json({ error: 'Semua field harus diisi!' });
    }

    const newReport = new Report({ username, type, description });
    await newReport.save();
    res.status(201).json({ message: 'Laporan berhasil dibuat!', report: newReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};