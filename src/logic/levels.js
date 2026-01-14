export const LEVEL_CONFIG = {
  1: {
    level: 1,
    targetTime: 45,
    targetMatchDensity: 0.70,
    ratios: { easy: 0.70, medium: 0.25, hard: 0.05 },
    idealAddRowUsage: [1, 1],
    rescueThreshold: 1,
    relief: false,
    note: "Easy. Instant gratification."
  },

  2: {
    level: 2,
    targetTime: 65,
    targetMatchDensity: 0.62,
    ratios: { easy: 0.55, medium: 0.35, hard: 0.10 },
    idealAddRowUsage: [1, 2],
    rescueThreshold: 1,
    relief: false,
    note: "Easy → Normal transition."
  },

  3: {
    level: 3,
    targetTime: 90,
    targetMatchDensity: 0.55,
    ratios: { easy: 0.45, medium: 0.40, hard: 0.15 },
    idealAddRowUsage: [2, 3],
    rescueThreshold: 2,
    relief: false,
    note: "Normal. Requires scanning."
  },

  4: {
    level: 4,
    targetTime: 120,
    targetMatchDensity: 0.48,
    ratios: { easy: 0.35, medium: 0.40, hard: 0.25 },
    idealAddRowUsage: [2, 3],
    rescueThreshold: 2,
    relief: false,
    note: "Challenging but fair."
  },

  5: {
    level: 5,
    targetTime: 150,
    targetMatchDensity: 0.40,
    ratios: { easy: 0.25, medium: 0.45, hard: 0.30 },
    idealAddRowUsage: [2, 3],
    rescueThreshold: 2,
    relief: false,
    note: "Hard. Matches buried behind decoys."
  },

  6: {
    level: 6,
    targetTime: 90,
    targetMatchDensity: 0.55,
    ratios: { easy: 0.45, medium: 0.40, hard: 0.15 },
    idealAddRowUsage: [2, 4],
    rescueThreshold: 1,
    relief: true,
    note: "Relief. Difficulty drops to Level 3 feel."
  },

  7: {
    level: 7,
    targetTime: 160,
    targetMatchDensity: 0.38,
    ratios: { easy: 0.20, medium: 0.45, hard: 0.35 },
    idealAddRowUsage: [3, 4],
    rescueThreshold: 2,
    relief: false,
    note: "Difficulty ramps up again."
  },

  8: {
    level: 8,
    targetTime: 180,
    targetMatchDensity: 0.34,
    ratios: { easy: 0.15, medium: 0.40, hard: 0.45 },
    idealAddRowUsage: [3, 4],
    rescueThreshold: 2,
    relief: false,
    note: "Very hard. Hard matches dominate."
  },

  9: {
    level: 9,
    targetTime: 200,
    targetMatchDensity: 0.30,
    ratios: { easy: 0.10, medium: 0.35, hard: 0.55 },
    idealAddRowUsage: [4, 5],
    rescueThreshold: 3,
    relief: false,
    note: "Peak difficulty."
  },

  10: {
    level: 10,
    targetTime: 220,
    targetMatchDensity: 0.28,
    ratios: { easy: 0.08, medium: 0.32, hard: 0.60 },
    idealAddRowUsage: [4, 5],
    rescueThreshold: 3,
    relief: false,
    note: "Maximum challenge."
  },

  11: {
    level: 11,
    targetTime: 150,
    targetMatchDensity: 0.50,
    ratios: { easy: 0.40, medium: 0.40, hard: 0.20 },
    idealAddRowUsage: [2, 4],
    rescueThreshold: 1,
    relief: true,
    note: "Relief. Player breathes again."
  }
};