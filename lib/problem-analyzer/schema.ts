export type QuestionId = string
export type OptionId = string

export type Option = {
  id: OptionId
  label: string
  helpText?: string
  score: number
  bucketLevel: 1 | 2 | 3 | 4
}

export type Question = {
  id: QuestionId
  title: string
  shortLabel?: string
  description?: string
  // 10 = highest importance
  priorityRank: number
  // Takeaway messages for this question depending on the response (strong/weak).
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
    id: 'problem-context',
    title: 'Problem Awareness & Context',
    description:
      'Understand whether the market recognizes the problem and why this opportunity exists now.',
    questionIds: ['customer_action', 'why_now', 'icp_clarity'],
  },
  {
    id: 'pain-intensity',
    title: 'Pain Intensity',
    description: 'Evaluate how frequently the problem occurs and how severe the consequences are.',
    questionIds: ['frequency', 'severity', 'economic_impact'],
  },
  {
    id: 'current-reality',
    title: 'Current Reality',
    description:
      'Look at how customers currently solve the problem and whether existing solutions leave room for improvement.',
    questionIds: ['current_solution', 'solution_quality'],
  },
  {
    id: 'validation',
    title: 'Evidence & Validation',
    description: 'Assess the strength of real-world validation and behavioral evidence.',
    questionIds: ['validation'],
  },
]

import type { Question } from '@/lib/problem-analyzer/schema'

