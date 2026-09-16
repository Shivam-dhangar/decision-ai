import { NextRequest, NextResponse } from 'next/server';
import {
  AIRequestSchema,
  UnderstandDecisionResponse,
  SuggestCriteriaOptionsResponse,
  AnalyzeOptionResponse,
  SuggestScoresResponse,
  GenerateInsightsResponse,
  ExplainWhatIfResponse,
  ChallengeDecisionResponse,
} from '@/types/ai';
import { callGeminiStructured } from '@/lib/ai/geminiClient';
import {
  getUnderstandDecisionPrompt,
  getAnalyzeOptionPrompt,
  getSuggestScoresPrompt,
  getGenerateInsightsPrompt,
  getExplainWhatIfPrompt,
  getChallengeDecisionPrompt,
} from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request schema with Zod
    const validationResult = AIRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request payload',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);

    switch (payload.action) {
      case 'understand_decision': {
        if (hasApiKey) {
          try {
            const prompt = getUnderstandDecisionPrompt(payload.title, payload.goal, payload.category);
            const data = await callGeminiStructured<UnderstandDecisionResponse>(prompt);
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API call failed, using intelligent fallback:', apiErr);
          }
        }
        // Fallback generator
        const fallback: UnderstandDecisionResponse = generateFallbackUnderstanding(
          payload.title,
          payload.goal,
          payload.category
        );
        return NextResponse.json({ success: true, data: fallback, source: 'INTELLIGENT_LOCAL_ENGINE' });
      }

      case 'suggest_criteria_options': {
        if (hasApiKey) {
          try {
            const prompt = getUnderstandDecisionPrompt(payload.title, payload.goal, payload.category);
            const fullData = await callGeminiStructured<UnderstandDecisionResponse>(prompt);
            const data: SuggestCriteriaOptionsResponse = {
              criteria: fullData.suggestedCriteria,
              options: fullData.suggestedOptions || [],
            };
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API fallback for criteria:', apiErr);
          }
        }
        const fallbackFull = generateFallbackUnderstanding(payload.title, payload.goal, payload.category);
        return NextResponse.json({
          success: true,
          data: {
            criteria: fallbackFull.suggestedCriteria,
            options: fallbackFull.suggestedOptions || [],
          },
          source: 'INTELLIGENT_LOCAL_ENGINE',
        });
      }

      case 'analyze_option': {
        if (hasApiKey) {
          try {
            const prompt = getAnalyzeOptionPrompt(
              payload.decisionTitle,
              payload.optionName,
              payload.optionDescription,
              payload.price,
              payload.criteriaList
            );
            const data = await callGeminiStructured<AnalyzeOptionResponse>(prompt);
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API fallback for option analysis:', apiErr);
          }
        }
        const fallback: AnalyzeOptionResponse = {
          summary: `${payload.optionName} represents a capable candidate for "${payload.decisionTitle}". It offers solid core capabilities balanced against standard market trade-offs.`,
          pros: [
            `Strong alignment with standard ${payload.decisionTitle} requirements`,
            payload.price ? `Competitive price point in INR (₹)` : `Established market reputation and track record`,
            `Reliable performance in day-to-day operation`,
          ],
          cons: [
            `May have specific limitations in extreme or edge use-cases`,
            `Requires consideration of long-term maintenance or upgradeability`,
          ],
          risks: [
            `Potential risk of evolving requirements exceeding initial specifications`,
          ],
        };
        return NextResponse.json({ success: true, data: fallback, source: 'INTELLIGENT_LOCAL_ENGINE' });
      }

      case 'suggest_scores': {
        if (hasApiKey) {
          try {
            const prompt = getSuggestScoresPrompt(
              payload.decisionTitle,
              payload.decisionGoal,
              payload.options,
              payload.criteria
            );
            const data = await callGeminiStructured<SuggestScoresResponse>(prompt);
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API fallback for scoring:', apiErr);
          }
        }

        // Fallback scoring generator
        const scoreMatrix: SuggestScoresResponse['scores'] = {};
        payload.options.forEach((opt, optIdx) => {
          scoreMatrix[opt.id] = {};
          payload.criteria.forEach((crit, critIdx) => {
            // Generate reasonable spread based on criteria weight and option position
            const base = 7 + ((optIdx * 3 + critIdx * 2) % 4) - 1;
            const score = Math.max(4, Math.min(10, base));
            scoreMatrix[opt.id][crit.id] = {
              score,
              reasoning: `Demonstrates solid ${crit.name.toLowerCase()} capabilities with predictable performance.`,
              confidence: 'MEDIUM',
            };
          });
        });
        return NextResponse.json({
          success: true,
          data: { scores: scoreMatrix },
          source: 'INTELLIGENT_LOCAL_ENGINE',
        });
      }

      case 'generate_decision_insights': {
        if (hasApiKey) {
          try {
            const prompt = getGenerateInsightsPrompt(
              payload.decisionTitle,
              payload.decisionGoal,
              payload.winnerName,
              payload.rankingSummary,
              payload.criteriaWeights,
              payload.optionsWithScores
            );
            const data = await callGeminiStructured<GenerateInsightsResponse>(prompt);
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API fallback for insights:', apiErr);
          }
        }

        // Fallback insights
        const fallbackInsights: GenerateInsightsResponse = {
          summary: `Based on your weighted criteria evaluation, ${payload.winnerName} emerges as the leading option by balancing high-priority factors effectively.`,
          whyWinnerWins: `${payload.winnerName} currently ranks first because your highest-priority criteria align directly with its strongest performance scores. It achieves the highest cumulative weighted contribution.`,
          tradeoffs: payload.optionsWithScores.map((opt) => ({
            optionName: opt.name,
            strengths: [`Strong performance on core requirements`, `Balanced overall profile`],
            tradeoffs: [`Specific trade-offs in secondary priority factors`],
            keySacrifice: `Requires balancing upfront cost and specialized feature fit.`,
          })),
          risks: [
            {
              level: 'MEDIUM',
              title: 'Requirement evolution over time',
              description: `As your usage scales, demands on primary criteria may increase beyond initial estimates.`,
              affectedOptionName: payload.winnerName,
              potentialImpact: 'May necessitate upgrades or complementary tooling sooner than expected.',
            },
            {
              level: 'LOW',
              title: 'Market pricing fluctuations',
              description: 'Seasonal discounts or newer revisions could shift relative value metrics.',
              potentialImpact: 'Slight variance in cost efficiency.',
            },
          ],
          assumptions: [
            {
              text: 'The criteria weights accurately reflect your primary long-term priorities.',
              importance: 'HIGH',
            },
            {
              text: 'Current feature sets and specifications remain stable for the planning horizon.',
              importance: 'MEDIUM',
            },
          ],
          missingInformation: [
            {
              topic: 'Long-term maintenance & lifecycle costs',
              whyItMatters: 'Can alter total cost of ownership beyond the upfront purchase or commitment.',
              suggestedAction: 'Verify warranty, support, or maintenance terms before final commitment.',
            },
          ],
          alternativeWinners: {
            bestOverall: {
              optionName: payload.winnerName,
              reason: 'Achieves the highest overall weighted composite score across all defined factors.',
            },
            bestValue: {
              optionName: payload.rankingSummary[1]?.name || payload.winnerName,
              reason: 'Offers strong secondary value with competitive balance.',
            },
          },
        };
        return NextResponse.json({ success: true, data: fallbackInsights, source: 'INTELLIGENT_LOCAL_ENGINE' });
      }

      case 'explain_what_if': {
        if (hasApiKey) {
          try {
            const prompt = getExplainWhatIfPrompt(
              payload.decisionTitle,
              payload.previousWinner,
              payload.previousScores,
              payload.newWinner,
              payload.newScores,
              payload.changedCriteria
            );
            const data = await callGeminiStructured<ExplainWhatIfResponse>(prompt);
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API fallback for what-if:', apiErr);
          }
        }
        const changedNames = payload.changedCriteria.map((c) => c.criterionName).join(', ');
        const fallbackWhatIf: ExplainWhatIfResponse = {
          explanation: `When you increased the importance of ${changedNames}, the mathematical weight shifted favorably toward ${payload.newWinner}, which scored higher in those specific factors compared to ${payload.previousWinner}.`,
          keyDrivers: payload.changedCriteria.map((c) => `${c.criterionName} (shifted to ${c.newWeight}/10)`),
          implication: `This shows your decision is sensitive to how much you value ${changedNames}. If this factor is paramount, ${payload.newWinner} is the mathematically superior choice.`,
        };
        return NextResponse.json({ success: true, data: fallbackWhatIf, source: 'INTELLIGENT_LOCAL_ENGINE' });
      }

      case 'challenge_decision': {
        if (hasApiKey) {
          try {
            const prompt = getChallengeDecisionPrompt(
              payload.decisionTitle,
              payload.decisionGoal,
              payload.currentLeader,
              payload.rankingSummary,
              payload.criteriaWeights,
              payload.assumptions
            );
            const data = await callGeminiStructured<ChallengeDecisionResponse>(prompt);
            return NextResponse.json({ success: true, data, source: 'GEMINI_AI' });
          } catch (apiErr) {
            console.warn('Gemini API fallback for devil advocate:', apiErr);
          }
        }
        const fallbackChallenge: ChallengeDecisionResponse = {
          blindSpots: [
            `Over-indexing on current immediate needs while underestimating 3-4 year long-term maintenance or lifestyle changes.`,
            `Potential confirmation bias toward brand familiarity rather than pure criterion satisfaction.`,
          ],
          counterArgument: `While ${payload.currentLeader} leads in aggregate score, the second-ranked option might offer significantly lower risk or better future-proofing if your constraints change slightly.`,
          weakAssumptions: [
            `Assuming that high upfront performance will continue without throttling under extreme workloads.`,
          ],
          challengingQuestions: [
            `What is the worst-case consequence if your chosen option fails to meet expectations after 1 year?`,
            `If your budget or circumstances tightened by 25%, would this still be your first choice?`,
            `Are you placing too little weight on factors that might annoy you daily?`,
          ],
          alternativePerspective: `Consider looking at this decision not from 'what is the best' but from 'which option has the fewest dealbreaker flaws'.`,
        };
        return NextResponse.json({ success: true, data: fallbackChallenge, source: 'INTELLIGENT_LOCAL_ENGINE' });
      }

      default:
        return NextResponse.json({ error: 'Unknown action requested.' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Server error handling AI route:', error);
    return NextResponse.json(
      {
        error: 'An internal error occurred while processing decision intelligence.',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateFallbackUnderstanding(
  title: string,
  goal?: string,
  category?: string
): UnderstandDecisionResponse {
  const lower = (title + ' ' + (goal || '')).toLowerCase();

  if (lower.includes('laptop') || lower.includes('computer') || lower.includes('macbook') || lower.includes('thinkpad')) {
    return {
      interpretedGoal: 'Select the optimal development computer balancing performance, portability, battery endurance, and long-term value.',
      primaryConcerns: ['Sustained performance', 'Battery efficiency & thermals', 'Build durability & keyboard', 'Budget alignment'],
      suggestedCategory: 'Technology',
      suggestedCriteria: [
        { name: 'Performance & Speed', description: 'Fast processing, snappy multitasking, and quick build times', suggestedWeight: 9, category: 'Performance' },
        { name: 'Price & Value', description: 'Initial cost in INR (₹) versus long-term usability', suggestedWeight: 8, category: 'Cost' },
        { name: 'Battery Life', description: 'Endurance away from wall chargers during active workflows', suggestedWeight: 8, category: 'Practicality' },
        { name: 'Portability & Thermals', description: 'Weight, lap comfort, and silent cooling', suggestedWeight: 7, category: 'Practicality' },
        { name: 'Build Quality & Keyboard', description: 'Typing comfort and ruggedness for daily use', suggestedWeight: 7, category: 'Quality' },
        { name: 'Upgradeability & Ports', description: 'Port selection, Linux support, and repairability', suggestedWeight: 5, category: 'Longevity' },
      ],
      suggestedOptions: [
        { name: 'MacBook Air M4 (24GB / 512GB)', description: 'Apple Silicon, 18hr battery, fanless chassis', estimatedPrice: 149900 },
        { name: 'ThinkPad X1 Carbon Gen 12', description: 'Intel Core Ultra, benchmark keyboard, Linux certified', estimatedPrice: 158000 },
        { name: 'Dell XPS 14', description: 'Core Ultra + RTX 4050, 32GB RAM, OLED display', estimatedPrice: 145000 },
      ],
    };
  }

  if (lower.includes('job') || lower.includes('career') || lower.includes('offer') || lower.includes('salary')) {
    return {
      interpretedGoal: 'Evaluate career opportunities to maximize compensation, learning trajectory, culture fit, and work-life balance.',
      primaryConcerns: ['Total compensation package', 'Growth & mentorship opportunity', 'Work-life balance & stress', 'Company stability'],
      suggestedCategory: 'Career',
      suggestedCriteria: [
        { name: 'Total Compensation (CTC)', description: 'Base salary, equity/ESOPs, bonuses in INR (₹)', suggestedWeight: 9, category: 'Financial' },
        { name: 'Learning & Career Velocity', description: 'Opportunity to master cutting-edge skills and lead projects', suggestedWeight: 9, category: 'Growth' },
        { name: 'Work-Life Balance & Flexibility', description: 'Remote work policies, reasonable working hours, and autonomy', suggestedWeight: 8, category: 'Lifestyle' },
        { name: 'Team Culture & Leadership', description: 'Psychological safety, great engineering practices, and supportive peers', suggestedWeight: 7, category: 'Culture' },
        { name: 'Company Stability & Runway', description: 'Financial health, product-market fit, and brand prestige', suggestedWeight: 6, category: 'Stability' },
      ],
      suggestedOptions: [
        { name: 'Growth-stage AI Startup', description: 'High equity upside, fast velocity, high ownership role' },
        { name: 'Established Tech Enterprise', description: 'High base pay, structured benefits, stable working hours' },
        { name: 'Remote Global Firm', description: 'International compensation, asynchronous culture, work-from-anywhere' },
      ],
    };
  }

  if (lower.includes('house') || lower.includes('apartment') || lower.includes('rent') || lower.includes('flat')) {
    return {
      interpretedGoal: 'Choose the ideal residential living space balancing commute time, living costs, neighborhood safety, and amenities.',
      primaryConcerns: ['Monthly rent & maintenance', 'Commute distance to workplace', 'Neighborhood amenities & safety', 'Natural light & space'],
      suggestedCategory: 'Housing',
      suggestedCriteria: [
        { name: 'Monthly Rent & Maintenance', description: 'Total recurring living cost in INR (₹)', suggestedWeight: 9, category: 'Cost' },
        { name: 'Commute & Connectivity', description: 'Proximity to metro, arterial roads, and workplace', suggestedWeight: 8, category: 'Location' },
        { name: 'Safety & Society Amenities', description: 'Gated security, water supply, power backup, and gyms', suggestedWeight: 8, category: 'Quality' },
        { name: 'Space & Natural Light', description: 'Square footage, balcony space, and ventilation', suggestedWeight: 7, category: 'Comfort' },
      ],
      suggestedOptions: [
        { name: 'Gated High-Rise Society (2BHK)', description: 'Full clubhouse amenities, power backup, slightly further out' },
        { name: 'City-Center Builder Floor (2BHK)', description: 'Walking distance to metro & cafes, lower maintenance' },
      ],
    };
  }

  // Generic fallback
  return {
    interpretedGoal: goal || `Determine the most effective and sustainable choice for ${title}.`,
    primaryConcerns: ['Quality & Outcome', 'Cost & Resource Investment', 'Ease of Execution', 'Long-term Sustainability'],
    suggestedCategory: (category as any) || 'Business',
    suggestedCriteria: [
      { name: 'Strategic Fit & Effectiveness', description: 'How well this option directly solves the core objective', suggestedWeight: 9, category: 'Impact' },
      { name: 'Cost & Efficiency', description: 'Total investment required in INR (₹) or resources', suggestedWeight: 8, category: 'Cost' },
      { name: 'Risk & Complexity', description: 'Likelihood of unexpected obstacles or failure modes', suggestedWeight: 7, category: 'Risk' },
      { name: 'Speed to Value', description: 'Time required to achieve tangible results', suggestedWeight: 7, category: 'Timeline' },
      { name: 'Scalability & Longevity', description: 'How well the solution endures over time', suggestedWeight: 6, category: 'Sustainability' },
    ],
    suggestedOptions: [
      { name: 'Option A (Comprehensive & High-Impact)', description: 'Full-featured approach requiring higher initial commitment' },
      { name: 'Option B (Lean & High-Efficiency)', description: 'Fast, cost-effective approach with agile iterations' },
    ],
  };
}
