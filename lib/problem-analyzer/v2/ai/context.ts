import {
  buildResultBlueprint,
  interpretAnswers,
  type Diagnosis,
  type InsightType,
  type Level,
  type NextFocusType,
  type PrimaryRisk,
  type RecommendationType,
  type SignalKey,
} from '@/lib/problem-analyzer/v2/interpreter'
import type { AnswersMap } from '@/lib/problem-analyzer/score'
import type { QuestionId } from '@/lib/problem-analyzer/schema'

type AssessmentLevelLabel = 'weak' | 'mixed' | 'strong'

export type ProblemAnalyzerAiContext = {
  version: 'problem-analyzer-v2-ai-context-1'

  userInput: {
    problemText: string
    audienceText: string | null
  }

  assessment: {
    overallAssessment: 'strong' | 'emerging' | 'weak'
    primaryRisk: PrimaryRisk
    primaryRiskMeaning: string
    primaryRiskSignal: SignalKey | null
    recommendationType: RecommendationType
    recommendationTypeMeaning: string
    nextFocusType: NextFocusType
    nextFocusTypeMeaning: string
  }

  diagnosis: Array<{
    key: keyof Diagnosis
    level: Level
    label: AssessmentLevelLabel
    meaning: string
  }>

  signals: {
    strengths: Array<{
      signalKey: SignalKey
      label: string
    }>
    risks: Array<{
      signalKey: SignalKey
      label: string
    }>
  }

  priorityContext: {
    keyWeaknessIds: string[]
    keyStrengthIds: string[]
  }

  answers: Array<{
    questionId: QuestionId
    questionOrder: number
    question: string
    selectedAnswer: string
    insightId: string
    insightType: InsightType
    signalKey: SignalKey
    insightTitle: string
    insightSummary: string
    whyItMatters: string
    priority: number
  }>

  validationTargets: Array<{
    insightId: string
    questionId: QuestionId
    insightType: 'weakness' | 'neutral'
    signalKey: SignalKey
    title: string
    question: string
    selectedAnswer: string
    whyItMatters: string
    currentNextFocus?: string
  }>

  instructions: {
    sourceOfTruth: string[]
    validationTargetRule: string
  }
}

type BuildProblemAnalyzerAiContextInput = {
  problemText: string
  audienceText?: string
  answers: AnswersMap
}

const DIAGNOSIS_MEANINGS: Record<keyof Diagnosis, string> = {
  demandStrength:
    'How much evidence exists that customers already recognize and act on the problem.',
  urgency: 'How painful or time-sensitive the problem appears for the target customer.',
  frequency: 'How often the problem occurs.',
  economicImpact:
    'How clearly the problem connects to money, cost, revenue, risk, or measurable value.',
  incumbentStrength:
    'How strong existing alternatives appear and how hard they may be to displace.',
  validationDepth: 'How much direct customer evidence supports the opportunity.',
  timingTailwind: 'Whether external changes make this problem more relevant now.',
  audienceClarity: 'How clearly defined the initial target customer is.',
}

const PRIMARY_RISK_MEANINGS: Record<PrimaryRisk, string> = {
  weak_demand:
    'The core risk is that customers are not showing enough active demand for the problem as framed.',
  market_creation_risk:
    'The core risk is that customers may not yet recognize this as a problem, so adoption may require education or behavior change.',
  validation_gap:
    'The core risk is that the opportunity has some signal, but not enough direct customer proof yet.',
  execution_risk:
    'The problem signal is relatively strong, so the main risk is whether a focused product test can execute well enough to prove the opportunity.',
  incumbent_displacement_risk:
    'The core risk is that existing alternatives or incumbents may be strong enough to make switching difficult.',
  wedge_clarity_risk:
    'The core risk is that the target customer or initial use case is too broad, making validation and positioning harder.',
  hit_driven_risk:
    'The core risk is that the problem may be too episodic, soft, or hard to monetize reliably.',
  timing_window_risk:
    'The core risk is that timing looks favorable, but the opportunity still needs fast validation before committing heavily.',
}

const RECOMMENDATION_TYPE_MEANINGS: Record<RecommendationType, string> = {
  build:
    'The opportunity has enough signal to justify a narrow build-oriented test or MVP, provided the build is scoped around learning rather than scaling.',
  validate:
    'The opportunity needs stronger external proof before committing to meaningful product development.',
  refine:
    'The opportunity has some signal, but the customer, wedge, use case, or positioning needs sharpening before the next major step.',
  reconsider:
    'The current framing does not show enough demand or customer pull to justify proceeding without a major reframing.',
}

const NEXT_FOCUS_TYPE_MEANINGS: Record<NextFocusType, string> = {
  validate:
    'The next step should be designed to produce stronger evidence. This may be through interviews, commitments, pre-sales, concierge tests, prototypes, or a narrow MVP depending on the recommendation type.',
  behavior_change:
    'The next step should test whether customers recognize the problem and will adopt a new workflow, habit, or mindset around it.',
  refine_problem:
    'The next step should narrow the customer, use case, wedge, or positioning so future validation is more focused and informative.',
  reconsider:
    'The next step should question whether this problem is worth pursuing as currently framed, or whether a materially different customer/problem angle is needed.',
}

