import { z } from 'zod';
import { DecisionCategory, RiskLevel, SourceType } from './decision';

// Action Types for AI Route Handler
export type AIAction =
  | 'understand_decision'
  | 'suggest_criteria_options'
  | 'analyze_option'
  | 'suggest_scores'
  | 'generate_decision_insights'
  | 'explain_what_if'
  | 'challenge_decision';

// Request Schemas
export const UnderstandDecisionRequestSchema = z.object({
  action: z.literal('understand_decision'),
  title: z.string().min(3).max(300),
  goal: z.string().max(1000).optional(),
  category: z.string().optional(),
});

export const SuggestCriteriaOptionsRequestSchema = z.object({
  action: z.literal('suggest_criteria_options'),
  title: z.string().min(3).max(300),
  goal: z.string().max(1000).optional(),
  category: z.string().optional(),
  existingOptions: z.array(z.string()).max(10).optional(),
  existingCriteria: z.array(z.string()).max(12).optional(),
});

export const AnalyzeOptionRequestSchema = z.object({
  action: z.literal('analyze_option'),
  decisionTitle: z.string().min(3).max(300),
  decisionGoal: z.string().max(1000).optional(),
  optionName: z.string().min(1).max(100),
  optionDescription: z.string().max(1000).optional(),
  price: z.number().optional(),
  criteriaList: z.array(z.string()).optional(),
});

export const SuggestScoresRequestSchema = z.object({
  action: z.literal('suggest_scores'),
  decisionTitle: z.string().min(3).max(300),
  decisionGoal: z.string().max(1000).optional(),
  options: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      price: z.number().optional(),
    })
  ),
  criteria: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      weight: z.number(),
    })
  ),
});

export const GenerateInsightsRequestSchema = z.object({
  action: z.literal('generate_decision_insights'),
  decisionTitle: z.string().min(3).max(300),
  decisionGoal: z.string().max(1000).optional(),
  winnerName: z.string(),
  rankingSummary: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      rank: numberOrString().optional(),
    })
  ),
  criteriaWeights: z.record(z.string(), z.number()),
  optionsWithScores: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().optional(),
      scores: z.record(z.string(), z.number()),
    })
  ),
});

function numberOrString() {
  return z.union([z.number(), z.string()]);
}

export const ExplainWhatIfRequestSchema = z.object({
  action: z.literal('explain_what_if'),
  decisionTitle: z.string(),
  previousWinner: z.string(),
  previousScores: z.record(z.string(), z.number()),
  newWinner: z.string(),
  newScores: z.record(z.string(), z.number()),
  changedCriteria: z.array(
    z.object({
      criterionName: z.string(),
      oldWeight: z.number(),
      newWeight: z.number(),
    })
  ),
});

export const ChallengeDecisionRequestSchema = z.object({
  action: z.literal('challenge_decision'),
  decisionTitle: z.string(),
  decisionGoal: z.string().optional(),
  currentLeader: z.string(),
  rankingSummary: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
    })
  ),
  criteriaWeights: z.record(z.string(), z.number()),
  assumptions: z.array(z.string()).optional(),
});

export const AIRequestSchema = z.discriminatedUnion('action', [
  UnderstandDecisionRequestSchema,
  SuggestCriteriaOptionsRequestSchema,
  AnalyzeOptionRequestSchema,
  SuggestScoresRequestSchema,
  GenerateInsightsRequestSchema,
  ExplainWhatIfRequestSchema,
  ChallengeDecisionRequestSchema,
]);

export type AIRequest = z.infer<typeof AIRequestSchema>;

// Response Payload Schemas
export interface UnderstandDecisionResponse {
  interpretedGoal: string;
  primaryConcerns: string[];
  suggestedCategory: DecisionCategory;
  suggestedCriteria: Array<{
    name: string;
    description: string;
    suggestedWeight: number;
    category?: string;
  }>;
  suggestedOptions?: Array<{
    name: string;
    description: string;
    estimatedPrice?: number;
  }>;
}

export interface SuggestCriteriaOptionsResponse {
  criteria: Array<{
    name: string;
    description: string;
    suggestedWeight: number;
  }>;
  options: Array<{
    name: string;
    description: string;
  }>;
}

export interface AnalyzeOptionResponse {
  summary: string;
  pros: string[];
  cons: string[];
  risks: string[];
  estimatedScores?: Record<string, { score: number; reasoning: string }>;
}

export interface SuggestScoresResponse {
  scores: Record<
    string, // optionId
    Record<
      string, // criterionId
      {
        score: number;
        reasoning: string;
        confidence: 'LOW' | 'MEDIUM' | 'HIGH';
      }
    >
  >;
}

export interface GenerateInsightsResponse {
  summary: string;
  whyWinnerWins: string;
  tradeoffs: Array<{
    optionName: string;
    strengths: string[];
    tradeoffs: string[];
    keySacrifice: string;
  }>;
  risks: Array<{
    level: RiskLevel;
    title: string;
    description: string;
    affectedOptionName?: string;
    potentialImpact: string;
  }>;
  assumptions: Array<{
    text: string;
    importance: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  missingInformation: Array<{
    topic: string;
    whyItMatters: string;
    suggestedAction: string;
  }>;
  alternativeWinners: {
    bestOverall?: { optionName: string; reason: string };
    bestValue?: { optionName: string; reason: string };
    bestPerformance?: { optionName: string; reason: string };
    lowestRisk?: { optionName: string; reason: string };
    bestBudget?: { optionName: string; reason: string };
  };
}

export interface ExplainWhatIfResponse {
  explanation: string;
  keyDrivers: string[];
  implication: string;
}

export interface ChallengeDecisionResponse {
  blindSpots: string[];
  counterArgument: string;
  weakAssumptions: string[];
  challengingQuestions: string[];
  alternativePerspective: string;
}
