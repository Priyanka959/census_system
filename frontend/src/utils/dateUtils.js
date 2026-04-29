import { format, parseISO, isValid } from 'date-fns';

export const formatDisplay = (dateValue) => {
  if (!dateValue) return '--';
  const parsed = fromApiFormat(dateValue);
  if (!isValid(parsed)) return '--';
  return format(parsed, 'dd-MM-yyyy');
};

export const toApiFormat = (dateValue) => {
  if (!dateValue) return null;
  const parsed = fromApiFormat(dateValue);
  if (!isValid(parsed)) return null;
  return format(parsed, 'dd-MM-yyyy');
};

export const fromApiFormat = (str) => {
  if (!str) return null;
  
  // Try direct parsing first for ISO string
  const d = new Date(str);
  if (isValid(d)) return d;

  // Handle DD-MM-YYYY format
  const parts = str.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
    if (isValid(parsed)) return parsed;
  }

  return null;
};
