import { LEVEL_CONFIG } from "./levels";
import { analyzeBoardState } from "./AnalyzeBoard";

const weightedPick = (weights) => {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const k in weights) {
    if (r < weights[k]) return k;
    r -= weights[k];
  }
  return Object.keys(weights)[0];
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateAdaptiveRow = (board, level) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG[1];
  const { ratios, targetMatchDensity, rescueThreshold } = cfg;

  const {
    matchDensity,
    remainingMatches,
    frequencyMap,
    lonelyNumbers,
    choiceMap
  } = analyzeBoardState(board);

  const cols = board[0].length;
  const numbers = Object.keys(frequencyMap).map(Number);

  let intent = "neutral";

  if (remainingMatches <= rescueThreshold) {
    intent = "help";
  } else {
    const delta = targetMatchDensity - matchDensity;
    if (delta > 0.08) intent = "help";
    else if (delta < -0.08) intent = "disrupt";
  }

  const easy = [];
  const medium = [];
  const hard = [];

  numbers.forEach((n) => {
    const f = frequencyMap[n];
    if (f >= 2) easy.push(n);
    else if (f === 1) medium.push(n);
  });

  lonelyNumbers.forEach((n) => hard.push(n));

  if (easy.length === 0) easy.push(...medium);
  if (medium.length === 0) medium.push(...easy);
  if (hard.length === 0) hard.push(...medium);

  const constrained = Object.keys(choiceMap || {})
    .filter(n => choiceMap[n] === 1)
    .map(Number);

  if (constrained.length === 0) constrained.push(...medium);

  const row = [];

  for (let i = 0; i < cols; i++) {
    let bucket = weightedPick(ratios);

    if (intent === "help" && level <= 5 && Math.random() < 0.6) {
      bucket = "easy";
    }

    if (intent === "disrupt" && level >= 7 && Math.random() < 0.6) {
      bucket = "hard";
    }

    let value;

    if (bucket === "easy") {
      value = pick(easy);
    }
    else if (bucket === "medium") {
      if (Math.random() < 0.5) {
        value = pick(medium);
      } else {
        const sum = numbers.filter(n => numbers.includes(10 - n));
        value = sum.length ? pick(sum) : pick(medium);
      }
    }
    else {
      const roll = Math.random();

      if (roll < 0.45) {
        const sum = constrained.filter(n => numbers.includes(10 - n));
        value = sum.length ? pick(sum) : pick(constrained);
      }
      else if (roll < 0.75) {
        value = pick(constrained);
      }
      else {
        value = pick(hard);
      }
    }

    row.push(value);
  }

  return row;
};
