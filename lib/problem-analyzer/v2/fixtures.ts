import type { QuestionId } from '../schema.ts'
import type { AnswersMap, QuestionConfidenceLevel } from '../score.ts'
import type { NextFocusType, PrimaryRisk, RecommendationType } from './interpreter.ts'

export type TestCase = {
  caseName: string
  problemStatement: string
  answers: AnswersMap
  confidenceByQuestion?: Partial<Record<QuestionId, QuestionConfidenceLevel>>
  expected: {
    primaryRisk: PrimaryRisk
    recommendationType: RecommendationType
    nextFocusType: NextFocusType
  }
}

export const PROBLEM_ANALYZER_TEST_CASES: TestCase[] = [
  {
    caseName: 'Weak - Social Coordination Tarpit',
    problemStatement:
      'People do not spend enough time with friends because it is hard to coordinate schedules. A platform to organize social plans would help.',
    answers: {
      customerBehavior: 'complain_no_action',
      whyNow: 'no_meaningful_change',
      icpClarity: 'everyone',
      problemFrequency: 'weekly',
      problemSeverity: 'mild_inconvenience',
      economicImpact: 'no_measurable_impact',
      currentBehavior: 'ignored',
      solutionGap: 'good_enough',
      validationEvidence: 'no_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'high',
      icpClarity: 'high',
      problemFrequency: 'med',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'med',
      solutionGap: 'high',
      validationEvidence: 'low',
    },
    expected: {
      primaryRisk: 'weak_demand',
      recommendationType: 'reconsider',
      nextFocusType: 'reconsider',
    },
  },
  {
    caseName: 'Weak - Food Discovery',
    problemStatement:
      'People struggle to decide what restaurant to go to. There should be a better way to discover and choose places to eat.',
    answers: {
      customerBehavior: 'complain_no_action',
      whyNow: 'no_meaningful_change',
      icpClarity: 'everyone',
      problemFrequency: 'weekly',
      problemSeverity: 'mild_inconvenience',
      economicImpact: 'no_measurable_impact',
      currentBehavior: 'poorly_solved',
      solutionGap: 'good_enough',
      validationEvidence: 'no_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'high',
      icpClarity: 'high',
      problemFrequency: 'high',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'med',
      solutionGap: 'high',
      validationEvidence: 'high',
    },
    expected: {
      primaryRisk: 'weak_demand',
      recommendationType: 'reconsider',
      nextFocusType: 'reconsider',
    },
  },
  {
    caseName: 'Weak - Social Spontaneity',
    problemStatement:
      'People should be more spontaneous and social. An app that shows what friends are doing in real time would help people connect more.',
    answers: {
      customerBehavior: 'not_aware',
      whyNow: 'no_meaningful_change',
      icpClarity: 'everyone',
      problemFrequency: 'weekly',
      problemSeverity: 'mild_inconvenience',
      economicImpact: 'no_measurable_impact',
      currentBehavior: 'ignored',
      solutionGap: 'good_enough',
      validationEvidence: 'no_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'high',
      icpClarity: 'high',
      problemFrequency: 'low',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'high',
      validationEvidence: 'high',
    },
    expected: {
      primaryRisk: 'market_creation_risk',
      recommendationType: 'reconsider',
      nextFocusType: 'behavior_change',
    },
  },
  {
    caseName: 'Emerging - Buenos Aires Housing',
    problemStatement:
      'New arrivals in Buenos Aires cannot find housing because landlords require local guarantors or local income history, pushing people into unregulated contracts or endless Airbnb stays.',
    answers: {
      customerBehavior: 'using_workarounds',
      whyNow: 'market_growing_only',
      icpClarity: 'extremely_specific_niche',
      problemFrequency: 'rare',
      problemSeverity: 'productivity_loss',
      economicImpact: 'direct_revenue_loss',
      currentBehavior: 'paying_competitor',
      solutionGap: 'frustrating_but_tolerated',
      validationEvidence: 'fewer_than_ten_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'med',
      icpClarity: 'high',
      problemFrequency: 'high',
      problemSeverity: 'med',
      economicImpact: 'high',
      currentBehavior: 'med',
      solutionGap: 'med',
      validationEvidence: 'high',
    },
    expected: {
      primaryRisk: 'validation_gap',
      recommendationType: 'validate',
      nextFocusType: 'validate',
    },
  },
  {
    caseName: 'Emerging - Uber Pre-Launch',
    problemStatement:
      'Getting a reliable taxi is frustrating because wait times are long, availability is uncertain, and service quality is inconsistent. There should be a faster, more reliable way to request a ride.',
    answers: {
      customerBehavior: 'using_workarounds',
      whyNow: 'structural_shift',
      icpClarity: 'defined_segment',
      problemFrequency: 'weekly',
      problemSeverity: 'productivity_loss',
      economicImpact: 'time_productivity_only',
      currentBehavior: 'paying_competitor',
      solutionGap: 'frustrating_but_tolerated',
      validationEvidence: 'fewer_than_ten_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'med',
      icpClarity: 'med',
      problemFrequency: 'med',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'high',
      validationEvidence: 'low',
    },
    expected: {
      primaryRisk: 'validation_gap',
      recommendationType: 'validate',
      nextFocusType: 'validate',
    },
  },
  {
    caseName: 'Emerging - Browser IDE',
    problemStatement:
      'Developers need a faster, more accessible way to build and run code without local environment setup. A browser-based IDE would simplify development.',
    answers: {
      customerBehavior: 'using_workarounds',
      whyNow: 'structural_shift',
      icpClarity: 'defined_segment',
      problemFrequency: 'daily',
      problemSeverity: 'productivity_loss',
      economicImpact: 'time_productivity_only',
      currentBehavior: 'paying_competitor',
      solutionGap: 'good_enough',
      validationEvidence: 'ten_plus_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'med',
      icpClarity: 'med',
      problemFrequency: 'high',
      problemSeverity: 'med',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'high',
      validationEvidence: 'med',
    },
    expected: {
      primaryRisk: 'incumbent_displacement_risk',
      recommendationType: 'refine',
      nextFocusType: 'refine_problem',
    },
  },
  {
    caseName: 'Emerging - Social Sharing',
    problemStatement:
      'People want to share their location, plans, and activities with friends in a more engaging way.',
    answers: {
      customerBehavior: 'using_workarounds',
      whyNow: 'behavioral_shift',
      icpClarity: 'large_general_category',
      problemFrequency: 'daily',
      problemSeverity: 'mild_inconvenience',
      economicImpact: 'no_measurable_impact',
      currentBehavior: 'paying_competitor',
      solutionGap: 'good_enough',
      validationEvidence: 'fewer_than_ten_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'high',
      icpClarity: 'high',
      problemFrequency: 'high',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'med',
      validationEvidence: 'low',
    },
    expected: {
      primaryRisk: 'validation_gap',
      recommendationType: 'validate',
      nextFocusType: 'validate',
    },
  },
  {
    caseName: 'Emerging - Glitch Style Social World',
    problemStatement:
      'People want richer, more creative online social experiences beyond traditional games. A collaborative multiplayer world would enable new forms of interaction.',
    answers: {
      customerBehavior: 'complain_no_action',
      whyNow: 'market_growing_only',
      icpClarity: 'large_general_category',
      problemFrequency: 'weekly',
      problemSeverity: 'mild_inconvenience',
      economicImpact: 'no_measurable_impact',
      currentBehavior: 'paying_competitor',
      solutionGap: 'good_enough',
      validationEvidence: 'fewer_than_ten_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'med',
      whyNow: 'med',
      icpClarity: 'high',
      problemFrequency: 'med',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'med',
      validationEvidence: 'low',
    },
    expected: {
      primaryRisk: 'validation_gap',
      recommendationType: 'validate',
      nextFocusType: 'validate',
    },
  },
  {
    caseName: 'Strong - AI Dev Tools',
    problemStatement:
      'Developers spend significant time writing, debugging, and navigating code. This slows development and increases cognitive load. There should be a faster way to write and understand code.',
    answers: {
      customerBehavior: 'using_workarounds',
      whyNow: 'structural_shift',
      icpClarity: 'extremely_specific_niche',
      problemFrequency: 'daily',
      problemSeverity: 'productivity_loss',
      economicImpact: 'clear_cost_increase',
      currentBehavior: 'paying_competitor',
      solutionGap: 'frustrating_but_tolerated',
      validationEvidence: 'ten_plus_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'high',
      icpClarity: 'high',
      problemFrequency: 'high',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'high',
      validationEvidence: 'med',
    },
    expected: {
      primaryRisk: 'incumbent_displacement_risk',
      recommendationType: 'refine',
      nextFocusType: 'refine_problem',
    },
  },
  {
    caseName: 'Strong - Stripe Payments',
    problemStatement:
      'Developers and online businesses struggle to integrate payments into products. Existing solutions are complex, slow to set up, and require significant manual work. There should be a simple, developer-friendly way to accept payments online.',
    answers: {
      customerBehavior: 'using_workarounds',
      whyNow: 'structural_shift',
      icpClarity: 'extremely_specific_niche',
      problemFrequency: 'monthly',
      problemSeverity: 'existential',
      economicImpact: 'direct_revenue_loss',
      currentBehavior: 'paying_competitor',
      solutionGap: 'clearly_inadequate',
      validationEvidence: 'ten_plus_interviews',
    },
    confidenceByQuestion: {
      customerBehavior: 'high',
      whyNow: 'med',
      icpClarity: 'high',
      problemFrequency: 'med',
      problemSeverity: 'high',
      economicImpact: 'high',
      currentBehavior: 'high',
      solutionGap: 'high',
      validationEvidence: 'med',
    },
    expected: {
      primaryRisk: 'execution_risk',
      recommendationType: 'build',
      nextFocusType: 'validate',
    },
  },
]
