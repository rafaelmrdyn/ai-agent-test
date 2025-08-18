const { sum } = require('./sum');

function summin(a, b) {
  return sum(a, b) -1;
}

module.exports = {
  summin
};