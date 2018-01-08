export default function getFullHour(date) {
  const result = new Date(date);
  result.setMinutes(0, 0, 0);
  return result;
}
