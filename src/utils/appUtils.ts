
export function formatTimeToHHMM(time: Date) {
  let date;

  if (typeof time === 'string') {
    date = new Date(`1970-01-01T${time}Z`);
  } else if (time instanceof Date) {
    date = time;
  } else {
    throw new Error('Invalid input type. Expected a string or Date object.');
  }

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}
