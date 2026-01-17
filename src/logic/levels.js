export const LEVEL_CONFIG = {
  1: {
    level: 1,
    tension: 2,
    expectedClearance: 0.90,
    maxStragglers: 2,
    rescueThreshold: 1,
    idealAddRowUsage: [0, 1],
    relief: false,

    // 🆕 Difficulty drivers
    addRowReliability: 0.95,
    matchSpacingBias: "adjacent",
    entropyBudget: 0.10,

    note: "Easy. Instant gratification."
  },

  2: {
    level: 2,
    tension: 3,
    expectedClearance: 0.85,
    maxStragglers: 3,
    rescueThreshold: 1,
    idealAddRowUsage: [1, 2],
    relief: false,

    addRowReliability: 0.85,
    matchSpacingBias: "adjacent",
    entropyBudget: 0.18,

    note: "Easy → Normal transition."
  },

  3: {
    level: 3,
    tension: 4,
    expectedClearance: 0.78,
    maxStragglers: 5,
    rescueThreshold: 2,
    idealAddRowUsage: [2, 3],
    relief: false,

    addRowReliability: 0.75,
    matchSpacingBias: "row",
    entropyBudget: 0.25,

    note: "Normal. Requires scanning."
  },

  4: {
    level: 4,
    tension: 5,
    expectedClearance: 0.72,
    maxStragglers: 6,
    rescueThreshold: 2,
    idealAddRowUsage: [2, 3],
    relief: false,

    addRowReliability: 0.65,
    matchSpacingBias: "row",
    entropyBudget: 0.32,

    note: "Challenging but fair."
  },

  5: {
    level: 5,
    tension: 6,
    expectedClearance: 0.65,
    maxStragglers: 8,
    rescueThreshold: 2,
    idealAddRowUsage: [2, 3],
    relief: false,

    addRowReliability: 0.55,
    matchSpacingBias: "far",
    entropyBudget: 0.40,

    note: "Hard. Matches buried behind decoys."
  },

  // 🔽 SAWTOOTH DROP (RELIEF)
  6: {
    level: 6,
    tension: 4,
    expectedClearance: 0.75,
    maxStragglers: 5,
    rescueThreshold: 1,
    idealAddRowUsage: [2, 4],
    relief: true,

    addRowReliability: 0.80,
    matchSpacingBias: "row",
    entropyBudget: 0.22,

    note: "Relief. Difficulty drops."
  },

  7: {
    level: 7,
    tension: 7,
    expectedClearance: 0.60,
    maxStragglers: 9,
    rescueThreshold: 2,
    idealAddRowUsage: [3, 4],
    relief: false,

    addRowReliability: 0.45,
    matchSpacingBias: "far",
    entropyBudget: 0.48,

    note: "Difficulty ramps up again."
  },

  8: {
    level: 8,
    tension: 8,
    expectedClearance: 0.55,
    maxStragglers: 10,
    rescueThreshold: 2,
    idealAddRowUsage: [3, 4],
    relief: false,

    addRowReliability: 0.35,
    matchSpacingBias: "far",
    entropyBudget: 0.58,

    note: "Very hard."
  },

  9: {
    level: 9,
    tension: 9,
    expectedClearance: 0.50,
    maxStragglers: 12,
    rescueThreshold: 3,
    idealAddRowUsage: [4, 5],
    relief: false,

    addRowReliability: 0.25,
    matchSpacingBias: "chaotic",
    entropyBudget: 0.68,

    note: "Peak difficulty."
  },

  10: {
    level: 10,
    tension: 10,
    expectedClearance: 0.45,
    maxStragglers: 14,
    rescueThreshold: 3,
    idealAddRowUsage: [4, 5],
    relief: false,

    addRowReliability: 0.15,
    matchSpacingBias: "chaotic",
    entropyBudget: 0.78,

    note: "Maximum challenge."
  },

  // 🔽 SECOND RELIEF
  11: {
    level: 11,
    tension: 5,
    expectedClearance: 0.70,
    maxStragglers: 6,
    rescueThreshold: 1,
    idealAddRowUsage: [2, 4],
    relief: true,

    addRowReliability: 0.75,
    matchSpacingBias: "row",
    entropyBudget: 0.25,

    note: "Relief. Player breathes again."
  }
};