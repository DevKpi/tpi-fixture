export function parseApiDate(dateString) {
  if (!dateString) return null;

  if (dateString instanceof Date) {
    return Number.isNaN(dateString.getTime()) ? null : dateString;
  }

  const value = String(dateString).trim();
  if (!value) return null;

  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (match) {
    const [, day, month, year, hour = '00', minute = '00'] = match;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}