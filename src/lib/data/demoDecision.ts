import { Decision } from '@/types/decision';
import { calculateDecisionResults } from '@/lib/engine/decisionEngine';

const initialOptions = [
  {
    id: 'opt-macbook-air-m4',
    name: 'MacBook Air M4 (24GB / 512GB)',
    description: 'Apple Silicon M4 chip with 10-core CPU, 10-core GPU, unified memory, fanless silent chassis, and exceptional battery endurance.',
    price: 149900, // ₹1,49,900
    source: 'USER_PROVIDED' as const,
    strengths: [
      'Unrivaled battery life (18+ hours under real dev workloads)',
      'Silent fanless thermals and instant wake',
      'Class-leading trackpad and color-accurate Liquid Retina display',
      'Solid UNIX development environment out of the box',
    ],
    weaknesses: [
      'Non-upgradeable unified RAM and soldered SSD storage',
      'Dual external display support requires lid to be closed',
      'Thermal throttling under prolonged multi-hour CPU/GPU compiles',
    ],
  },
  {
    id: 'opt-thinkpad-x1',
    name: 'ThinkPad X1 Carbon Gen 12 (32GB / 1TB)',
    description: 'Intel Core Ultra 7 155H, 32GB LPDDR5x, 1TB NVMe Gen4, legendary spill-resistant keyboard, military-grade durability, and native Linux support.',
    price: 158000, // ₹1,58,000
    source: 'USER_PROVIDED' as const,
    strengths: [
      'Best-in-class tactile keyboard for extensive coding sessions',
      'Native certified Linux (Ubuntu/Fedora) compatibility and modular ports',
      'Sub-1.1kg featherlight carbon fiber chassis',
      'Enterprise warranty and rapid service availability in India',
    ],
    weaknesses: [
      'Battery life drops significantly under heavy Docker containers (6-7 hrs)',
      'Slightly exceeds ideal ₹1,50,000 budget cap',
      'Integrated Intel Arc graphics is modest for heavy local AI model quantization',
    ],
  },
  {
    id: 'opt-dell-xps-14',
    name: 'Dell XPS 14 (32GB / 1TB / RTX 4050)',
    description: 'Intel Core Ultra 7 with dedicated NVIDIA GeForce RTX 4050 GPU (30W), 3.2K OLED Touch screen option, machined aluminum build.',
    price: 145000, // ₹1,45,000
    source: 'USER_PROVIDED' as const,
    strengths: [
      'Dedicated NVIDIA RTX GPU with CUDA support for local LLM acceleration',
      'Competitive price under ₹1,45,000 with 32GB RAM configuration',
      'Gorgeous edge-to-edge high resolution OLED display',
    ],
    weaknesses: [
      'Capacitive function row and borderless glass haptic trackpad require adjustment',
      'Heavier at 1.7kg and runs warmer under full load',
      'Only 3 USB-C Thunderbolt ports with dongles required for legacy USB-A/HDMI',
    ],
  },
];

const initialCriteria = [
  {
    id: 'crit-perf',
    name: 'Performance & Multi-tasking',
    description: 'Fast compilation, Docker container responsiveness, and snappy IDE experience with 20+ tabs and background services.',
    weight: 9,
    source: 'USER_PROVIDED' as const,
  },
  {
    id: 'crit-price',
    name: 'Price & Value for Money',
    description: 'Staying within the ₹1,50,000 target budget while maximizing long-term specification longevity.',
    weight: 8,
    source: 'USER_PROVIDED' as const,
  },
  {
    id: 'crit-battery',
    name: 'Battery Life & Efficiency',
    description: 'Ability to work from cafes, co-working spaces, and flights without constant charger anxiety.',
    weight: 8,
    source: 'USER_PROVIDED' as const,
  },
  {
    id: 'crit-portability',
    name: 'Portability & Thermals',
    description: 'Lightweight carry profile, lap-friendly temperatures, and quiet fan operation.',
    weight: 7,
    source: 'USER_PROVIDED' as const,
  },
  {
    id: 'crit-build',
    name: 'Build Quality & Keyboard',
    description: 'Tactile typing feedback, rugged chassis durability, and longevity for 4+ years of daily typing.',
    weight: 7,
    source: 'USER_PROVIDED' as const,
  },
  {
    id: 'crit-upgrade',
    name: 'Upgradeability & Tooling Flexibility',
    description: 'Linux kernel support, port selection, external monitor connectivity, and serviceability.',
    weight: 5,
    source: 'USER_PROVIDED' as const,
  },
];

