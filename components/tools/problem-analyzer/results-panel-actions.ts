import { PROBLEM_ANALYZER_SCHEMA, type QuestionId } from '@/lib/problem-analyzer/schema'
import type { InsightItem, OverallTier, ScreenDiagnostic } from '@/lib/problem-analyzer/score'

export type ActionCard = {
  title: string
  rationale: string
  resources?: string[]
}

export type RecommendedActionsInput = {
  tier: OverallTier
  conf: 'high' | 'med' | 'low' | 'vlow'
  screenDiagnostics: ScreenDiagnostic[]
  risksOrConstraints: InsightItem[]
  uncertainTitles: string[]
  uncertainQuestionIds: QuestionId[]
}

function getQuestionShortLabel(questionId: QuestionId, fallback: string): string {
  return PROBLEM_ANALYZER_SCHEMA.questions[questionId]?.shortLabel ?? fallback
}

export function buildRecommendedActions(result: RecommendedActionsInput): ActionCard[] {
  const actions: ActionCard[] = []
  const confidenceIsLow = result.conf === 'low' || result.conf === 'vlow'
  const evidenceScreen =
    result.screenDiagnostics.find((screen) => screen.screenId === 'validation') ??
    result.screenDiagnostics.find((screen) => screen.title.toLowerCase().includes('evidence'))

  if (result.tier === 'weak') {
    actions.push({
      title: 'Validate the problem before building',
      rationale:
        'The current signal is weak, so building now is likely premature. Focus first on proving this pain is urgent and recurring for a specific audience.',
      resources: ['The Mom Test'],
    })
  } else if (result.tier === 'mixed') {
    actions.push({
      title: 'Investigate the biggest unknowns',
      rationale:
        'Signal quality is mixed. Prioritize the highest-risk assumptions and resolve them with direct customer evidence before committing to solution scope.',
      resources: ['The Mom Test', 'Sequoia PMF'],
    })
  } else {
    actions.push({
      title: 'Design a lightweight MVP test',
      rationale:
        'Signal quality is strong enough to test solution behavior. Keep the first experiment narrow so you can validate demand with minimal implementation overhead.',
      resources: ['YC Startup School'],
    })
  }

  const topRisk = result.risksOrConstraints[0]
  if (topRisk) {
    const shortLabel = getQuestionShortLabel(topRisk.questionId, topRisk.questionTitle)
    actions.push({
      title: `Validate ${shortLabel}`,
      rationale: `You selected "${topRisk.optionLabel}" for this area. That response indicates elevated risk and should be validated before scaling product or go-to-market decisions.`,
    })
  }

  if (result.uncertainQuestionIds.length > 0 || confidenceIsLow) {
    actions.push({
      title: 'Run structured customer discovery interviews',
      rationale:
        result.uncertainTitles.length > 0
          ? `Uncertainty remains around ${result.uncertainTitles.join(', ')}. This lowers confidence, so use structured interviews to replace assumptions with direct evidence.`
          : 'Current confidence is low. Run structured interviews to tighten assumptions and improve decision quality before building.',
      resources: ['The Mom Test'],
    })
  }

  if (
    evidenceScreen &&
    (evidenceScreen.screenTier === 'mixed' || evidenceScreen.screenTier === 'weak')
  ) {
    actions.push({
      title: 'Collect stronger validation evidence',
      rationale:
        'Evidence quality is not yet strong enough for high-confidence execution. Prioritize stronger proof such as paid pilots, LOIs, or repeated behavioral signals.',
      resources: ['Sequoia PMF'],
    })
  }

  if (result.tier === 'strong' && actions.length < 5) {
    actions.push({
      title: 'Run a simple MVP experiment',
      rationale:
        'You have enough positive signal to run a focused experiment. Define clear success criteria and test one narrow outcome with real users.',
      resources: ['YC Startup School'],
    })
  }

  const fallbackActions: ActionCard[] = [
    {
      title: 'Define success criteria for the next validation cycle',
      rationale:
        'Set explicit pass/fail criteria for your next round of validation so decisions remain evidence-based and comparable across iterations.',
    },
    {
      title: 'Prioritize one high-impact assumption per sprint',
      rationale:
        'Concentrating on a single high-impact unknown each cycle improves learning velocity and reduces execution drift.',
    },
  ]

  for (const fallback of fallbackActions) {
    if (actions.length >= 3) break
    actions.push(fallback)
  }

  return actions.slice(0, 5)
}
