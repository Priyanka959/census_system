export const buildLineChartData = (vaxData, unvaxData) => {
  if ((!vaxData || vaxData.length === 0) && (!unvaxData || unvaxData.length === 0)) {
    return null;
  }

  const ageSet = new Set();
  (vaxData || []).forEach((item) => {
    if (item.age != null) ageSet.add(item.age);
  });
  (unvaxData || []).forEach((item) => {
    if (item.age != null) ageSet.add(item.age);
  });

  const labels = Array.from(ageSet).sort((a, b) => a - b);

  const vaxCounts = labels.map((age) => {
    const record = (vaxData || []).find((item) => item.age === age);
    return record ? record.count : 0;
  });

  const unvaxCounts = labels.map((age) => {
    const record = (unvaxData || []).find((item) => item.age === age);
    return record ? record.count : 0;
  });

  return {
    labels,
    datasets: [
      {
        label: 'Vaccinated',
        data: vaxCounts,
        borderColor: '#D4F53C',
        backgroundColor: 'rgba(212, 245, 60, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#D4F53C',
        pointBorderColor: '#242424',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#D4F53C',
      },
      {
        label: 'Unvaccinated',
        data: unvaxCounts,
        borderColor: '#FF4D6D',
        backgroundColor: 'rgba(255, 77, 109, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF4D6D',
        pointBorderColor: '#242424',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#FF4D6D',
      },
    ],
  };
};

export const buildBarChartData = (data) => {
  if (!data || data.length === 0) {
    return null;
  }

  const ageSet = new Set();
  data.forEach((item) => {
    if (item.age != null) ageSet.add(item.age);
  });

  const labels = Array.from(ageSet).sort((a, b) => a - b);

  const maleCounts = labels.map((age) => {
    const record = data.find((item) => item.age === age && item.gender?.toLowerCase() === 'male');
    return record ? record.count : 0;
  });

  const femaleCounts = labels.map((age) => {
    const record = data.find((item) => item.age === age && item.gender?.toLowerCase() === 'female');
    return record ? record.count : 0;
  });

  const otherCounts = labels.map((age) => {
    const record = data.find((item) => item.age === age && item.gender?.toLowerCase() === 'other');
    return record ? record.count : 0;
  });

  return {
    labels,
    datasets: [
      {
        label: 'Male',
        data: maleCounts,
        backgroundColor: '#2979FF',
        borderRadius: 0,
      },
      {
        label: 'Female',
        data: femaleCounts,
        backgroundColor: '#FF4D6D',
        borderRadius: 0,
      },
      {
        label: 'Other',
        data: otherCounts,
        backgroundColor: '#FFB800',
        borderRadius: 0,
      },
    ],
  };
};
