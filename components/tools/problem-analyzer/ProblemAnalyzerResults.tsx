'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'

import ResultHeadline from '@/components/tools/problem-analyzer/ResultHeadline'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from '@/components/ui/Popover'
import ProgressBar from '@/components/ui/ProgressBar'
import ShareButton from '@/components/ui/ShareButton'
import SignalPill from '@/components/ui/SignalPill'
import type {
  Insight,
  InsightType,
  ResultOutput,
  SignalKey,
} from '@/lib/problem-analyzer/v2/interpreter'
import type { ProblemAnalyzerAiOutput } from '@/lib/problem-analyzer/v2/ai/schema'
import type { AnswersMap } from '@/lib/problem-analyzer/score'

type ProblemAnalyzerResultsProps = {
  problemText: string
  audienceText?: string
  output: ResultOutput
  answers: AnswersMap
}

type InsightSectionProps = {
  title: string
  context: string
  insights: Insight[]
  type: InsightType
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  openCardRequest: OpenCardRequest
}

type InsightCardProps = {
  insight: Insight
  type: InsightType
  openRequestSequence: number
  idPrefix?: string
}

type InsightAccordionBlockProps = {
  title: string
  children: ReactNode
  openRequestSequence: number
}

type OpenCardRequest = {
  insightId: string | null
  sequence: number
}

type InsightSortMode = 'question_asc' | 'question_desc' | 'strongest_first' | 'weakest_first'

const INSIGHT_SORT_LABELS: Record<InsightSortMode, string> = {
  question_asc: 'Question order',
  question_desc: 'Question order desc',
  strongest_first: 'Strongest first',
  weakest_first: 'Weakest first',
}

const INSIGHT_SORT_OPTIONS: Array<{ value: InsightSortMode; label: string }> = [
  { value: 'strongest_first', label: 'Strongest to weakest' },
  { value: 'weakest_first', label: 'Weakest to strongest' },
  { value: 'question_asc', label: 'Question order asc' },
  { value: 'question_desc', label: 'Question order desc' },
]

function getInsightsByIds(insights: Insight[], ids: string[]): Insight[] {
  const insightById = new Map(insights.map((insight) => [insight.id, insight]))
  return ids
    .map((id) => insightById.get(id))
    .filter((insight): insight is Insight => Boolean(insight))
}

function getInsightStrengthRank(type: InsightType) {
  if (type === 'strength') return 0
  if (type === 'neutral') return 1
  return 2
}

function getInsightWeaknessRank(type: InsightType) {
  if (type === 'weakness') return 0
  if (type === 'neutral') return 1
  return 2
}

function sortInsights(insights: Insight[], sortMode: InsightSortMode): Insight[] {
  return [...insights].sort((a, b) => {
    if (sortMode === 'question_desc') {
      return b.questionOrder - a.questionOrder
    }

    if (sortMode === 'strongest_first') {
      const rankDelta = getInsightStrengthRank(a.type) - getInsightStrengthRank(b.type)
      if (rankDelta !== 0) return rankDelta
      return a.questionOrder - b.questionOrder
    }

    if (sortMode === 'weakest_first') {
      const rankDelta = getInsightWeaknessRank(a.type) - getInsightWeaknessRank(b.type)
      if (rankDelta !== 0) return rankDelta
      return a.questionOrder - b.questionOrder
    }

    return a.questionOrder - b.questionOrder
  })
}

