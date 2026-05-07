export type QuestionId = string
export type OptionId = string

export type Option = {
  id: OptionId
  label: string
  helpText?: string
  score: number
  bucketLevel: 1 | 2 | 3 | 4
}

export type NextFocusType = 'validate' | 'behavior_change' | 'refine_problem' | 'reconsider'

export type Question = {
  id: QuestionId
  title: string
  shortLabel: string
  description?: string
  priorityRank: number
  structural?: boolean
  driverLabels?: {
    strong: string
    weak: string
  }
  nextFocusType?: NextFocusType
  takeaways?: {
    strong: [string, string]
    weak: [string, string]
  }
  options: Option[]
}

export type Screen = {
  id: string
  title: string
  description?: string
  questionIds: QuestionId[]
}

export const SCREENS: Screen[] = [
  {
    id: 'define-problem',
    title: 'Define the Problem',
    description: 'Start by describing the problem you want to evaluate and who experiences it.',
    questionIds: [],
  },
  {
    id: 'problem-context',
    title: 'Problem Awareness & Context',
    description:
      'Understand whether the market recognizes the problem and why this opportunity exists now.',
    questionIds: ['customerBehavior', 'whyNow', 'icpClarity'],
  },
  {
    id: 'pain-intensity',
    title: 'Pain Intensity',
    description: 'Evaluate how frequently the problem occurs and how severe the consequences are.',
    questionIds: ['problemFrequency', 'problemSeverity', 'economicImpact'],
  },
  {
    id: 'current-reality',
    title: 'Current Reality',
    description:
      'Look at how customers currently solve the problem and whether existing solutions leave room for improvement.',
    questionIds: ['currentBehavior', 'solutionGap'],
  },
  {
    id: 'validation',
    title: 'Evidence & Validation',
    description: 'Assess the strength of real-world validation and behavioral evidence.',
    questionIds: ['validationEvidence'],
  },
]

