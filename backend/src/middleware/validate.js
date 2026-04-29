const validateVote = (req, res, next) => {
  let { name, is_vaccinated, birthdate, gender } = req.body;

  if (name === undefined || name === null) {
    return res.status(400).json({ error: 'name is required' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name cannot be empty' });
  }

  if (
    !gender ||
    !['male', 'female', 'other'].includes(gender.toString().toLowerCase())
  ) {
    return res
      .status(400)
      .json({ error: 'gender must be male, female, or other' });
  }

  if (!birthdate) {
    return res.status(400).json({ error: 'birthdate is required' });
  }

  let dateObj;
  // Handle DD-MM-YYYY format
  const parts = String(birthdate).split('-');
  if (parts.length === 3 && parts[2].length === 4) {
    dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
  } else {
    dateObj = new Date(birthdate);
  }

  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ error: 'birthdate is required' });
  }

  const now = new Date();
  if (dateObj > now) {
    return res.status(400).json({ error: 'birthdate cannot be a future date' });
  }

  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(now.getFullYear() - 100);
  if (dateObj < hundredYearsAgo) {
    return res
      .status(400)
      .json({ error: 'birthdate must be within the last 100 years' });
  }

  if (typeof is_vaccinated !== 'boolean') {
    return res
      .status(400)
      .json({ error: 'is_vaccinated must be true or false' });
  }

  req.body.name = name.trim();
  req.body.gender = gender.toString().toLowerCase();
  req.body.parsedBirthdate = dateObj;

  next();
};

const validateCounts = (req, res, next) => {
  const { is_vaccinated } = req.query;
  if (is_vaccinated === undefined) {
    return res
      .status(400)
      .json({ error: 'is_vaccinated query param is required (true or false)' });
  }
  if (is_vaccinated !== 'true' && is_vaccinated !== 'false') {
    return res
      .status(400)
      .json({ error: "is_vaccinated must be 'true' or 'false'" });
  }
  next();
};

module.exports = { validateVote, validateCounts };