export const QUESTIONS: Record<string, Question> = {
  customer_action: {
    id: 'customer_action',
    title: 'What are customers currently doing about this problem?',
    shortLabel: 'Current customer action',
    description: 'This measures how much education the market requires before buying.',
    priorityRank: 9,
    takeaways: {
      strong: [
        'Customers are actively taking action, which signals real behavioral demand.',
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
        bucketLevel: 2,
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

  why_now: {
    id: 'why_now',
    title: 'What makes this problem especially timely right now?',
    shortLabel: 'Why now catalyst',
    description:
      'Strong startups often ride a shift — in technology, regulation, distribution, or customer behavior. If nothing has changed, you should be clear on why this opportunity exists now and not five years ago.',
    priorityRank: 6,
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
        id: 'behavior_shift',
        label: 'Customer behavior is changing in a measurable way',
        helpText:
          'Customer expectations or habits are shifting in a visible way (e.g. remote work, mobile-first usage, generational preference changes).',
        score: 15,
        bucketLevel: 2,
      },
      {
        id: 'growing_market',
        label: 'Market is growing, but no clear structural change',
        helpText:
          'The problem is becoming more common or visible, but there is no clear catalyst enabling a new type of solution.',
        score: 8,
        bucketLevel: 3,
      },
      {
        id: 'no_shift',
        label: 'No meaningful change — this problem has existed unchanged for years',
        helpText:
          'This problem has existed for years without a major shift in technology, regulation, or behavior.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  icp_clarity: {
    id: 'icp_clarity',
    title: 'How precisely can you define the group that experiences this problem?',
    shortLabel: 'ICP clarity',
    description:
      'Strong early-stage startups usually begin with a clearly defined niche. The more precisely you can describe the group experiencing this problem, the easier it is to test, reach, and refine your solution. Specific ICP reduces GTM friction.',
    priorityRank: 8,
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
        id: 'specific_niche',
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
          'You can identify a clear category, but it still includes diverse subgroups (e.g. “freelancers”, “SMBs”). Medium.',
        score: 14,
        bucketLevel: 2,
      },
      {
        id: 'large_category',
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

  frequency: {
    id: 'frequency',
    title: 'For your target customer, how often does this problem meaningfully occur?',
    shortLabel: 'Problem frequency',
    description:
      'High-frequency problems are easier to build habits around and often easier to monetize. Low-frequency problems must be especially painful or high-value to justify a product.',
    priorityRank: 7,
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

  severity: {
    id: 'severity',
    title: 'What happens if this problem remains unsolved?',
    shortLabel: 'Problem severity',
    description:
      'Severe problems are easier to prioritize and monetize. If the consequences are small, customers are less likely to change behavior or pay.',
    priorityRank: 9,
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
        id: 'financial',
        label: 'Major financial or reputational impact',
        helpText: 'Significant money, contracts, or credibility are at risk.',
        score: 20,
        bucketLevel: 2,
      },
      {
        id: 'productivity',
        label: 'Noticeable productivity or efficiency loss',
        helpText: 'Time, effort, or resources are wasted, but operations continue.',
        score: 12,
        bucketLevel: 3,
      },
      {
        id: 'minor',
        label: 'Mild inconvenience or frustration',
        helpText: 'It’s annoying, but tolerable.',
        score: 5,
        bucketLevel: 4,
      },
    ],
  },

  economic_impact: {
    id: 'economic_impact',
    title: 'How directly does this problem impact money?',
    shortLabel: 'Economic impact',
    description: 'The problem does not directly affect money or cost.',
    priorityRank: 10,
    takeaways: {
      strong: [
        'Direct financial impact makes monetization and ROI framing easier.',
        'Clear monetary consequences strengthen the purchasing case.',
      ],
      weak: [
        'Indirect or unclear economic impact weakens purchasing justification.',
        'If the impact isn’t measurable in financial terms, conversion may be harder.',
      ],
    },
    options: [
      {
        id: 'revenue_loss',
        label: 'Direct revenue loss',
        helpText: 'Customers lose sales, contracts, or income because of this problem.',
        score: 25,
        bucketLevel: 1,
      },
      {
        id: 'cost_increase',
        label: 'Clear cost increase',
        helpText: 'Customers spend money inefficiently or incur avoidable expenses.',
        score: 20,
        bucketLevel: 2,
      },
      {
        id: 'time_loss',
        label: 'Indirect time or productivity loss',
        helpText: 'The main impact is wasted time or inefficiency, not direct financial loss.',
        score: 10,
        bucketLevel: 3,
      },
      {
        id: 'no_financial',
        label: 'No clear measurable financial impact',
        helpText: 'The problem does not directly affect money or cost.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  current_solution: {
    id: 'current_solution',
    title: 'How are customers currently solving this problem?',
    shortLabel: 'Current solution behavior',
    description:
      'If customers are already taking action, even inefficiently, that provides validation. Inaction often signals low urgency.',
    priorityRank: 9,
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
        bucketLevel: 2,
      },
      {
        id: 'poorly_solved',
        label: 'Partially addressed but poorly solved',
        helpText: 'Customers attempt to solve it, but existing options are clearly inadequate.',
        score: 15,
        bucketLevel: 3,
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

  solution_quality: {
    id: 'solution_quality',
    title: 'How well do current solutions actually solve the problem?',
    shortLabel: 'Solution quality gap',
    description:
      'The better existing solutions are, the harder it will be to displace them. Weak or frustrating workarounds create opportunity.',
    priorityRank: 6,
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
        id: 'inadequate',
        label: 'Clearly inadequate',
        helpText: 'Current solutions fail to address the core problem effectively.',
        score: 20,
        bucketLevel: 1,
      },
      {
        id: 'tolerated',
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
        id: 'incumbent',
        label: 'Best-in-class incumbent dominates',
        helpText: 'Existing solution is highly polished and deeply embedded.',
        score: 0,
        bucketLevel: 4,
      },
    ],
  },

  validation: {
    id: 'validation',
    title: 'What concrete validation evidence do you have so far?',
    shortLabel: 'Validation evidence',
    description:
      'The strongest validation comes from real behavior, not opinions. Revenue and commitments outweigh interviews; interviews outweigh assumptions.',
    priorityRank: 10,
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
        id: 'lois',
        label: 'Signed LOIs or financial pre-commitments',
        helpText: 'Customers have formally expressed intent to pay.',
        score: 25,
        bucketLevel: 2,
      },
      {
        id: 'interviews_10',
        label: '10+ in-depth customer interviews with consistent pain signals',
        helpText: 'Multiple conversations confirming urgency and willingness to change behavior.',
        score: 18,
        bucketLevel: 3,
      },
      {
        id: 'interviews_few',
        label: 'Fewer than 10 customer interviews',
        helpText: 'Some exploratory conversations, but limited data.',
        score: 8,
        bucketLevel: 4,
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
