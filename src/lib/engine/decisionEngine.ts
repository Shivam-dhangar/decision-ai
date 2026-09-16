import {
  DecisionOption,
  DecisionCriterion,
  ScoreMatrix,
  OptionResult,
  CriterionContribution,
  SensitivityItem,
} from '@/types/decision';

export interface DecisionCalculationOutput {
  winnerId: string;
  winnerName: string;
  winnerScore: number;
  ranking: OptionResult[];
  sensitivity: SensitivityItem[];
  stabilityIndex: number; // 0 to 100%
  calculatedAt: string;
}

/**
 * Normalizes an array of criteria weights so they sum to 1 (100%).
 * Returns a map of criterionId -> normalized weight (0 to 1).
 */
export function calculateNormalizedWeights(
  criteria: DecisionCriterion[]
): Record<string, number> {
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight > 0 ? c.weight : 1), 0);
  const normalized: Record<string, number> = {};

  if (totalWeight === 0) {
    const equalWeight = 1 / (criteria.length || 1);
    criteria.forEach((c) => {
      normalized[c.id] = equalWeight;
    });
    return normalized;
  }

  criteria.forEach((c) => {
    const raw = c.weight > 0 ? c.weight : 1;
    normalized[c.id] = raw / totalWeight;
  });

  return normalized;
}

/**
 * Deterministic calculation of option scores, contributions, rankings,
 * sensitivity analysis, and stability index.
 */