const PRIMARY_RISK_SIGNAL: Partial<Record<PrimaryRisk, SignalKey>> = {
  weak_demand: 'weak_customer_action',
  market_creation_risk: 'market_does_not_recognize_problem',
  validation_gap: 'limited_validation',
  execution_risk: 'active_customer_behavior',
  incumbent_displacement_risk: 'strong_incumbents',
  wedge_clarity_risk: 'broad_target_audience',
  hit_driven_risk: 'unclear_economic_impact',
  timing_window_risk: 'strong_timing_tailwind',
}

const SIGNAL_LABELS: Record<SignalKey, string> = {
  active_customer_behavior: 'Active demand',
  customers_paying_existing_solutions: 'Customers are already paying to solve problem',
  clear_economic_impact: 'Clear economic impact',
  high_problem_frequency: 'Frequent problem',
  specific_target_customer: 'Clear ICP',
  strong_timing_tailwind: 'Timing tailwind',
  clear_solution_gap: 'Clear solution gap',
  limited_validation: 'Low validation',
  weak_customer_action: 'Weak demand',
  low_urgency: 'Low urgency',
  low_frequency: 'Low frequency problem',
  unclear_economic_impact: 'Unclear economic impact',
  broad_target_audience: 'Overly broad target audience',
  good_enough_existing_solutions: 'Adequate existing solutions',
  strong_incumbents: 'Strong incumbents',
  weak_timing_signal: 'Weak timing',
  market_does_not_recognize_problem: 'Unrecognized problem',
}

function getLevelLabel(level: Level): AssessmentLevelLabel {
  if (level === 0) return 'weak'
  if (level === 1) return 'mixed'
  return 'strong'
}

function buildDiagnosisContext(diagnosis: Diagnosis): ProblemAnalyzerAiContext['diagnosis'] {
  return Object.entries(diagnosis).map(([key, level]) => {
    const diagnosisKey = key as keyof Diagnosis
    const diagnosisLevel = level as Level

    return {
      key: diagnosisKey,
      level: diagnosisLevel,
      label: getLevelLabel(diagnosisLevel),
      meaning: DIAGNOSIS_MEANINGS[diagnosisKey],
    }
  })
}

function buildSignalContext(signalKeys: SignalKey[]) {
  return signalKeys.map((signalKey) => ({
    signalKey,
    label: SIGNAL_LABELS[signalKey],
  }))
}

export function buildProblemAnalyzerAiContext({
  problemText,
  audienceText,
  answers,
}: BuildProblemAnalyzerAiContextInput): ProblemAnalyzerAiContext {
  const interpretation = interpretAnswers(answers)
  const blueprint = buildResultBlueprint(interpretation, answers)

  const validationTargets = blueprint.insights
    .filter((insight) => insight.type === 'weakness' || insight.type === 'neutral')
    .map((insight) => ({
      insightId: insight.id,
      questionId: insight.questionId,
      insightType: insight.type as 'weakness' | 'neutral',
      signalKey: insight.signalKey,
      title: insight.title,
      question: insight.question,
      selectedAnswer: insight.answer,
      whyItMatters: insight.whyItMatters,
      currentNextFocus: insight.nextFocus,
    }))

  return {
    version: 'problem-analyzer-v2-ai-context-1',

    userInput: {
      problemText,
      audienceText: audienceText || null,
    },

    assessment: {
      overallAssessment: blueprint.overallAssessment,
      primaryRisk: blueprint.primaryRisk,
      primaryRiskMeaning: PRIMARY_RISK_MEANINGS[blueprint.primaryRisk],
      primaryRiskSignal: PRIMARY_RISK_SIGNAL[blueprint.primaryRisk] ?? null,
      recommendationType: blueprint.recommendationType,
      recommendationTypeMeaning: RECOMMENDATION_TYPE_MEANINGS[blueprint.recommendationType],
      nextFocusType: blueprint.nextFocusType,
      nextFocusTypeMeaning: NEXT_FOCUS_TYPE_MEANINGS[blueprint.nextFocusType],
    },

    diagnosis: buildDiagnosisContext(interpretation.diagnosis),

    signals: {
      strengths: buildSignalContext(blueprint.selectedStrengths),
      risks: buildSignalContext(blueprint.selectedRisks),
    },

    priorityContext: {
      keyWeaknessIds: blueprint.keyWeaknessIds,
      keyStrengthIds: blueprint.keyStrengthIds,
    },

    answers: blueprint.insights.map((insight) => ({
      questionId: insight.questionId,
      questionOrder: insight.questionOrder,
      question: insight.question,
      selectedAnswer: insight.answer,
      insightId: insight.id,
      insightType: insight.type,
      signalKey: insight.signalKey,
      insightTitle: insight.title,
      insightSummary: insight.summary,
      whyItMatters: insight.whyItMatters,
      priority: insight.priority,
    })),

    validationTargets,

    instructions: {
      sourceOfTruth: [
        'The deterministic assessment is the source of truth for the overall verdict.',
        'The primary risk explains the main strategic constraint.',
        'The recommendation type and next focus type constrain the recommended action.',
        'The diagnosis levels explain why the assessment was reached.',
        'The answers and insights provide the evidence behind each signal.',
        'The priority context identifies which weaknesses and strengths the UI treats as most important.',
        'Do not introduce facts, risks, or assumptions not grounded in this context.',
        'Do not change the assessment, primary risk, recommendation type, next focus type, signal keys, or insight ids.',
      ],
      validationTargetRule:
        'Return exactly one insightValidationGuidance item for each validationTargets item. Preserve insightId exactly. Do not return validation guidance for strengths.',
    },
  }
}
