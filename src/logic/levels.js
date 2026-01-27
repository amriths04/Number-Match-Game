export const LEVEL_CONFIG = {

  1: {
    level: 1,
    experience: "Very Easy. Instant gratification.",

    orderRobustness: 1.0,
    convergenceDepth: Infinity,
    dominantChoiceRatio: 1,
    decoyDensity: 0.0,
    initialMatchDensity: 0.9, 
    addRow: {
      stragglerHelp: 1.0,
      decoyDensity: 0.0,
      dependencyDepth: 0
    },

    telemetry: {
      targetTime: 45,
      expectedAddRowUsage: [0, 1]
    }
  },

  2: {
    level: 2,
    experience: "Easy. Obvious matches.",

    orderRobustness: 0.9,
    convergenceDepth: 5,
    dominantChoiceRatio: 0.85,
    decoyDensity: 0.1,
    initialMatchDensity: 0.7, 
    addRow: {
      stragglerHelp: 0.95,
      decoyDensity: 0.05,
      dependencyDepth: 0
    },

    telemetry: {
      targetTime: 60,
      expectedAddRowUsage: [1, 2]
    }
  },

  3: {
    level: 3,
    experience: "Normal. Requires scanning.",

    orderRobustness: 0.75,
    convergenceDepth: 3,
    dominantChoiceRatio: 0.7,
    decoyDensity: 0.2,
    initialMatchDensity: 0.6, 
    addRow: {
      stragglerHelp: 0.85,
      decoyDensity: 0.15,
      dependencyDepth: 0
    },

    telemetry: {
      targetTime: 90,
      expectedAddRowUsage: [2, 3]
    }
  },

  4: {
    level: 4,
    experience: "Normal+. Order starts to matter.",

    orderRobustness: 0.69,
    convergenceDepth: 2,
    dominantChoiceRatio: 0.56,
    decoyDensity: 0.25,
    initialMatchDensity: 0.49,
    addRow: {
      stragglerHelp: 0.75,
      decoyDensity: 0.18,
      dependencyDepth: 1
    },

    telemetry: {
      targetTime: 120,
      expectedAddRowUsage: [2, 3]
    }
  },

  5: {
    level: 5,
    experience: "Hard. Matches buried behind decoys.",

    orderRobustness: 0.45,
    convergenceDepth: 1,
    dominantChoiceRatio: 0.4,
    decoyDensity: 0.45,
    initialMatchDensity: 0.4,
    addRow: {
      stragglerHelp: 0.65,
      decoyDensity: 0.35,
      dependencyDepth: 1
    },

    telemetry: {
      targetTime: 150,
      expectedAddRowUsage: [2, 3]
    }
  },

  // 🔽 SAWTOOTH RELIEF
  6: {
    level: 6,
    experience: "Relief. Back to Normal difficulty.",

    orderRobustness: 0.6,
    convergenceDepth: 2,
    dominantChoiceRatio: 0.6,
    decoyDensity: 0.25,
    initialMatchDensity: 0.5,
    addRow: {
      stragglerHelp: 0.8,
      decoyDensity: 0.2,
      dependencyDepth: 0
    },

    telemetry: {
      targetTime: 90,
      expectedAddRowUsage: [2, 4]
    }
  },

  7: {
    level: 7,
    experience: "Hard+. Optimal order exists.",

    orderRobustness: 0.35,
    convergenceDepth: 1,
    dominantChoiceRatio: 0.3,
    decoyDensity: 0.55,
    initialMatchDensity: 0.45,
    addRow: {
      stragglerHelp: 0.55,
      decoyDensity: 0.45,
      dependencyDepth: 1
    },

    telemetry: {
      targetTime: 150,
      expectedAddRowUsage: [3, 4]
    }
  },

  8: {
    level: 8,
    experience: "Very Hard. Order is strict.",

    orderRobustness: 0.25,
    convergenceDepth: 0,
    dominantChoiceRatio: 0.25,
    decoyDensity: 0.65,
    initialMatchDensity: 0.35,
    addRow: {
      stragglerHelp: 0.45,
      decoyDensity: 0.55,
      dependencyDepth: 2
    },

    telemetry: {
      targetTime: 180,
      expectedAddRowUsage: [4, 5]
    }
  },

  9: {
    level: 9,
    experience: "Extreme. Mistakes compound fast.",

    orderRobustness: 0.18,
    convergenceDepth: 0,
    dominantChoiceRatio: 0.18,
    decoyDensity: 0.72,
    initialMatchDensity: 0.37,
    addRow: {
      stragglerHelp: 0.35,
      decoyDensity: 0.65,
      dependencyDepth: 2
    },

    telemetry: {
      targetTime: 210,
      expectedAddRowUsage: [4, 5]
    }
  },

  10: {
    level: 10,
    experience: "Mastery. Precision required.",

    orderRobustness: 0.12,
    convergenceDepth: 0,
    dominantChoiceRatio: 0.15,
    decoyDensity: 0.8,
    initialMatchDensity: 0.3,
    addRow: {
      stragglerHelp: 0.25,
      decoyDensity: 0.7,
      dependencyDepth: 3
    },

    telemetry: {
      targetTime: 240,
      expectedAddRowUsage: [5, 6]
    }
  }
};