const initialScores = {
  'opt-macbook-air-m4': {
    'crit-perf': { score: 9, reasoning: 'M4 chip provides single-core and multi-core efficiency, instant indexing in VS Code and swift compilation.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-price': { score: 7, reasoning: 'At ₹1,49,900 it sits right under the ₹1,50,000 cap for a 24GB RAM configuration.', source: 'USER_PROVIDED' as const },
    'crit-battery': { score: 10, reasoning: 'Industry-leading 16-18 hours real world mixed development battery life.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-portability': { score: 10, reasoning: 'Completely fanless, 1.24kg slim unibody that stays cool on the lap.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-build': { score: 9, reasoning: 'Precision aluminum enclosure and class-leading Force Touch trackpad.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-upgrade': { score: 3, reasoning: 'Zero internal upgradeability; 2 Thunderbolt ports require dongles for multi-display setups.', source: 'USER_EDITED' as const },
  },
  'opt-thinkpad-x1': {
    'crit-perf': { score: 8, reasoning: 'Intel Core Ultra 7 handles multi-threaded Docker workflows smoothly, but draws more power under high load.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-price': { score: 6, reasoning: 'Priced at ₹1,58,000, slightly exceeds target budget but includes 32GB RAM and 1TB storage.', source: 'USER_PROVIDED' as const },
    'crit-battery': { score: 7, reasoning: 'Delivers 7-8 hours mixed development battery runtime.', source: 'AI_SUGGESTED' as const, confidence: 'MEDIUM' as const },
    'crit-portability': { score: 9, reasoning: 'Remarkably light at 1.09kg, ideal for frequent travel.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-build': { score: 10, reasoning: 'Industry benchmark keyboard with 1.5mm key travel, MIL-STD 810H durability rating.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-upgrade': { score: 7, reasoning: 'Excellent native Ubuntu/Fedora driver support, replaceable M.2 SSD, and full HDMI + USB-A ports.', source: 'USER_PROVIDED' as const },
  },
  'opt-dell-xps-14': {
    'crit-perf': { score: 8, reasoning: 'Strong CPU plus dedicated RTX 4050 GPU accelerates PyTorch and local CUDA models.', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-price': { score: 8, reasoning: 'Best raw specs for money at ₹1,45,000 including 32GB RAM and dedicated graphics.', source: 'USER_PROVIDED' as const },
    'crit-battery': { score: 6, reasoning: 'OLED screen and discrete GPU drain battery faster (5-6 hours heavy dev use).', source: 'AI_SUGGESTED' as const, confidence: 'HIGH' as const },
    'crit-portability': { score: 7, reasoning: 'Heavier at 1.68kg and fans ramp audibly during intensive builds.', source: 'AI_SUGGESTED' as const, confidence: 'MEDIUM' as const },
    'crit-build': { score: 8, reasoning: 'Sturdy CNC machined aluminum with Gorilla Glass 3, though touch function row divides opinions.', source: 'AI_SUGGESTED' as const, confidence: 'MEDIUM' as const },
    'crit-upgrade': { score: 6, reasoning: 'Replaceable M.2 SSD but soldered memory and strictly USB-C port array.', source: 'USER_PROVIDED' as const },
  },
};

const calculatedResults = calculateDecisionResults(initialOptions, initialCriteria, initialScores);

export const DEMO_DECISION: Decision = {
  id: 'demo-dev-laptop-choice',
  title: 'Which laptop should I buy for full-stack development?',
  goal: 'I want a reliable laptop under ₹1,50,000 that can handle Docker, local LLMs, multiple IDEs, and heavy development workflows for at least 4 years.',
  category: 'Technology',
  createdAt: '2026-08-25T10:30:00.000Z',
  updatedAt: '2026-08-27T12:00:00.000Z',
  status: 'completed',
  options: initialOptions,
  criteria: initialCriteria,
  scores: initialScores,
  results: calculatedResults || undefined,
  analysis: {
    summary: 'Based on your prioritized criteria, MacBook Air M4 leads primarily due to exceptional battery endurance, thermal efficiency, and top-tier single-core performance. However, ThinkPad X1 Carbon remains a formidable challenger if keyboard ergonomics and Linux compatibility are prioritized.',
    whyWinnerWins: 'MacBook Air M4 currently ranks first because your highest-priority criteria are Performance (9/10), Battery Life (8/10), and Portability (7/10). It achieves near-perfect scores across efficiency, noise-free thermals, and display quality, yielding the highest weighted contribution.',
    tradeoffs: [
      {
        optionId: 'opt-macbook-air-m4',
        optionName: 'MacBook Air M4 (24GB / 512GB)',
        strengths: ['18h+ battery life', 'Completely silent fanless design', 'Snappy macOS Unix dev environment'],
        tradeoffs: ['Zero post-purchase RAM/SSD upgradeability', 'Limited native port selection'],
        keySacrifice: 'Sacrifices hardware repairability/upgradeability for unmatched battery efficiency.',
      },
      {
        optionId: 'opt-thinkpad-x1',
        optionName: 'ThinkPad X1 Carbon Gen 12',
        strengths: ['Benchmark typing experience', 'Exceptional 1.09kg weight', 'Native certified Linux drivers'],
        tradeoffs: ['Noticeably shorter battery life under Docker load', 'Slightly above ₹1.5L budget'],
        keySacrifice: 'Sacrifices raw battery longevity for keyboard tactile feel and Linux flexibility.',
      },
      {
        optionId: 'opt-dell-xps-14',
        optionName: 'Dell XPS 14',
        strengths: ['Dedicated RTX 4050 GPU for AI/CUDA', 'Strongest specs-to-price ratio at ₹1,45,000'],
        tradeoffs: ['Heavier carry weight (1.68kg)', 'Higher thermal fan noise'],
        keySacrifice: 'Sacrifices portability and battery for dedicated graphics power.',
      },
    ],
    risks: [
      {
        id: 'risk-1',
        level: 'HIGH',
        title: 'Non-upgradeable soldered unified RAM',
        description: 'Choosing 24GB unified memory on MacBook Air cannot be upgraded later. If your Docker container usage scales heavily over 4 years, memory swap may degrade SSD life.',
        affectedOptionId: 'opt-macbook-air-m4',
        affectedOptionName: 'MacBook Air M4',
        potentialImpact: 'High risk of memory bottlenecks if microservice architecture expands beyond 20 concurrent containers.',
        source: 'AI_SUGGESTED',
      },
      {
        id: 'risk-2',
        level: 'MEDIUM',
        title: 'Budget overrun of ₹8,000',
        description: 'The ThinkPad X1 Carbon Gen 12 configuration is listed at ₹1,58,000, which is 5.3% higher than your strict ₹1,50,000 ceiling.',
        affectedOptionId: 'opt-thinkpad-x1',
        affectedOptionName: 'ThinkPad X1 Carbon Gen 12',
        potentialImpact: 'Requires minor budget flexibility or waiting for festive sales discounts.',
        source: 'CALCULATED',
      },
      {
        id: 'risk-3',
        level: 'LOW',
        title: 'Battery drain on intensive compiling',
        description: 'Intel Core Ultra 7 on ThinkPad and XPS drains battery substantially faster under continuous webpack or gradle compilation.',
        affectedOptionId: 'opt-dell-xps-14',
        affectedOptionName: 'Dell XPS 14',
        potentialImpact: 'Requires carrying 65W/100W USB-C GaN charger for work sessions longer than 5 hours.',
        source: 'AI_SUGGESTED',
      },
    ],
    assumptions: [
      {
        id: 'asm-1',
        text: 'I expect to use this laptop as my primary development machine for at least 4 years.',
        confirmed: true,
        source: 'USER_PROVIDED',
        importance: 'HIGH',
      },
      {
        id: 'asm-2',
        text: 'I do not require dual 4K external monitors driven simultaneously with laptop lid open.',
        confirmed: true,
        source: 'AI_SUGGESTED',
        importance: 'MEDIUM',
      },
      {
        id: 'asm-3',
        text: '24GB to 32GB RAM will be sufficient for running local small language models (e.g. Llama 3 8B Q4) alongside IDE.',
        confirmed: false,
        source: 'USER_ASSUMPTION',
        importance: 'HIGH',
      },
    ],
    missingInformation: [
      {
        id: 'miss-1',
        topic: 'External Monitor Setup & Workspace Docking',
        whyItMatters: 'MacBook Air M4 supports up to two external displays only when the laptop display lid is closed. If triple display is required, a DisplayLink dock or Pro chip is required.',
        suggestedAction: 'Clarify your home/office desk monitor configuration.',
        resolved: false,
      },
      {
        id: 'miss-2',
        topic: 'Corporate IT & VPN Security Policies',
        whyItMatters: 'Certain corporate enterprise VPN clients and security agents operate more reliably on Windows/macOS than on native Linux distros.',
        suggestedAction: 'Check company IT compatibility requirements.',
        resolved: true,
      },
    ],
    challenge: {
      blindSpots: [
        'You assigned only a 5/10 weight to Upgradeability, yet your goal explicitly specifies a 4-year lifecycle. In year 3-4, fixed 24GB RAM may become a bottleneck as AI dev dependencies expand.',
        'Thermal throttling: While MacBook Air M4 has high peak speed, sustained 100% compilation loops without an internal fan will throttle clock speeds by 15-20% after 8 minutes.',
      ],
      counterArgument: 'If your workflow frequently involves training or fine-tuning local models rather than simple inference, the Dell XPS 14 with RTX 4050 CUDA cores will outperform the MacBook M4 CPU by 3.5x despite the battery trade-off.',
      weakAssumptions: [
        'Assuming 512GB SSD is sufficient for 4 years of Docker images, Node modules, Xcode, and LLM weights.',
      ],
      challengingQuestions: [
        'How often will you compile code unplugged away from power outlets?',
        'If 3 years from now you need 48GB RAM for larger local models, are you prepared to replace the entire laptop?',
        'Does your development stack rely on x86-specific Docker images or Linux kernel modules?',
      ],
      alternativePerspective: 'If you already have a powerful remote dev server or cloud instance, buying the ThinkPad X1 Carbon offers superior typing ergonomics and Linux flexibility without needing maxed-out local compute.',
    },
    stabilityIndex: 84,
    stabilityExplanation: 'Your current winner (MacBook Air M4) remains #1 across most reasonable priority shifts. It would only forfeit first place if the weight of Price or Upgradeability is increased by over 35%.',
    alternativeWinners: {
      bestOverall: {
        optionId: 'opt-macbook-air-m4',
        optionName: 'MacBook Air M4',
        reason: 'Dominates overall efficiency, battery runtime, and performance balance.',
      },
      bestValue: {
        optionId: 'opt-dell-xps-14',
        optionName: 'Dell XPS 14',
        reason: 'Delivers 32GB RAM + NVIDIA RTX GPU under ₹1,45,000.',
      },
      bestPerformance: {
        optionId: 'opt-macbook-air-m4',
        optionName: 'MacBook Air M4',
        reason: 'Fastest single-core CPU throughput and unified memory bandwidth.',
      },
      lowestRisk: {
        optionId: 'opt-thinkpad-x1',
        optionName: 'ThinkPad X1 Carbon Gen 12',
        reason: 'Proven military-grade durability, replaceable SSD, and repairable parts.',
      },
      bestBudget: {
        optionId: 'opt-dell-xps-14',
        optionName: 'Dell XPS 14',
        reason: 'Lowest initial purchase price at ₹1,45,000 with 32GB RAM included.',
      },
    },
    generatedAt: '2026-08-27T12:00:00.000Z',
  },
  isDemo: true,
  version: 1,
};
