export default function toUnixTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}
