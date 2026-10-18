function score(text) {
  const lower = text.toLowerCase();
  let value = 50;

  if (text.length > 100) {
    value += 20;
  }

  if (lower.includes("example")) {
    value += 10;
  }

  if (lower.includes("team")) {
    value += 10;
  }

  return Math.min(100, value);
}

module.exports = { score };
