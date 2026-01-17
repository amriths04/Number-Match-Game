import { LEVEL_CONFIG } from "./levels";
import { analyzeBoardState } from "./AnalyzeBoard";

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const chance = (p) => Math.random() < p;

export const generateAdaptiveRow = (
  board,
  level,
  addRowUsed,
  MAX_ADD_ROWS
) => {
  const cfg = LEVEL_CONFIG[level];
  const {
    maxStragglers,
    rescueThreshold,
    tension,
    addRowReliability,
    matchSpacingBias,
    entropyBudget,
    idealAddRowUsage,
  } = cfg;
  const [idealMin, idealMax] = idealAddRowUsage;

// 🔥 Add-Row Timing Penalty
const timingMultiplier =
  addRowUsed < idealMin
    ? 0.6   // too early → weak help
    : addRowUsed > idealMax
    ? 1.2   // too late → desperation help
    : 1.0;  // ideal window

    const effectiveReliability = Math.min(
  1,
  addRowReliability * timingMultiplier
);

const effectiveEntropy = Math.min(
  1,
  entropyBudget / timingMultiplier
);

  const {
    lonelyNumbers,
    frequencyMap,
    remainingMatches,
  } = analyzeBoardState(board);

  const cols = board[0].length;
  const row = Array(cols).fill(null);

  /* -------------------------------------------------
     1️⃣ RESCUE MODE (STRICT, LEVEL-AWARE)
  ------------------------------------------------- */
  const exceededIdealUsage = addRowUsed >= idealAddRowUsage[1];
  const rescueMode =
    (remainingMatches === 0 && exceededIdealUsage) ||
    lonelyNumbers.length > maxStragglers ||
    (remainingMatches <= rescueThreshold && tension <= 4);

  /* -------------------------------------------------
     2️⃣ INJECTION BUDGET (ENTROPY-CAPPED)
  ------------------------------------------------- */
  let maxInject;

  if (rescueMode) {
    maxInject = 4;
  } else {
    maxInject = Math.max(
  1,
  Math.round((1 - effectiveEntropy) * 6)
);
  }

  let injected = 0;

  /* -------------------------------------------------
     3️⃣ STRAGGLER HANDLING (NOT ALWAYS HELPFUL)
  ------------------------------------------------- */
  const shuffledStragglers = [...lonelyNumbers].sort(
    () => Math.random() - 0.5
  );

  for (const n of shuffledStragglers) {
    if (injected >= maxInject) break;

    // reliability gate
    if (!chance(effectiveReliability)) continue;

    if (matchSpacingBias === "adjacent") {
      const c = rand(0, cols - 2);
      row[c] = n;
      row[c + 1] = n;
      injected += 2;
    }

    else if (matchSpacingBias === "row") {
      const c1 = rand(0, cols - 1);
      const c2 = (c1 + rand(2, 4)) % cols;
      row[c1] = n;
      row[c2] = n;
      injected += 2;
    }

    else if (matchSpacingBias === "far") {
      row[rand(0, cols - 1)] = n;
      injected += 1; // friction
    }

    else {
      // chaotic → decoy-heavy
      row[rand(0, cols - 1)] = n;
      injected += 1;
    }
  }

  /* -------------------------------------------------
     4️⃣ FORCED MATCH (ONLY TRUE RESCUE)
  ------------------------------------------------- */
  if (rescueMode && injected < 2) {
    const nums = Object.keys(frequencyMap).map(Number);

    for (const n of nums) {
      const c = 10 - n;
      if (!nums.includes(c)) continue;

      // even rescue respects spacing bias
      if (matchSpacingBias === "adjacent") {
        row[1] = n;
        row[2] = c;
      } else if (matchSpacingBias === "row") {
        row[1] = n;
        row[cols - 2] = c;
      } else {
        row[0] = n;
        row[cols - 1] = c;
      }

      injected = 2;
      break;
    }
  }

  /* -------------------------------------------------
     5️⃣ ENTROPY FILL (THE KEY DIFFICULTY DRIVER)
     Adds misleading numbers intentionally
  ------------------------------------------------- */
  if (injected < maxInject && effectiveEntropy > 0.25) {
    const nums = Object.keys(frequencyMap).map(Number);

    const entropyAdds = Math.round(effectiveEntropy * 4);

    for (let i = 0; i < entropyAdds && injected < maxInject; i++) {
      row[rand(0, cols - 1)] = nums.length
        ? nums[rand(0, nums.length - 1)]
        : rand(1, 9);
      injected += 1;
    }
  }

  /* -------------------------------------------------
     6️⃣ SAFETY NET (NEVER DEAD, NEVER EASY)
  ------------------------------------------------- */
  if (injected === 0) {
    row[rand(0, cols - 1)] = rand(1, 9);
  }

  return row;
};
