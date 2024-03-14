export const getRemainingTime = (expiry: Date) => {
  const now = new Date();
  const diff = new Date(expiry - now);
  if (diff < 0) {
    return "Expired";
  }
  const hour = Math.floor(diff / 60 / 60 / 1000);
  const minute = Math.floor((diff - hour * 60 * 60 * 1000) / 60 / 1000) % 60;
  const second =
    Math.floor((diff - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000) % 60;
  return `${hour}:${minute}:${second}`;
};
