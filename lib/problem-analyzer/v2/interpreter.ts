import type { QuestionId } from '../schema.ts'
import type { AnswersMap, QuestionConfidenceLevel } from '../score.ts'

export type Level = 0 | 1 | 2

export type Diagnosis = {
  demandStrength: Level
  urgency: Level
  frequency: Level
  economicImpact: Level
  incumbentStrength: Level
  validationDepth: Level
  timingTailwind: Level
  audienceClarity: Level
}

export type PrimaryRisk =
  | 'weak_demand'
  | 'market_creation_risk'
  | 'validation_gap'
  | 'execution_risk'
  | 'incumbent_displacement_risk'
  | 'wedge_clarity_risk'
  | 'hit_driven_risk'
  | 'timing_window_risk'

export type RecommendationType = 'build' | 'validate' | 'refine' | 'reconsider'

export type NextFocusType = 'validate' | 'behavior_change' | 'refine_problem' | 'reconsider'

export type SignalKey =
  | 'active_customer_behavior'
  | 'customers_paying_existing_solutions'
  | 'clear_economic_impact'
  | 'high_problem_frequency'
  | 'specific_target_customer'
  | 'strong_timing_tailwind'
  | 'clear_solution_gap'
  | 'limited_validation'
  | 'weak_customer_action'
  | 'low_urgency'
  | 'low_frequency'
  | 'unclear_economic_impact'
  | 'broad_target_audience'
  | 'good_enough_existing_solutions'
  | 'strong_incumbents'
  | 'weak_timing_signal'
  | 'market_does_not_recognize_problem'

export type ConfidenceLevel = 'low' | 'medium' | 'high'

type DirectQuestionId =
  | 'problemFrequency'
  | 'economicImpact'
  | 'whyNow'
  | 'icpClarity'
  | 'validationEvidence'

type OptionLevelMap = Record<string, Level>

export type InterpretationResult = {
  diagnosis: Diagnosis
  primaryRisk: PrimaryRisk
  recommendationType: RecommendationType
  nextFocusType: NextFocusType
}

export type ResultBlueprint = {
  overallAssessment: 'strong' | 'emerging' | 'weak'
  primaryRisk: PrimaryRisk
  selectedStrengths: SignalKey[]
  selectedRisks: SignalKey[]
  recommendationType: RecommendationType
  recommendationKey: PrimaryRisk
  nextFocusType: NextFocusType
  nextFocusKey: PrimaryRisk
  confidenceLevel: ConfidenceLevel
}

export type ResultOutput = {
  overallAssessment: 'strong' | 'emerging' | 'weak'
  summary: string
  detail: string
  signals: Array<{
    label: string
    type: 'positive' | 'negative'
  }>
  recommendation: {
    title: string
    detail: string
  }
  nextFocus: {
    title: string
    detail: string
  }
  confidence: {
    level: ConfidenceLevel
    explanation: string
  }
}

const DIRECT_LEVELS: Record<DirectQuestionId, OptionLevelMap> = {
  problemFrequency: {
    daily: 2,
    weekly: 1,
    monthly: 1,
    rare: 0,
  },
  economicImpact: {
    direct_revenue_loss: 2,
    clear_cost_increase: 2,
    time_productivity_only: 1,
    no_measurable_impact: 0,
  },
  whyNow: {
    structural_shift: 2,
    behavioral_shift: 1,
    market_growing_only: 1,
    no_meaningful_change: 0,
  },
  icpClarity: {
    extremely_specific_niche: 2,
    defined_segment: 1,
    large_general_category: 0,
    everyone: 0,
  },
  validationEvidence: {
    paying_users: 2,
    lois_precommitments: 2,
    ten_plus_interviews: 1,
    fewer_than_ten_interviews: 0,
    no_interviews: 0,
  },
}

const DEMAND_BASE_LEVELS: Record<'customerBehavior', OptionLevelMap> = {
  customerBehavior: {
    actively_searching: 2,
    using_workarounds: 2,
    complain_no_action: 1,
    not_aware: 0,
  },
}

