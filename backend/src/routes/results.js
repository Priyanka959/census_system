const express = require('express');
const router = express.Router();
const knex = require('../config/knex');

router.get('/', async (req, res, next) => {
  try {
    const records = await knex('people')
      .select(
        knex.raw('EXTRACT(YEAR FROM AGE(birthdate))::int AS age'),
        'gender',
        knex.raw('COUNT(*) AS count')
      )
      .groupBy('age', 'gender')
      .orderBy('age', 'asc');

    const parsedData = records.map((d) => ({
      age: parseInt(d.age, 10),
      gender: d.gender,
      count: parseInt(d.count, 10),
    }));

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
