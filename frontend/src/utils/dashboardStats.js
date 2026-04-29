import { fromApiFormat } from './dateUtils';

export const calculateDashboardStats = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      total: 0,
      vaccinatedPercent: 0,
      topAgeGroup: '--',
    };
  }

  const total = data.length;
  const vaccinatedCount = data.filter(
    (item) => item.is_vaccinated === true || item.is_vaccinated === 1 || item.is_vaccinated === 'true'
  ).length;
  const vaccinatedPercent = Math.round((vaccinatedCount / total) * 100);

  const ageGroups = { '< 18': 0, '18-35': 0, '36-50': 0, '51-65': 0, '65+': 0 };

  data.forEach((item) => {
    let age = item.age;

    if (age === undefined && item.birthdate) {
      const parsedDate = fromApiFormat(item.birthdate);
      if (parsedDate) {
        const diff = new Date() - parsedDate;
        age = Math.floor(diff / 31557600000);
      }
    }

    if (age < 18) ageGroups['< 18'] += 1;
    else if (age <= 35) ageGroups['18-35'] += 1;
    else if (age <= 50) ageGroups['36-50'] += 1;
    else if (age <= 65) ageGroups['51-65'] += 1;
    else ageGroups['65+'] += 1;
  });

  const topAgeGroup = Object.keys(ageGroups).reduce((a, b) =>
    ageGroups[a] > ageGroups[b] ? a : b
  );

  return {
    total,
    vaccinatedPercent,
    topAgeGroup,
  };
};