export const SYSTEM_DECISION_PHILOSOPHY = `
You are the AI Intelligence Engine for "DecisionLens AI", an advanced, transparent decision-support system.
Tagline: "Turn difficult decisions into clear, explainable choices."

CORE PHILOSOPHY:
- You DO NOT make the final decision for the user.
- The deterministic calculation engine calculates the final scores and rankings.
- Your role is to provide clear, structured qualitative insights, identify risks, uncover hidden assumptions, highlight key trade-offs, identify missing information, and act as a constructive "devil's advocate" to challenge blind spots.
- You must always respond with STRICT, VALID JSON ONLY. Do not wrap JSON in markdown tags unless requested. Never output conversational preamble or postscript.
- All monetary amounts should assume Indian Rupee (INR / ₹) where applicable.
`;

export function getUnderstandDecisionPrompt(title: string, goal?: string, category?: string) {
  return `
Analyze the user's decision context:
Decision Title: "${title}"
Goal / Desired Outcome: "${goal || 'Not explicitly stated'}"
Category: "${category || 'General'}"

Return a JSON object with this exact structure:
{
  "interpretedGoal": "Concise restatement of what the user is solving for and key success criteria",
  "primaryConcerns": ["Key concern 1", "Key concern 2", "Key concern 3", "Key concern 4"],
  "suggestedCategory": "Career" | "Technology" | "Business" | "Finance" | "Education" | "Purchasing" | "Travel" | "Housing" | "Projects" | "Other",
  "suggestedCriteria": [
    {
      "name": "Criterion Name",
      "description": "Clear 1-line definition of why this matters",
      "suggestedWeight": 8,
      "category": "Quality | Cost | Practicality | Longevity"
    }
  ],
  "suggestedOptions": [
    {
      "name": "Realistic Option 1",
      "description": "Brief description",
      "estimatedPrice": 149000
    }
  ]
}
Provide 4 to 6 relevant criteria with weights between 5 and 10, and 2 to 3 realistic options.
`;
}

export function getAnalyzeOptionPrompt(
  decisionTitle: string,
  optionName: string,
  optionDescription?: string,
  price?: number,
  criteriaList?: string[]
) {
  return `
Decision Context: "${decisionTitle}"
Option to Analyze: "${optionName}"
Description: "${optionDescription || 'None provided'}"
Price (in ₹ INR): ${price !== undefined ? `₹${price}` : 'Not specified'}
Criteria being considered: ${criteriaList?.join(', ') || 'General factors'}

Provide an objective, deep analysis of this option.
Return a JSON object with this exact structure:
{
  "summary": "2-3 sentences evaluating how this option performs in the context of the user's goal",
  "pros": ["Distinct positive point 1", "Distinct positive point 2", "Distinct positive point 3"],
  "cons": ["Realistic drawback 1", "Realistic drawback 2"],
  "risks": ["Potential risk or caveat if this option is chosen"]
}
`;
}

export function getSuggestScoresPrompt(
  decisionTitle: string,
  decisionGoal: string | undefined,
  options: Array<{ id: string; name: string; description?: string; price?: number }>,
  criteria: Array<{ id: string; name: string; description?: string; weight: number }>
) {
  return `
Decision Context: "${decisionTitle}"
Goal: "${decisionGoal || 'Find the optimal choice'}"

Options:
${JSON.stringify(options, null, 2)}

Criteria:
${JSON.stringify(criteria, null, 2)}

Score EVERY Option for EVERY Criterion on an objective scale of 1 to 10 (where 10 is outstanding/ideal, 1 is extremely poor).
Return a JSON object where the top key is "scores", mapping optionId -> criterionId -> { score: number, reasoning: string, confidence: "LOW" | "MEDIUM" | "HIGH" }.

Example:
{
  "scores": {
    "opt-1": {
      "crit-1": { "score": 9, "reasoning": "High efficiency and durable build", "confidence": "HIGH" },
      "crit-2": { "score": 6, "reasoning": "Slightly premium cost", "confidence": "MEDIUM" }
    }
  }
}
Ensure all options and all criteria are covered completely.
`;
}

