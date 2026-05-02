function formatTime(date) {
  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} days ago`;
}

module.exports = {
  formatTime
}