export function calculateDecisionResults(
  options: DecisionOption[],
  criteria: DecisionCriterion[],
  scores: ScoreMatrix
): DecisionCalculationOutput | null {
  if (!options.length || !criteria.length) {
    return null;
  }

  const normalizedWeights = calculateNormalizedWeights(criteria);

  // 1. Calculate scores and contributions for each option
  const optionResults: OptionResult[] = options.map((option) => {
    let finalScoreRaw = 0;
    const contributions: CriterionContribution[] = [];

    criteria.forEach((crit) => {
      const optionScores = scores[option.id] || {};
      const scoreObj = optionScores[crit.id];
      const rawScore = scoreObj?.score !== undefined ? scoreObj.score : 5; // default 5 if unrated

      const normWeight = normalizedWeights[crit.id] || 0;
      // Contribution out of 100 points
      const contributionPoints = normWeight * rawScore * 10;
      finalScoreRaw += contributionPoints;

      contributions.push({
        criterionId: crit.id,
        criterionName: crit.name,
        rawScore,
        rawWeight: crit.weight,
        normalizedWeight: normWeight,
        contributionPoints: Number(contributionPoints.toFixed(1)),
        percentageOfFinalScore: 0, // calculated below
      });
    });

    const finalScore = Number(finalScoreRaw.toFixed(1));

    // Update percentage of final score
    contributions.forEach((c) => {
      c.percentageOfFinalScore = finalScore > 0
        ? Number(((c.contributionPoints / finalScore) * 100).toFixed(1))
        : 0;
    });

    // Identify strongest and weakest criteria
    const sortedByScore = [...contributions].sort((a, b) => b.rawScore - a.rawScore);
    const strongestCriteria = sortedByScore
      .filter((c) => c.rawScore >= 7)
      .slice(0, 3)
      .map((c) => c.criterionName);
    const weakestCriteria = sortedByScore
      .slice()
      .reverse()
      .filter((c) => c.rawScore <= 6)
      .slice(0, 2)
      .map((c) => c.criterionName);

    return {
      optionId: option.id,
      optionName: option.name,
      finalScore,
      normalizedScore: Number((finalScore / 10).toFixed(1)),
      rank: 1, // temporary, assigned below
      contributions,
      strongestCriteria: strongestCriteria.length ? strongestCriteria : [sortedByScore[0]?.criterionName || ''],
      weakestCriteria: weakestCriteria.length ? weakestCriteria : [sortedByScore[sortedByScore.length - 1]?.criterionName || ''],
    };
  });

  // 2. Sort by final score descending to determine rankings
  optionResults.sort((a, b) => b.finalScore - a.finalScore);
  optionResults.forEach((res, index) => {
    res.rank = index + 1;
    if (index === 0) {
      res.badge = 'Best Overall';
    } else if (index === 1) {
      res.badge = 'Runner Up';
    }
  });

  const winner = optionResults[0];

  // 3. Perform Sensitivity Analysis
  const sensitivity = calculateSensitivity(options, criteria, scores, winner.optionId);

  // 4. Calculate Stability Index (0 - 100%)
  const stabilityIndex = calculateStabilityIndex(sensitivity, optionResults);

  return {
    winnerId: winner.optionId,
    winnerName: winner.optionName,
    winnerScore: winner.finalScore,
    ranking: optionResults,
    sensitivity,
    stabilityIndex,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Sensitivity Analysis:
 * For each criterion, systematically test changing its raw weight from 1 to 10.
 * Check if the winner changes and record the flip threshold.
 */
function calculateSensitivity(
  options: DecisionOption[],
  criteria: DecisionCriterion[],
  scores: ScoreMatrix,
  currentWinnerId: string
): SensitivityItem[] {
  if (options.length < 2 || criteria.length === 0) {
    return [];
  }

  const sensitivityItems: SensitivityItem[] = [];

  criteria.forEach((targetCrit) => {
    let flips = false;
    let flipThresholdWeight: number | undefined;
    let flipOptionName: string | undefined;

    // Test extreme weights 1 through 10
    const testWeights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (const testW of testWeights) {
      if (testW === targetCrit.weight) continue;

      // Create modified criteria
      const modifiedCriteria = criteria.map((c) =>
        c.id === targetCrit.id ? { ...c, weight: testW } : c
      );

      const modWeights = calculateNormalizedWeights(modifiedCriteria);

      // Score options under modified weight
      let bestScore = -1;
      let newWinnerId = currentWinnerId;
      let newWinnerName = '';

      options.forEach((opt) => {
        let optScore = 0;
        modifiedCriteria.forEach((crit) => {
          const raw = scores[opt.id]?.[crit.id]?.score ?? 5;
          optScore += (modWeights[crit.id] || 0) * raw * 10;
        });
        if (optScore > bestScore) {
          bestScore = optScore;
          newWinnerId = opt.id;
          newWinnerName = opt.name;
        }
      });

      if (newWinnerId !== currentWinnerId && !flips) {
        flips = true;
        flipThresholdWeight = testW;
        flipOptionName = newWinnerName;
      }
    }

    let sensitivityLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    let explanation = `The ranking is stable against changes in ${targetCrit.name}.`;

    if (flips && flipThresholdWeight !== undefined) {
      const weightDiff = Math.abs(flipThresholdWeight - targetCrit.weight);
      if (weightDiff <= 2) {
        sensitivityLevel = 'HIGH';
        explanation = `Changing ${targetCrit.name} weight to ${flipThresholdWeight}/10 flips the leader to ${flipOptionName}.`;
      } else {
        sensitivityLevel = 'MODERATE';
        explanation = `A significant shift in ${targetCrit.name} (to ${flipThresholdWeight}/10) would favor ${flipOptionName}.`;
      }
    }

    sensitivityItems.push({
      criterionId: targetCrit.id,
      criterionName: targetCrit.name,
      currentWeight: targetCrit.weight,
      sensitivityLevel,
      flipThresholdWeight,
      flipOptionName,
      explanation,
    });
  });

  // Sort by highest sensitivity first
  const order = { HIGH: 0, MODERATE: 1, LOW: 2 };
  return sensitivityItems.sort((a, b) => order[a.sensitivityLevel] - order[b.sensitivityLevel]);
}

/**
 * Calculate Decision Stability Index (0 to 100%)
 * Higher percentage means the decision is robust to criteria adjustments.
 */
function calculateStabilityIndex(
  sensitivity: SensitivityItem[],
  ranking: OptionResult[]
): number {
  if (ranking.length < 2) return 95;

  const scoreGap = (ranking[0]?.finalScore || 0) - (ranking[1]?.finalScore || 0);

  // Baseline stability from score margin
  let baseline = Math.min(60 + scoreGap * 2.5, 95);

  // Deduct based on sensitivity points
  const highSensCount = sensitivity.filter((s) => s.sensitivityLevel === 'HIGH').length;
  const modSensCount = sensitivity.filter((s) => s.sensitivityLevel === 'MODERATE').length;

  const penalty = highSensCount * 12 + modSensCount * 6;
  const rawIndex = Math.max(30, Math.min(98, baseline - penalty));

  return Math.round(rawIndex);
}

/**
 * Calculate recalculation on the fly for "What-If" analysis
 */
export function recalculateWhatIf(
  options: DecisionOption[],
  criteria: DecisionCriterion[],
  scores: ScoreMatrix,
  newWeights: Record<string, number>
): {
  ranking: OptionResult[];
  winner: OptionResult;
} {
  const modifiedCriteria = criteria.map((c) => ({
    ...c,
    weight: newWeights[c.id] !== undefined ? newWeights[c.id] : c.weight,
  }));

  const res = calculateDecisionResults(options, modifiedCriteria, scores);
  if (!res) {
    throw new Error('Unable to recalculate decision with provided parameters.');
  }

  return {
    ranking: res.ranking,
    winner: res.ranking[0],
  };
}