export function getGenerateInsightsPrompt(
  decisionTitle: string,
  decisionGoal: string | undefined,
  winnerName: string,
  rankingSummary: any[],
  criteriaWeights: Record<string, number>,
  optionsWithScores: any[]
) {
  return `
Decision Context: "${decisionTitle}"
Goal: "${decisionGoal || 'General decision'}"
Current Highest Ranked Option: "${winnerName}"

Rankings:
${JSON.stringify(rankingSummary, null, 2)}

Criteria & Weights:
${JSON.stringify(criteriaWeights, null, 2)}

Option Evaluation Matrix:
${JSON.stringify(optionsWithScores, null, 2)}

Provide comprehensive decision intelligence and explainability.
Return a JSON object with this exact structure:
{
  "summary": "Executive summary of the decision landscape",
  "whyWinnerWins": "Explain why '${winnerName}' ranks first based on the user's highest priority criteria. Use clear, non-robotic language.",
  "tradeoffs": [
    {
      "optionName": "Option Name",
      "strengths": ["Strength 1", "Strength 2"],
      "tradeoffs": ["Trade-off 1", "Trade-off 2"],
      "keySacrifice": "1 sentence describing what the user must give up if choosing this option"
    }
  ],
  "risks": [
    {
      "level": "HIGH" | "MEDIUM" | "LOW",
      "title": "Clear concise risk title",
      "description": "Why this is a risk",
      "affectedOptionName": "Option Name",
      "potentialImpact": "Impact if this risk materializes"
    }
  ],
  "assumptions": [
    {
      "text": "Implicit assumption made in this decision (e.g. usage lifespan, budget tolerance)",
      "importance": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "missingInformation": [
    {
      "topic": "Topic that was not specified",
      "whyItMatters": "How knowing this would alter the decision",
      "suggestedAction": "What the user should verify or check"
    }
  ],
  "alternativeWinners": {
    "bestOverall": { "optionName": "Option Name", "reason": "Reason" },
    "bestValue": { "optionName": "Option Name", "reason": "Reason" },
    "bestPerformance": { "optionName": "Option Name", "reason": "Reason" },
    "lowestRisk": { "optionName": "Option Name", "reason": "Reason" },
    "bestBudget": { "optionName": "Option Name", "reason": "Reason" }
  }
}
`;
}

export function getExplainWhatIfPrompt(
  decisionTitle: string,
  previousWinner: string,
  previousScores: Record<string, number>,
  newWinner: string,
  newScores: Record<string, number>,
  changedCriteria: Array<{ criterionName: string; oldWeight: number; newWeight: number }>
) {
  return `
Decision: "${decisionTitle}"
Previous Leader: "${previousWinner}" (Scores: ${JSON.stringify(previousScores)})
New Leader: "${newWinner}" (Scores: ${JSON.stringify(newScores)})

Criteria Changed:
${JSON.stringify(changedCriteria, null, 2)}

Explain clearly why this priority adjustment shifted the decision outcome.
Return JSON:
{
  "explanation": "2-3 sentences explaining the exact dynamic and mathematical shift in priorities that caused this ranking change.",
  "keyDrivers": ["Primary criterion driver 1", "Secondary driver 2"],
  "implication": "Strategic implication of this preference change for the user."
}
`;
}

export function getChallengeDecisionPrompt(
  decisionTitle: string,
  decisionGoal: string | undefined,
  currentLeader: string,
  rankingSummary: any[],
  criteriaWeights: Record<string, number>,
  assumptions?: string[]
) {
  return `
You are acting as a constructive Devil's Advocate for the user's decision.
Decision: "${decisionTitle}"
Goal: "${decisionGoal || 'Not specified'}"
Current Favored Option: "${currentLeader}"
Rankings: ${JSON.stringify(rankingSummary)}
Weights: ${JSON.stringify(criteriaWeights)}
Assumptions: ${JSON.stringify(assumptions || [])}

Actively challenge the user's current leaning to prevent confirmation bias.
Return JSON:
{
  "blindSpots": [
    "Specific blind spot 1 in this evaluation",
    "Specific blind spot 2 regarding future maintenance, constraints, or hidden costs"
  ],
  "counterArgument": "A compelling, rational case for why the runner-up or an alternative might actually be superior in the long run.",
  "weakAssumptions": [
    "Assumption that might be overly optimistic or untested"
  ],
  "challengingQuestions": [
    "Hard question 1 the user should ask themselves before committing",
    "Hard question 2 about worst-case scenarios",
    "Hard question 3 about long-term lock-in"
  ],
  "alternativePerspective": "An unconventional lens through which to view this decision."
}
`;
}
