const express = require('express');
const router = express.Router();
const knex = require('../config/knex');
const { validateVote } = require('../middleware/validate');

router.post('/', validateVote, async (req, res, next) => {
  try {
    const { name, is_vaccinated, parsedBirthdate, gender } = req.body;

    const existing = await knex('people')
      .where({ name, birthdate: parsedBirthdate })
      .first();

    if (existing) {
      return res.status(409).json({ error: 'Record already exists' });
    }

    const [inserted] = await knex('people')
      .insert({
        name,
        is_vaccinated,
        birthdate: parsedBirthdate,
        gender,
      })
      .returning('*');

    res.status(201).json({
      success: true,
      message: 'Record saved successfully',
      data: inserted,
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validateVote, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_vaccinated, parsedBirthdate, gender } = req.body;

    const existing = await knex('people').where({ id }).first();

    if (!existing) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const duplicate = await knex('people')
      .where({ name, birthdate: parsedBirthdate })
      .whereNot({ id })
      .first();

    if (duplicate) {
      return res
        .status(409)
        .json({
          error: 'Another record with this name and birthdate already exists',
        });
    }

    const [updated] = await knex('people')
      .where({ id })
      .update({
        name,
        is_vaccinated,
        birthdate: parsedBirthdate,
        gender,
      })
      .returning('*');

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await knex('people').where({ id }).first();

    if (!existing) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await knex('people').where({ id }).del();

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