const URGENCY_BASE_LEVELS: Record<'problemSeverity', OptionLevelMap> = {
  problemSeverity: {
    existential: 2,
    major_financial_reputational: 2,
    productivity_loss: 1,
    mild_inconvenience: 0,
  },
}

const DEMAND_MODIFIER_LEVELS: Record<'currentBehavior', OptionLevelMap> = {
  currentBehavior: {
    paying_competitor: 2,
    manual_workaround: 2,
    poorly_solved: 1,
    ignored: 0,
  },
}

const INCUMBENT_BASE_LEVELS: Record<'currentBehavior', OptionLevelMap> = {
  currentBehavior: {
    paying_competitor: 2,
    manual_workaround: 1,
    poorly_solved: 1,
    ignored: 0,
  },
}

const SOLUTION_GAP_MODIFIERS: Record<string, -1 | 0 | 1> = {
  clearly_inadequate: -1,
  frustrating_but_tolerated: 0,
  good_enough: 1,
  best_in_class: 1,
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

const STRENGTH_PRIORITY: SignalKey[] = [
  'active_customer_behavior',
  'customers_paying_existing_solutions',
  'clear_economic_impact',
  'high_problem_frequency',
  'specific_target_customer',
  'strong_timing_tailwind',
  'clear_solution_gap',
]

const RISK_PRIORITY: SignalKey[] = [
  'limited_validation',
  'good_enough_existing_solutions',
  'strong_incumbents',
  'weak_customer_action',
  'broad_target_audience',
  'market_does_not_recognize_problem',
  'low_urgency',
  'low_frequency',
  'unclear_economic_impact',
  'weak_timing_signal',
]

const SIGNAL_LABELS: Record<SignalKey, string> = {
  active_customer_behavior: 'Active demand',
  customers_paying_existing_solutions: 'Paying customers',
  clear_economic_impact: 'Economic impact',
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

const COPY_BANK = {
  summaryTemplates: {
    strong: {
      weak_demand: 'Strong signal with a demand inconsistency',
      market_creation_risk: 'Strong upside, but behavior change is required',
      validation_gap: 'Strong problem signal, but proof still needs work',
      execution_risk: 'Strong problem, execution-dependent',
      incumbent_displacement_risk: 'Strong opportunity in a competitive market',
      wedge_clarity_risk: 'Strong problem with a fuzzy initial wedge',
      hit_driven_risk: 'Strong signal, but monetization still needs proof',
      timing_window_risk: 'Strong signal with a narrow timing window',
    },
    emerging: {
      weak_demand: 'Emerging signal with weak demand',
      market_creation_risk: 'Emerging signal that depends on market creation',
      validation_gap: 'Promising but under-validated',
      execution_risk: 'Promising and execution-sensitive',
      incumbent_displacement_risk: 'Promising, but incumbents raise the bar',
      wedge_clarity_risk: 'Promising, but the wedge is still unclear',
      hit_driven_risk: 'Promising, but value capture is still uncertain',
      timing_window_risk: 'Promising, but timing needs proof',
    },
    weak: {
      weak_demand: 'Weak demand signal',
      market_creation_risk: 'Weak signal that depends on changing user behavior',
      validation_gap: 'Weak signal with limited validation',
      execution_risk: 'Weak signal despite encouraging execution conditions',
      incumbent_displacement_risk: 'Weak signal in a competitive category',
      wedge_clarity_risk: 'Weak signal with unclear customer focus',
      hit_driven_risk: 'Weak signal with low measurable value',
      timing_window_risk: 'Weak signal despite a timing tailwind',
    },
  } satisfies Record<ResultBlueprint['overallAssessment'], Record<PrimaryRisk, string>>,
  detailTemplates: {
    weak_demand: (strengths: string[], risks: string[]) =>
      `Current answers point to limited demand. ${formatSignalSentence(strengths, risks)}`,
    market_creation_risk: (strengths: string[], risks: string[]) =>
      `Customers may not recognize the problem yet, so adoption depends on behavior change. ${formatSignalSentence(strengths, risks)}`,
    validation_gap: (strengths: string[], risks: string[]) =>
      `The opportunity has some real signal, but direct evidence is still thin. ${formatSignalSentence(strengths, risks)}`,
    execution_risk: (strengths: string[], risks: string[]) =>
      `The problem looks real enough to pursue, but success will depend on execution quality. ${formatSignalSentence(strengths, risks)}`,
    incumbent_displacement_risk: (strengths: string[], risks: string[]) =>
      `The market may be worth pursuing, but strong incumbents raise switching difficulty. ${formatSignalSentence(strengths, risks)}`,
    wedge_clarity_risk: (strengths: string[], risks: string[]) =>
      `The signal is more credible than the positioning. Refining the initial wedge should improve learning speed. ${formatSignalSentence(strengths, risks)}`,
    hit_driven_risk: (strengths: string[], risks: string[]) =>
      `There may be some interest here, but the value case still looks too soft or episodic. ${formatSignalSentence(strengths, risks)}`,
    timing_window_risk: (strengths: string[], risks: string[]) =>
      `Timing may be favorable, but stronger evidence is needed before leaning into the window. ${formatSignalSentence(strengths, risks)}`,
  } satisfies Record<PrimaryRisk, (strengths: string[], risks: string[]) => string>,
  recommendationTemplates: {
    weak_demand: {
      title: 'Reconsider the opportunity',
      detail: 'Demand is not yet strong enough to justify building as currently framed.',
    },
    market_creation_risk: {
      title: 'Validate the behavior-change assumption',
      detail:
        'Test whether users can be educated into a new workflow before committing to a product.',
    },
    validation_gap: {
      title: 'Gather stronger validation evidence',
      detail: 'Prioritize direct customer proof before moving into build mode.',
    },
    execution_risk: {
      title: 'Build a focused MVP test',
      detail: 'The main challenge is execution, so keep the first test narrow and measurable.',
    },
    incumbent_displacement_risk: {
      title: 'Refine the wedge against incumbents',
      detail: 'Narrow the use case and sharpen the advantage that makes switching worthwhile.',
    },
    wedge_clarity_risk: {
      title: 'Refine the target customer and problem wedge',
      detail: 'A narrower starting point should make validation and positioning easier.',
    },
    hit_driven_risk: {
      title: 'Validate the economic case',
      detail: 'Confirm that the pain is valuable enough to trigger action or spend.',
    },
    timing_window_risk: {
      title: 'Move quickly, but validate first',
      detail: 'Use the timing tailwind, but ground the next step in real customer evidence.',
    },
  } satisfies Record<PrimaryRisk, { title: string; detail: string }>,
  nextFocusTemplates: {
    weak_demand: {
      title: 'Reconsider the problem choice',
      detail: 'Look for a more urgent or more frequently felt problem before proceeding.',
    },
    market_creation_risk: {
      title: 'Test behavior change',
      detail: 'Focus on whether users can adopt a new mindset or workflow around this pain.',
    },
    validation_gap: {
      title: 'Collect direct validation',
      detail: 'Run interviews, commitments, or pre-sales that produce behavioral proof.',
    },
    execution_risk: {
      title: 'Validate before scaling build effort',
      detail: 'Keep the MVP narrow and measure whether usage confirms the opportunity.',
    },
    incumbent_displacement_risk: {
      title: 'Refine the wedge',
      detail: 'Target a narrower segment or sharper problem where incumbents are weakest.',
    },
    wedge_clarity_risk: {
      title: 'Refine the initial wedge',
      detail: 'Clarify exactly who feels the problem most and where the first win should land.',
    },
    hit_driven_risk: {
      title: 'Validate value and urgency',
      detail: 'Test whether the pain leads to real action, budget, or repeated demand.',
    },
    timing_window_risk: {
      title: 'Turn timing into evidence',
      detail: 'Use the current shift to collect proof that this is a real opportunity now.',
    },
  } satisfies Record<PrimaryRisk, { title: string; detail: string }>,
  confidenceTemplates: {
    low: 'Confidence is low because direct validation evidence is still minimal.',
    medium: 'Confidence is moderate because some signals are positive, but proof is incomplete.',
    high: 'Confidence is high because the current answers include strong direct validation.',
  } satisfies Record<ConfidenceLevel, string>,
}

export function adjust(value: Level, delta: -1 | 0 | 1): Level {
  const next = value + delta
  if (next <= 0) return 0
  if (next >= 2) return 2
  return next as Level
}

function getAnswerLevel(
  answers: AnswersMap,
  questionId: QuestionId,
  optionLevels: OptionLevelMap
): Level {
  const selected = answers[questionId]
  if (!selected) return 0
  return optionLevels[selected] ?? 0
}

function levelToDelta(level: Level): -1 | 0 | 1 {
  if (level === 2) return 1
  if (level === 0) return -1
  return 0
}

function getOverallAssessment(
  diagnosis: Diagnosis,
  primaryRisk: PrimaryRisk
): ResultBlueprint['overallAssessment'] {
  if (primaryRisk === 'weak_demand' || primaryRisk === 'market_creation_risk') {
    return 'weak'
  }

  if (
    primaryRisk === 'validation_gap' ||
    primaryRisk === 'incumbent_displacement_risk' ||
    primaryRisk === 'wedge_clarity_risk' ||
    primaryRisk === 'hit_driven_risk'
  ) {
    return 'emerging'
  }

  if (primaryRisk === 'execution_risk' || primaryRisk === 'timing_window_risk') {
    return diagnosis.demandStrength === 2 ? 'strong' : 'emerging'
  }

  if (diagnosis.demandStrength === 0) return 'weak'
  return 'emerging'
}

function uniqueSignals(signals: SignalKey[]) {
  return Array.from(new Set(signals))
}

function formatSignalSentence(strengths: string[], risks: string[]) {
  if (strengths.length > 0 && risks.length > 0) {
    return `Positive signals include ${joinLabels(strengths)}, while risks include ${joinLabels(risks)}.`
  }
  if (strengths.length > 0) {
    return `Positive signals include ${joinLabels(strengths)}.`
  }
  if (risks.length > 0) {
    return `Main risks include ${joinLabels(risks)}.`
  }
  return 'The current answer set is still limited.'
}

function joinLabels(labels: string[]) {
  if (labels.length === 0) return ''
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels[0]}, ${labels[1]}, and ${labels[2]}`
}

function prioritizeStrengths(candidates: SignalKey[]) {
  const set = new Set(candidates)
  return STRENGTH_PRIORITY.filter((signal) => set.has(signal))
}

function dedupeRisks(risks: SignalKey[], preferredPrimary?: SignalKey) {
  let next = uniqueSignals(risks)

  if (next.includes('weak_customer_action') && next.includes('market_does_not_recognize_problem')) {
    const keepUnrecognized = preferredPrimary === 'market_does_not_recognize_problem'
    next = next.filter((signal) =>
      keepUnrecognized
        ? signal !== 'weak_customer_action'
        : signal !== 'market_does_not_recognize_problem'
    )
  }

  if (next.includes('good_enough_existing_solutions') && next.includes('strong_incumbents')) {
    const keepStrongIncumbents = preferredPrimary === 'strong_incumbents'
    next = next.filter((signal) =>
      keepStrongIncumbents
        ? signal !== 'good_enough_existing_solutions'
        : signal !== 'strong_incumbents'
    )
  }

  return next
}

function prioritizeRisks(candidates: SignalKey[], primaryRisk: PrimaryRisk) {
  const primarySignal = PRIMARY_RISK_SIGNAL[primaryRisk]
  const deduped = dedupeRisks(candidates, primarySignal)
  const ordered = uniqueSignals(deduped)
  const set = new Set(ordered)
  const prioritized = RISK_PRIORITY.filter((signal) => set.has(signal))

  if (primarySignal && set.has(primarySignal)) {
    return [primarySignal, ...prioritized.filter((signal) => signal !== primarySignal)]
  }

  return prioritized
}

function buildDemandStrength(answers: AnswersMap, validationDepth: Level): Level {
  let demand = getAnswerLevel(answers, 'customerBehavior', DEMAND_BASE_LEVELS.customerBehavior)
  demand = adjust(
    demand,
    levelToDelta(getAnswerLevel(answers, 'currentBehavior', DEMAND_MODIFIER_LEVELS.currentBehavior))
  )
  demand = adjust(demand, levelToDelta(validationDepth))

  if (validationDepth === 0 && demand === 2) {
    return 1
  }

  return demand
}

function buildUrgency(answers: AnswersMap, demandStrength: Level, economicImpact: Level): Level {
  let urgency = getAnswerLevel(answers, 'problemSeverity', URGENCY_BASE_LEVELS.problemSeverity)
  urgency = adjust(urgency, levelToDelta(economicImpact))
  urgency = adjust(
    urgency,
    levelToDelta(getAnswerLevel(answers, 'customerBehavior', DEMAND_BASE_LEVELS.customerBehavior))
  )

  if (demandStrength === 0 && urgency === 2) {
    return 1
  }

  return urgency
}

function buildIncumbentStrength(answers: AnswersMap): Level {
  let incumbentStrength = getAnswerLevel(
    answers,
    'currentBehavior',
    INCUMBENT_BASE_LEVELS.currentBehavior
  )
  const solutionGapOptionId = answers.solutionGap
  const modifier = solutionGapOptionId ? (SOLUTION_GAP_MODIFIERS[solutionGapOptionId] ?? 0) : 0
  incumbentStrength = adjust(incumbentStrength, modifier)
  return incumbentStrength
}

export function buildDiagnosis(
  answers: AnswersMap,
  confidenceByQuestion?: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): Diagnosis {
  void confidenceByQuestion

  const frequency = getAnswerLevel(answers, 'problemFrequency', DIRECT_LEVELS.problemFrequency)
  const economicImpact = getAnswerLevel(answers, 'economicImpact', DIRECT_LEVELS.economicImpact)
  const timingTailwind = getAnswerLevel(answers, 'whyNow', DIRECT_LEVELS.whyNow)
  const audienceClarity = getAnswerLevel(answers, 'icpClarity', DIRECT_LEVELS.icpClarity)
  const validationDepth = getAnswerLevel(
    answers,
    'validationEvidence',
    DIRECT_LEVELS.validationEvidence
  )

  const demandStrength = buildDemandStrength(answers, validationDepth)
  const urgency = buildUrgency(answers, demandStrength, economicImpact)
  const incumbentStrength = buildIncumbentStrength(answers)

  return {
    demandStrength,
    urgency,
    frequency,
    economicImpact,
    incumbentStrength,
    validationDepth,
    timingTailwind,
    audienceClarity,
  }
}

export function getPrimaryRisk(d: Diagnosis, answers: AnswersMap): PrimaryRisk {
  if (
    answers.customerBehavior === 'not_aware' &&
    d.demandStrength === 0 &&
    d.timingTailwind < 2 &&
    d.audienceClarity <= 1
  ) {
    return 'market_creation_risk'
  }

  if (d.demandStrength === 0) return 'weak_demand'

  if (d.timingTailwind === 2 && d.demandStrength >= 1 && d.validationDepth <= 1) {
    return 'timing_window_risk'
  }

  if (d.incumbentStrength === 2 && d.demandStrength >= 1) {
    return 'incumbent_displacement_risk'
  }

  if (d.audienceClarity === 0 && d.demandStrength >= 1) {
    return 'wedge_clarity_risk'
  }

  if (d.urgency === 0 && d.economicImpact === 0 && d.demandStrength >= 1) {
    return 'hit_driven_risk'
  }

  if (d.demandStrength >= 1 && d.validationDepth === 0) {
    return 'validation_gap'
  }

  if (
    d.demandStrength === 2 &&
    d.urgency >= 1 &&
    d.incumbentStrength <= 1 &&
    d.validationDepth >= 1
  ) {
    return 'execution_risk'
  }

  return 'validation_gap'
}

export function getRecommendationType(risk: PrimaryRisk): RecommendationType {
  if (risk === 'weak_demand') return 'reconsider'
  if (risk === 'market_creation_risk') return 'reconsider'
  if (risk === 'validation_gap') return 'validate'
  if (risk === 'hit_driven_risk') return 'validate'
  if (risk === 'incumbent_displacement_risk') return 'refine'
  if (risk === 'wedge_clarity_risk') return 'refine'
  if (risk === 'execution_risk') return 'build'
  if (risk === 'timing_window_risk') return 'build'
  return 'build'
}

export function getNextFocusType(risk: PrimaryRisk): NextFocusType {
  if (risk === 'weak_demand') return 'reconsider'
  if (risk === 'market_creation_risk') return 'behavior_change'
  if (risk === 'validation_gap') return 'validate'
  if (risk === 'execution_risk') return 'validate'
  if (risk === 'hit_driven_risk') return 'validate'
  if (risk === 'timing_window_risk') return 'validate'
  if (risk === 'incumbent_displacement_risk') return 'refine_problem'
  return 'refine_problem'
}

export function interpretAnswers(
  answers: AnswersMap,
  confidenceByQuestion?: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): InterpretationResult {
  const diagnosis = buildDiagnosis(answers, confidenceByQuestion)
  const primaryRisk = getPrimaryRisk(diagnosis, answers)

  return {
    diagnosis,
    primaryRisk,
    recommendationType: getRecommendationType(primaryRisk),
    nextFocusType: getNextFocusType(primaryRisk),
  }
}

export function selectSignals(
  diagnosis: Diagnosis,
  answers: AnswersMap,
  primaryRisk: PrimaryRisk
): {
  strengths: SignalKey[]
  risks: SignalKey[]
} {
  const strengthCandidates: SignalKey[] = []
  const riskCandidates: SignalKey[] = []

  if (diagnosis.demandStrength === 2) strengthCandidates.push('active_customer_behavior')
  if (answers.currentBehavior === 'paying_competitor') {
    strengthCandidates.push('customers_paying_existing_solutions')
  }
  if (diagnosis.economicImpact === 2) strengthCandidates.push('clear_economic_impact')
  if (diagnosis.frequency === 2) strengthCandidates.push('high_problem_frequency')
  if (diagnosis.audienceClarity === 2) strengthCandidates.push('specific_target_customer')
  if (diagnosis.timingTailwind === 2) strengthCandidates.push('strong_timing_tailwind')
  if (answers.solutionGap === 'clearly_inadequate') strengthCandidates.push('clear_solution_gap')

  if (diagnosis.validationDepth === 0) riskCandidates.push('limited_validation')
  if (diagnosis.demandStrength === 0) riskCandidates.push('weak_customer_action')
  if (diagnosis.urgency === 0) riskCandidates.push('low_urgency')
  if (diagnosis.frequency === 0) riskCandidates.push('low_frequency')
  if (diagnosis.economicImpact === 0) riskCandidates.push('unclear_economic_impact')
  if (diagnosis.audienceClarity === 0) riskCandidates.push('broad_target_audience')
  if (answers.solutionGap === 'good_enough') {
    riskCandidates.push('good_enough_existing_solutions')
  }
  if (diagnosis.incumbentStrength === 2) riskCandidates.push('strong_incumbents')
  if (diagnosis.timingTailwind === 0) riskCandidates.push('weak_timing_signal')
  if (answers.customerBehavior === 'not_aware') {
    riskCandidates.push('market_does_not_recognize_problem')
  }

  const primarySignal = PRIMARY_RISK_SIGNAL[primaryRisk]
  if (primarySignal && !riskCandidates.includes(primarySignal)) {
    riskCandidates.push(primarySignal)
  }

  const overallAssessment = getOverallAssessment(diagnosis, primaryRisk)
  const strengths = prioritizeStrengths(strengthCandidates)
  const risks = prioritizeRisks(riskCandidates, primaryRisk)

  if (overallAssessment === 'strong') {
    return { strengths: strengths.slice(0, 3), risks: [] }
  }

  if (overallAssessment === 'weak') {
    return { strengths: [], risks: risks.slice(0, 3) }
  }

  if (strengths.length === 0) {
    return {
      strengths: [],
      risks: risks.slice(0, 3),
    }
  }

  if (risks.length === 1 && strengths.length >= 2) {
    return {
      strengths: strengths.slice(0, 2),
      risks: risks.slice(0, 1),
    }
  }

  return {
    strengths: strengths.slice(0, 1),
    risks: risks.slice(0, 2),
  }
}

export function buildResultBlueprint(
  interpretation: InterpretationResult,
  answers: AnswersMap,
  confidenceByQuestion?: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): ResultBlueprint {
  // TODO: incorporate per-question confidence into diagnosis / confidence level
  void confidenceByQuestion

  const overallAssessment = getOverallAssessment(
    interpretation.diagnosis,
    interpretation.primaryRisk
  )
  const selectedSignals = selectSignals(
    interpretation.diagnosis,
    answers,
    interpretation.primaryRisk
  )

  let confidenceLevel: ConfidenceLevel = 'medium'
  if (interpretation.diagnosis.validationDepth === 0) confidenceLevel = 'low'
  if (interpretation.diagnosis.validationDepth === 2) confidenceLevel = 'high'

  return {
    overallAssessment,
    primaryRisk: interpretation.primaryRisk,
    selectedStrengths: selectedSignals.strengths,
    selectedRisks: selectedSignals.risks,
    recommendationType: interpretation.recommendationType,
    recommendationKey: interpretation.primaryRisk,
    nextFocusType: interpretation.nextFocusType,
    nextFocusKey: interpretation.primaryRisk,
    confidenceLevel,
  }
}

export function buildResultOutput(blueprint: ResultBlueprint): ResultOutput {
  const strengthLabels = blueprint.selectedStrengths.map((signal) => SIGNAL_LABELS[signal])
  const riskLabels = blueprint.selectedRisks.map((signal) => SIGNAL_LABELS[signal])

  const strengthSignals = strengthLabels.map((label) => ({
    label,
    type: 'positive' as const,
  }))

  const riskSignals = riskLabels.map((label) => ({
    label,
    type: 'negative' as const,
  }))

  const allSignals = [...riskSignals, ...strengthSignals].slice(0, 3)
  const recommendation = COPY_BANK.recommendationTemplates[blueprint.recommendationKey]
  const nextFocus = COPY_BANK.nextFocusTemplates[blueprint.nextFocusKey]

  return {
    overallAssessment: blueprint.overallAssessment,
    summary: COPY_BANK.summaryTemplates[blueprint.overallAssessment][blueprint.primaryRisk],
    detail: COPY_BANK.detailTemplates[blueprint.primaryRisk](strengthLabels, riskLabels),
    signals: allSignals,
    recommendation: {
      title: recommendation.title,
      detail: recommendation.detail,
    },
    nextFocus: {
      title: nextFocus.title,
      detail: nextFocus.detail,
    },
    confidence: {
      level: blueprint.confidenceLevel,
      explanation: COPY_BANK.confidenceTemplates[blueprint.confidenceLevel],
    },
  }
}

export function analyzeProblem(
  answers: AnswersMap,
  confidenceByQuestion?: Partial<Record<QuestionId, QuestionConfidenceLevel>>
): ResultOutput {
  const interpretation = interpretAnswers(answers, confidenceByQuestion)
  const blueprint = buildResultBlueprint(interpretation, answers, confidenceByQuestion)
  return buildResultOutput(blueprint)
}
