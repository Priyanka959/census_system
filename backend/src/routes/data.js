const express = require('express');
const router = express.Router();
const knex = require('../config/knex');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const y = date.getUTCFullYear();
  return `${d}-${m}-${y}`;
};

router.get('/', async (req, res, next) => {
  try {
    const records = await knex('people').orderBy('id', 'asc');

    const formattedRecords = records.map((r) => ({
      ...r,
      birthdate: formatDate(r.birthdate),
    }));

    res.status(200).json({
      success: true,
      count: formattedRecords.length,
      data: formattedRecords,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
