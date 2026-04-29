const express = require('express');
const router = express.Router();
const knex = require('../config/knex');
const { validateCounts } = require('../middleware/validate');

router.get('/', validateCounts, async (req, res, next) => {
  try {
    const isVaccinated = req.query.is_vaccinated === 'true';

    const records = await knex('people')
      .select(
        knex.raw('EXTRACT(YEAR FROM AGE(birthdate))::int AS age'),
        knex.raw('COUNT(*) AS count')
      )
      .where('is_vaccinated', isVaccinated)
      .groupBy('age')
      .orderBy('age', 'asc');

    const parsedData = records.map((d) => ({
      age: parseInt(d.age, 10),
      count: parseInt(d.count, 10),
    }));

    res.status(200).json({
      success: true,
      is_vaccinated: isVaccinated,
      data: parsedData,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