function InsightSection({
  title,
  context,
  insights,
  type,
  isOpen,
  onOpenChange,
  openCardRequest,
}: InsightSectionProps) {
  if (insights.length === 0) {
    return null
  }

  return (
    <section className="border-border border-b py-5">
      <button
        type="button"
        aria-expanded={isOpen}
        className="focus-visible:outline-accent flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => onOpenChange(!isOpen)}
      >
        <h2 className="text-h4 text-heading">{title}</h2>
        <Icon
          name={isOpen ? 'caretDown' : 'caretRight'}
          size="large"
          className="text-heading shrink-0"
        />
      </button>

      {isOpen ? (
        <div className="mt-2 space-y-6">
          <p className="text-body-sm text-body">{context}</p>
          <div className="space-y-6">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                type={type}
                openRequestSequence={
                  openCardRequest.insightId === insight.id ? openCardRequest.sequence : 0
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function InsightCard({
  insight,
  type,
  openRequestSequence,
  idPrefix = 'insight',
}: InsightCardProps) {
  const isWeakness = type === 'weakness'
  const borderClassName =
    type === 'weakness'
      ? 'border-danger-border'
      : type === 'neutral'
        ? 'border-warning-border'
        : 'border-success-border'
  const titleClassName =
    type === 'weakness' ? 'text-danger' : type === 'neutral' ? 'text-warning' : 'text-success'

  return (
    <article
      id={`${idPrefix}-${insight.id}`}
      className={`${borderClassName} scroll-mt-6 rounded-xl border p-6`}
    >
      <div className="space-y-4">
        <header className="border-border space-y-2 border-b pb-4">
          <h3 className={`text-h4 ${titleClassName}`}>{insight.title}</h3>
          <p className="text-body-sm text-body">{insight.summary}</p>
        </header>

        <InsightAccordionBlock title="Question details" openRequestSequence={openRequestSequence}>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-body-xs text-muted">{insight.question}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-eyebrow text-heading">Your answer</h4>
              <p className="text-body-xs text-muted">{insight.answer}</p>
            </div>
          </div>
        </InsightAccordionBlock>

        <InsightAccordionBlock title="Why it matters" openRequestSequence={openRequestSequence}>
          <div className="space-y-2">
            <p className="text-body-sm text-body">{insight.whyItMatters}</p>
          </div>
        </InsightAccordionBlock>

        {isWeakness && insight.nextFocus ? (
          <div className="border-border space-y-2 border-b pb-4">
            <h4 className="text-eyebrow text-heading">What to validate next</h4>
            <p className="text-body-sm text-body">{insight.nextFocus}</p>
          </div>
        ) : null}
      </div>
    </article>
  )
}

function AllInsightsSection({ insights }: { insights: Insight[] }) {
  const [sortMode, setSortMode] = useState<InsightSortMode>('question_asc')
  const sortedInsights = useMemo(() => sortInsights(insights, sortMode), [insights, sortMode])

  if (insights.length === 0) {
    return null
  }

  return (
    <section className="border-border border-b py-5">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-h4 text-heading">All Insights</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">Sort: {INSIGHT_SORT_LABELS[sortMode]}</Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              {INSIGHT_SORT_OPTIONS.map((option) => (
                <PopoverItem
                  key={option.value}
                  selected={sortMode === option.value}
                  onClick={() => setSortMode(option.value)}
                >
                  {option.label}
                </PopoverItem>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-6">
          {sortedInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              type={insight.type}
              openRequestSequence={0}
              idPrefix="all-insight"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function InsightAccordionBlock({
  title,
  children,
  openRequestSequence,
}: InsightAccordionBlockProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (openRequestSequence > 0) {
      setIsOpen(true)
    }
  }, [openRequestSequence])

  return (
    <div className="border-border border-b pb-4">
      <button
        type="button"
        aria-expanded={isOpen}
        className="focus-visible:outline-accent flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="text-eyebrow text-heading">{title}</span>
        <Icon
          name={isOpen ? 'caretDown' : 'caretRight'}
          className="text-heading shrink-0"
          style={{ height: 18, width: 18 }}
        />
      </button>

      {isOpen ? <div className="mt-2">{children}</div> : null}
    </div>
  )
}

export default function ProblemAnalyzerResults({
  problemText,
  audienceText,
  output,
  answers,
}: ProblemAnalyzerResultsProps) {
  const [aiOutput, setAiOutput] = useState<ProblemAnalyzerAiOutput | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [weaknessesOpen, setWeaknessesOpen] = useState(true)
  const [strengthsOpen, setStrengthsOpen] = useState(true)
  const [openCardRequest, setOpenCardRequest] = useState<OpenCardRequest>({
    insightId: null,
    sequence: 0,
  })

  const aiNextFocusByInsightId = useMemo(() => {
    return new Map(
      aiOutput?.insightValidationGuidance.map((item) => [item.insightId, item.nextFocus]) ?? []
    )
  }, [aiOutput])

  const enhancedInsights = useMemo(() => {
    return output.insights.map((insight) => {
      const aiNextFocus = aiNextFocusByInsightId.get(insight.id)

      if (!aiNextFocus) {
        return insight
      }

      return {
        ...insight,
        nextFocus: aiNextFocus,
      }
    })
  }, [output.insights, aiNextFocusByInsightId])

  const keyWeaknesses = getInsightsByIds(enhancedInsights, output.keyWeaknessIds)
  const keyStrengths = getInsightsByIds(enhancedInsights, output.keyStrengthIds)

  const insightBySignalKey = useMemo(() => {
    const visibleInsights = [...keyWeaknesses, ...keyStrengths]
    return new Map<SignalKey, Insight>(
      visibleInsights.map((insight) => [insight.signalKey, insight])
    )
  }, [keyWeaknesses, keyStrengths])

  useEffect(() => {
    let cancelled = false

    async function loadAiAnalysis() {
      setAiLoading(true)

      try {
        const response = await fetch('/api/problem-analyzer/ai-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemText,
            audienceText,
            answers,
          }),
        })

        const data = await response.json()

        if (!cancelled && data.aiOutput) {
          setAiOutput(data.aiOutput)
        }
      } catch (error) {
        console.error('[load-ai-analysis]', error)
      } finally {
        if (!cancelled) setAiLoading(false)
      }
    }

    loadAiAnalysis()

    return () => {
      cancelled = true
    }
  }, [problemText, audienceText, output, answers])

  useEffect(() => {
    if (!openCardRequest.insightId) {
      return
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      document
        .getElementById(`insight-${openCardRequest.insightId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    return () => window.cancelAnimationFrame(animationFrameId)
  }, [openCardRequest])

  function handleSignalClick(insight: Insight) {
    if (insight.type === 'weakness') {
      setWeaknessesOpen(true)
    } else {
      setStrengthsOpen(true)
    }

    setOpenCardRequest((current) => ({
      insightId: insight.id,
      sequence: current.sequence + 1,
    }))
  }

  return (
    <div className="surface-card">
      <section className="border-border border-b py-5">
        <div className="space-y-3">
          <div className="space-y-4">
            <div className="flex w-full items-end justify-between gap-3">
              <h2 className="text-eyebrow text-body">Problem</h2>
              <ShareButton />
            </div>
            <div className="space-y-3">
              <p className="text-body-xs text-muted">
                {problemText || 'No problem statement provided.'}
              </p>
              {audienceText ? (
                <div className="space-y-1">
                  <h3 className="text-eyebrow text-body">Audience</h3>
                  <p className="text-body-xs text-muted">{audienceText}</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <ResultHeadline tone={output.overallAssessment}>
                {aiOutput?.summary ?? output.summary}
              </ResultHeadline>
              <ProgressBar tone={output.overallAssessment} />
            </div>
            <p className="text-body-md text-heading">
              {aiLoading ? 'Generating analysis...' : (aiOutput?.detail ?? output.detail)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-border border-b py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Key signals</h2>
          <div className="flex flex-wrap gap-2">
            {output.signals.map((signal) =>
              (() => {
                const targetInsight = insightBySignalKey.get(signal.signalKey)
                const hoverClassName =
                  signal.type === 'positive' ? 'hover:bg-success-bg' : 'hover:bg-danger-bg'

                if (!targetInsight) {
                  return (
                    <SignalPill
                      key={`${signal.signalKey}-${signal.type}`}
                      label={signal.label}
                      variant={signal.type}
                    />
                  )
                }

                return (
                  <SignalPill
                    key={`${signal.signalKey}-${signal.type}`}
                    as="button"
                    aria-label={`View details for ${signal.label}`}
                    className={`focus-visible:outline-accent cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${hoverClassName}`}
                    label={signal.label}
                    variant={signal.type}
                    onClick={() => handleSignalClick(targetInsight)}
                  />
                )
              })()
            )}
          </div>
        </div>
      </section>

      <section className="border-border border-b py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Recommendation</h2>
          <h3 className="text-h4 text-heading">
            {aiOutput?.recommendation.title ?? output.recommendation.title}
          </h3>
          <p className="text-body-sm text-body">
            {aiLoading
              ? 'Generating recommendation...'
              : (aiOutput?.recommendation.detail ?? output.recommendation.detail)}
          </p>
        </div>
      </section>

      <section className="border-border border-b py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Next Focus</h2>
          <h3 className="text-h4 text-heading">
            {aiOutput?.nextFocus.title ?? output.nextFocus.title}
          </h3>
          <p className="text-body-sm text-body">
            {aiOutput?.nextFocus.detail ?? output.nextFocus.detail}
          </p>
        </div>
      </section>

      <InsightSection
        title="Key Weaknesses"
        context="Your responses highlighted areas that may need further validation."
        insights={keyWeaknesses}
        type="weakness"
        isOpen={weaknessesOpen}
        onOpenChange={setWeaknessesOpen}
        openCardRequest={openCardRequest}
      />

      <InsightSection
        title="Key Strengths"
        context="Your responses highlighted positive signals worth building on."
        insights={keyStrengths}
        type="strength"
        isOpen={strengthsOpen}
        onOpenChange={setStrengthsOpen}
        openCardRequest={openCardRequest}
      />

      <AllInsightsSection insights={enhancedInsights} />

      {/* Hidden confidence section for now but left in case I want to reintroduce in future */}
      {/* <section className="py-5">
        <div className="space-y-4">
          <h2 className="text-eyebrow text-body">Confidence</h2>
          <p className="text-h4 text-heading capitalize">
  {aiOutput?.confidence.level ?? output.confidence.level}
</p>
          <p className="text-body-sm text-body">
  {aiOutput?.confidence.explanation ?? output.confidence.explanation}
</p>
        </div>
      </section> */}
    </div>
  )
}