export const QUESTIONS: Record<QuestionId, Question> = {
  customerBehavior: {
    id: 'customerBehavior',
    title: 'What are customers currently doing about this problem?',
    shortLabel: 'Customer Behavior',
    description: 'This measures how much education the market requires before buying.',
    priorityRank: 9,
    structural: false,
    driverLabels: {
      strong: 'active customer behavior',
      weak: 'weak customer action',
    },
    nextFocusType: 'behavior_change',
    takeaways: {
      strong: [
        'Customers are already taking action, which signals real behavioral demand.',
        'Observable action suggests this problem is strong enough to drive behavior change.',
      ],
      weak: [
        'Customers are largely ignoring the issue, suggesting low urgency or low perceived value.',
        'Inaction often signals that the pain may not be strong enough to trigger change.',
      ],
    },
    options: [
      {
        id: 'actively_searching',
        label: 'Actively searching and evaluating solutions',
        score: 25,
        bucketLevel: 1,
      },
      {
        id: 'using_workarounds',
        label: 'Actively using workarounds or competitors',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'complain_no_action',
        label: 'Complain about it but take no action',
        score: 12,
        bucketLevel: 3,
      },
      {
        id: 'not_aware',
        label: 'Do not recognize it as a problem yet',
        score: 5,
        bucketLevel: 4,
      },
    ],
  },

  whyNow: {
    id: 'whyNow',
    title: 'What makes this problem especially timely right now?',
    shortLabel: 'Timing Signal',
    description:
      'Strong startups often ride a shift in technology, regulation, distribution, or customer behavior. If nothing has changed, you should be clear on why this opportunity exists now and not five years ago.',
    priorityRank: 6,
    structural: false,
    driverLabels: {
      strong: 'strong timing tailwind',
      weak: 'weak timing signal',
    },
    nextFocusType: 'validate',
    takeaways: {
      strong: [
        'A clear timing catalyst strengthens the case that this opportunity exists now rather than in the past.',
        'A strong “why now” increases the probability that this market is at an inflection point.',
      ],
      weak: [
        'Without a clear “why now,” this idea may rely heavily on execution rather than tailwinds.',
        'If nothing structural has changed, this opportunity may not be uniquely positioned today.',
      ],
    },
    options: [
      {
        id: 'structural_shift',
        label:
          'Clear structural shift (technology, regulation, platform change) creates a new opportunity',
        helpText:
          'A new capability, law, or platform has made this solution newly possible or significantly easier (e.g. AI breakthroughs, new APIs, regulatory changes).',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'behavioral_shift',
        label: 'Customer behavior is changing in a measurable way',
        helpText:
          'Customer expectations or habits are shifting in a visible way (e.g. remote work, mobile-first usage, generational preference changes).',
        score: 15,
        bucketLevel: 2,
      },
      {
        id: 'market_growing_only',
        label: 'Market is growing, but no clear structural change',
        helpText:
          'The problem is becoming more common or visible, but there is no clear catalyst enabling a new type of solution.',
        score: 8,
        bucketLevel: 3,
      },
      {
        id: 'no_meaningful_change',
        label: 'No meaningful change — this problem has existed unchanged for years',
        helpText:
          'This problem has existed for years without a major shift in technology, regulation, or behavior.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  icpClarity: {
    id: 'icpClarity',
    title: 'How precisely can you define the group that experiences this problem?',
    shortLabel: 'ICP Clarity',
    description:
      'Strong early-stage startups usually begin with a clearly defined niche. The more precisely you can describe the group experiencing this problem, the easier it is to test, reach, and refine your solution.',
    priorityRank: 8,
    structural: false,
    driverLabels: {
      strong: 'clear target customer',
      weak: 'unclear target customer',
    },
    nextFocusType: 'refine_problem',
    takeaways: {
      strong: [
        'A clearly defined niche improves speed of validation and lowers early distribution risk.',
        'Specific targeting increases your chances of finding early traction quickly.',
      ],
      weak: [
        'A broad or undefined audience increases testing difficulty and weakens positioning.',
        'Lack of niche clarity can slow learning and dilute messaging.',
      ],
    },
    options: [
      {
        id: 'extremely_specific_niche',
        label: 'Extremely specific niche (clear role, context, and constraints)',
        helpText:
          'You can describe them in detail: role, environment, tools they use, and specific context (e.g. “independent podcast hosts with 5–50k listeners using Spotify Ads”).',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'defined_segment',
        label: 'Defined segment, but still somewhat broad',
        helpText:
          'You can identify a clear category, but it still includes diverse subgroups (e.g. “freelancers”, “SMBs”).',
        score: 14,
        bucketLevel: 2,
      },
      {
        id: 'large_general_category',
        label: 'Large general category (e.g. “small businesses”, “creators”)',
        helpText:
          'The audience includes many different use cases and contexts (e.g. “marketers”, “students”).',
        score: 6,
        bucketLevel: 3,
      },
      {
        id: 'everyone',
        label: 'Very broad or “everyone”',
        helpText: 'The problem applies to almost anyone in theory.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  problemFrequency: {
    id: 'problemFrequency',
    title: 'For your target customer, how often does this problem meaningfully occur?',
    shortLabel: 'Problem Frequency',
    description:
      'High-frequency problems are easier to build habits around and often easier to monetize. Low-frequency problems must be especially painful or high-value to justify a product.',
    priorityRank: 7,
    structural: true,
    driverLabels: {
      strong: 'high problem frequency',
      weak: 'low problem frequency',
    },
    nextFocusType: 'reconsider',
    takeaways: {
      strong: [
        'High recurrence increases habit potential and monetization opportunities.',
        'Frequent pain points are easier to build sustainable products around.',
      ],
      weak: [
        'Infrequent problems require stronger severity or pricing to justify a solution.',
        'Low recurrence may limit retention and repeat engagement.',
      ],
    },
    options: [
      {
        id: 'daily',
        label: 'Daily',
        helpText: 'Occurs most days or is part of a regular workflow.',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'weekly',
        label: 'Weekly',
        helpText: 'Happens multiple times per month or during recurring processes.',
        score: 15,
        bucketLevel: 2,
      },
      {
        id: 'monthly',
        label: 'Monthly',
        helpText: 'Happens occasionally or during specific reporting/planning cycles.',
        score: 8,
        bucketLevel: 3,
      },
      {
        id: 'rare',
        label: 'Rare',
        helpText: 'Infrequent or event-based (e.g. once or twice per year).',
        score: 3,
        bucketLevel: 4,
      },
    ],
  },

  problemSeverity: {
    id: 'problemSeverity',
    title: 'What happens if this problem remains unsolved?',
    shortLabel: 'Problem Severity',
    description:
      'Severe problems are easier to prioritize and monetize. If the consequences are small, customers are less likely to change behavior or pay.',
    priorityRank: 9,
    structural: true,
    driverLabels: {
      strong: 'strong problem intensity',
      weak: 'weak problem intensity',
    },
    nextFocusType: 'reconsider',
    takeaways: {
      strong: [
        'Significant consequences increase prioritization and willingness to change behavior.',
        'Severe outcomes make customers more likely to pay for reliable solutions.',
      ],
      weak: [
        'Minor consequences reduce urgency and make adoption less likely.',
        'If the downside is small, customers may not prioritize solving this.',
      ],
    },
    options: [
      {
        id: 'existential',
        label: 'Existential or mission-critical risk',
        helpText: 'The business or individual cannot function properly without solving this.',
        score: 25,
        bucketLevel: 1,
      },
      {
        id: 'major_financial_reputational',
        label: 'Major financial or reputational impact',
        helpText: 'Significant money, contracts, or credibility are at risk.',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'productivity_loss',
        label: 'Noticeable productivity or efficiency loss',
        helpText: 'Time, effort, or resources are wasted, but operations continue.',
        score: 12,
        bucketLevel: 3,
      },
      {
        id: 'mild_inconvenience',
        label: 'Mild inconvenience or frustration',
        helpText: 'It’s annoying, but tolerable.',
        score: 5,
        bucketLevel: 4,
      },
    ],
  },

  economicImpact: {
    id: 'economicImpact',
    title: 'How directly does this problem impact money?',
    shortLabel: 'Economic Impact',
    description:
      'Direct financial impact makes monetization and ROI framing easier. If the impact is not measurable, conversion and pricing will usually be harder.',
    priorityRank: 10,
    structural: true,
    driverLabels: {
      strong: 'clear economic impact',
      weak: 'unclear economic impact',
    },
    nextFocusType: 'validate',
    takeaways: {
      strong: [
        'Direct financial impact makes monetization and ROI framing easier.',
        'Clear monetary consequences strengthen the purchasing case.',
      ],
      weak: [
        'Indirect or unclear economic impact weakens purchasing justification.',
        'If the impact is not measurable in financial terms, conversion may be harder.',
      ],
    },
    options: [
      {
        id: 'direct_revenue_loss',
        label: 'Direct revenue loss',
        helpText: 'Customers lose sales, contracts, or income because of this problem.',
        score: 25,
        bucketLevel: 1,
      },
      {
        id: 'clear_cost_increase',
        label: 'Clear cost increase',
        helpText: 'Customers spend money inefficiently or incur avoidable expenses.',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'time_productivity_only',
        label: 'Indirect time or productivity loss',
        helpText: 'The main impact is wasted time or inefficiency, not direct financial loss.',
        score: 10,
        bucketLevel: 3,
      },
      {
        id: 'no_measurable_impact',
        label: 'No clear measurable financial impact',
        helpText: 'The problem does not directly affect money or cost.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  currentBehavior: {
    id: 'currentBehavior',
    title: 'How are customers currently solving this problem?',
    shortLabel: 'Current Behavior',
    description:
      'If customers are already taking action, even inefficiently, that provides validation. Inaction often signals low urgency.',
    priorityRank: 9,
    structural: false,
    driverLabels: {
      strong: 'active workaround behavior',
      weak: 'weak evidence of current effort',
    },
    nextFocusType: 'validate',
    takeaways: {
      strong: [
        'Existing behavior or spend validates real demand and replacement opportunity.',
        'Active workaround or spend suggests meaningful pain.',
      ],
      weak: [
        'Lack of action suggests the problem may not be strongly felt.',
        'If customers aren’t attempting to solve it, urgency may be limited.',
      ],
    },
    options: [
      {
        id: 'paying_competitor',
        label: 'Paying competitor or existing solution',
        helpText: 'Customers are already paying for a product or service to solve this.',
        score: 25,
        bucketLevel: 1,
      },
      {
        id: 'manual_workaround',
        label: 'Manual workaround (spreadsheets, internal process, hacks)',
        helpText: 'Customers are solving it themselves using inefficient tools or processes.',
        score: 22,
        bucketLevel: 1,
      },
      {
        id: 'poorly_solved',
        label: 'Partially addressed but poorly solved',
        helpText: 'Customers attempt to solve it, but existing options are clearly inadequate.',
        score: 15,
        bucketLevel: 2,
      },
      {
        id: 'ignored',
        label: 'Mostly ignored or tolerated',
        helpText: 'Customers complain but generally do nothing about it.',
        score: 5,
        bucketLevel: 4,
      },
    ],
  },

  solutionGap: {
    id: 'solutionGap',
    title: 'How well do current solutions actually solve the problem?',
    shortLabel: 'Solution Gap',
    description:
      'The better existing solutions are, the harder it will be to displace them. Weak or frustrating workarounds create opportunity.',
    priorityRank: 6,
    structural: true,
    driverLabels: {
      strong: 'clear solution gap',
      weak: 'existing solutions may already be sufficient',
    },
    nextFocusType: 'reconsider',
    takeaways: {
      strong: [
        'Weak or frustrating solutions create clear opportunity for displacement.',
        'Poorly served markets often create strong openings for focused challengers.',
      ],
      weak: [
        'Strong incumbents increase competitive difficulty and switching resistance.',
        'Best-in-class alternatives raise the bar for differentiation.',
      ],
    },
    options: [
      {
        id: 'clearly_inadequate',
        label: 'Clearly inadequate',
        helpText: 'Current solutions fail to address the core problem effectively.',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'frustrating_but_tolerated',
        label: 'Frustrating but tolerated',
        helpText: 'Customers complain but accept it as “good enough.”',
        score: 15,
        bucketLevel: 2,
      },
      {
        id: 'good_enough',
        label: 'Good enough for most users',
        helpText: 'Solutions work reasonably well for the majority.',
        score: 7,
        bucketLevel: 3,
      },
      {
        id: 'best_in_class',
        label: 'Best-in-class incumbent dominates',
        helpText: 'Existing solution is highly polished and deeply embedded.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  validationEvidence: {
    id: 'validationEvidence',
    title: 'What concrete validation evidence do you have so far?',
    shortLabel: 'Validation Evidence',
    description:
      'The strongest validation comes from real behavior, not opinions. Revenue and commitments outweigh interviews; interviews outweigh assumptions.',
    priorityRank: 10,
    structural: false,
    driverLabels: {
      strong: 'strong validation evidence',
      weak: 'limited validation evidence',
    },
    nextFocusType: 'validate',
    takeaways: {
      strong: [
        'Real revenue or strong validation evidence significantly reduces idea risk.',
        'Behavioral proof provides confidence that this problem is not just theoretical.',
      ],
      weak: [
        'Limited or no direct validation means the idea remains speculative.',
        'Without customer proof, assumptions remain untested.',
      ],
    },
    options: [
      {
        id: 'paying_users',
        label: 'Paying users or active revenue',
        helpText: 'Customers are already paying for this solution or a version of it.',
        score: 30,
        bucketLevel: 1,
      },
      {
        id: 'lois_precommitments',
        label: 'Signed LOIs or financial pre-commitments',
        helpText: 'Customers have formally expressed intent to pay.',
        score: 25,
        bucketLevel: 1,
      },
      {
        id: 'ten_plus_interviews',
        label: '10+ in-depth customer interviews with consistent pain signals',
        helpText: 'Multiple conversations confirming urgency and willingness to change behavior.',
        score: 18,
        bucketLevel: 2,
      },
      {
        id: 'fewer_than_ten_interviews',
        label: 'Fewer than 10 customer interviews',
        helpText: 'Some exploratory conversations, but limited data.',
        score: 8,
        bucketLevel: 3,
      },
      {
        id: 'no_interviews',
        label: 'No direct conversations with target customers',
        helpText: 'Assumptions based on research, not direct validation.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },
}

export type ProblemAnalyzerSchema = {
  screens: Screen[]
  questions: Record<QuestionId, Question>
}

export const PROBLEM_ANALYZER_SCHEMA: ProblemAnalyzerSchema = {
  screens: SCREENS,
  questions: QUESTIONS,
}
