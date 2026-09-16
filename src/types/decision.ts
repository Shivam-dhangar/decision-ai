export type SourceType =
  | 'USER_PROVIDED'
  | 'AI_SUGGESTED'
  | 'USER_ASSUMPTION'
  | 'USER_EDITED'
  | 'CALCULATED';

export type DecisionCategory =
  | 'Career'
  | 'Technology'
  | 'Business'
  | 'Finance'
  | 'Education'
  | 'Purchasing'
  | 'Travel'
  | 'Housing'
  | 'Projects'
  | 'Other';

export type DecisionStatus = 'draft' | 'in_progress' | 'completed';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DecisionOption {
  id: string;
  name: string;
  description?: string;
  price?: number; // In INR (₹)
  notes?: string;
  source: SourceType;
  strengths?: string[];
  weaknesses?: string[];
  aiAnalysis?: {
    summary: string;
    pros: string[];
    cons: string[];
    risks: string[];
    source: SourceType;
  };
}

export interface DecisionCriterion {
  id: string;
  name: string;
  description?: string;
  weight: number; // Raw slider value 1 to 10
  source: SourceType;
  category?: string;
}

export interface OptionScore {
  score: number; // 1 to 10 scale
  reasoning?: string;
  source: SourceType;
  confidence?: 'LOW' | 'MEDIUM' | 'HIGH';
  isEdited?: boolean;
}

// Map: optionId -> criterionId -> OptionScore
export type ScoreMatrix = Record<string, Record<string, OptionScore>>;

export interface CriterionContribution {
  criterionId: string;
  criterionName: string;
  rawScore: number; // 1-10
  rawWeight: number; // 1-10
  normalizedWeight: number; // 0-1
  contributionPoints: number; // e.g. 27.0
  percentageOfFinalScore: number;
}

export interface OptionResult {
  optionId: string;
  optionName: string;
  finalScore: number; // 0 to 100
  normalizedScore: number; // 0 to 10
  rank: number;
  badge?: 'Best Overall' | 'Best Value' | 'Best Performance' | 'Lowest Risk' | 'Best Budget' | 'Runner Up' | 'Strong Fit' | 'Moderate Fit' | 'Consider With Caution';
  contributions: CriterionContribution[];
  strongestCriteria: string[];
  weakestCriteria: string[];
}

export interface SensitivityItem {
  criterionId: string;
  criterionName: string;
  currentWeight: number;
  sensitivityLevel: 'LOW' | 'MODERATE' | 'HIGH';
  flipThresholdWeight?: number;
  flipOptionName?: string;
  explanation: string;
}

export interface DecisionRisk {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  affectedOptionId?: string;
  affectedOptionName?: string;
  potentialImpact: string;
  source: SourceType;
}

export interface DecisionAssumption {
  id: string;
  text: string;
  confirmed: boolean;
  source: SourceType;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MissingInformation {
  id: string;
  topic: string;
  whyItMatters: string;
  suggestedAction: string;
  resolved: boolean;
}

export interface TradeOffItem {
  optionId: string;
  optionName: string;
  strengths: string[];
  tradeoffs: string[];
  keySacrifice: string;
}

export interface DevilAdvocateChallenge {
  blindSpots: string[];
  counterArgument: string;
  weakAssumptions: string[];
  challengingQuestions: string[];
  alternativePerspective: string;
}

export interface DecisionAnalysis {
  summary: string;
  whyWinnerWins: string;
  tradeoffs: TradeOffItem[];
  risks: DecisionRisk[];
  assumptions: DecisionAssumption[];
  missingInformation: MissingInformation[];
  challenge?: DevilAdvocateChallenge;
  stabilityIndex: number; // 0 to 100%
  stabilityExplanation: string;
  alternativeWinners: {
    bestOverall?: { optionId: string; optionName: string; reason: string };
    bestValue?: { optionId: string; optionName: string; reason: string };
    bestPerformance?: { optionId: string; optionName: string; reason: string };
    lowestRisk?: { optionId: string; optionName: string; reason: string };
    bestBudget?: { optionId: string; optionName: string; reason: string };
  };
  generatedAt?: string;
}

export interface FinalDecisionRecord {
  selectedOptionId: string;
  selectedOptionName: string;
  reason: string;
  decidedAt: string;
  notes?: string;
}

export interface Decision {
  id: string;
  title: string;
  goal: string;
  category: DecisionCategory;
  createdAt: string;
  updatedAt: string;
  status: DecisionStatus;

  options: DecisionOption[];
  criteria: DecisionCriterion[];
  scores: ScoreMatrix;

  // Calculated Results (from deterministic decision engine)
  results?: {
    winnerId: string;
    winnerName: string;
    winnerScore: number;
    ranking: OptionResult[];
    sensitivity: SensitivityItem[];
    stabilityIndex: number; // 0-100%
    calculatedAt: string;
  };

  // AI Insights and Qualitative Reasoning
  analysis?: DecisionAnalysis;

  // Final user commitment
  finalDecision?: FinalDecisionRecord;

  // Metadata
  isDemo?: boolean;
  version?: number;
}
