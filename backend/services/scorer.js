function score(text) {
  let value = 50;

  if (text.length > 100) {
    value += 20;
  }

  if (text.includes("example")) {
    value += 10;
  }

  if (text.includes("team")) {
    value += 10;
  }

  return Math.min(100, value);
}

module.exports = { score };