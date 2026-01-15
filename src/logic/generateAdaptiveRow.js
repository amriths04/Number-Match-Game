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


  const easy = [];    // frequent → visible
  const medium = [];  // single → far same / adj sum
  const hard = [];    // lonely / decoys

  numbers.forEach((n) => {
    const f = frequencyMap[n];
    if (f >= 2) easy.push(n);
    else if (f === 1) medium.push(n);
  });

  lonelyNumbers.forEach((n) => hard.push(n));

  if (easy.length === 0) easy.push(...medium);
  if (medium.length === 0) medium.push(...easy);
  if (hard.length === 0) hard.push(...medium);


  const row = [];

  for (let i = 0; i < cols; i++) {
    let bucket = weightedPick(ratios);

    // Intent bias
    if (intent === "help" && Math.random() < 0.6) bucket = "easy";
    if (intent === "disrupt" && Math.random() < 0.6) bucket = "hard";

    let value;

    /* EASY */
    if (bucket === "easy") {
      value = pick(easy);
    }

    /* MEDIUM */
    else if (bucket === "medium") {
      if (Math.random() < 0.5) {
        // far SAME
        value = pick(medium);
      } else {
        // adjacent SUM=10 candidate
        const sum = numbers.filter(n => numbers.includes(10 - n));
        value = sum.length ? pick(sum) : pick(medium);
      }
    }

    /* HARD (worst cases) */
    else {
      const roll = Math.random();

      if (roll < 0.45) {
        // FAR SUM = 10 (hardest)
        const sum = numbers.filter(n => numbers.includes(10 - n));
        value = sum.length ? pick(sum) : pick(hard);
      }
      else if (roll < 0.75) {
        // FAR SAME (diagonal / wrap potential)
        value = pick(medium);
      }
      else {
        // DECOY NOISE
        value = pick(hard);
      }
    }

    row.push(value);
  }

  console.log("LEVEL", level, "INTENT", intent, "ROW", row);
  return row;
};
