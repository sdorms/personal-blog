'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation'
import QuestionCard from '@/components/tools/problem-analyzer/QuestionCard'
import ResultsPanel, { type ResultModel } from '@/components/tools/problem-analyzer/ResultsPanel'
import {
  PROBLEM_ANALYZER_SCHEMA,
  type OptionId,
  type QuestionId,
} from '@/lib/problem-analyzer/schema'
import { buildResultsViewModel, scoreAnswers, type AnswersMap } from '@/lib/problem-analyzer/score'

type Confidence = 'high' | 'med' | 'low' | 'vlow'

const CONF_OPTIONS: { value: Confidence; label: string }[] = [
  { value: 'high', label: 'High confidence' },
  { value: 'med', label: 'Medium confidence' },
  { value: 'low', label: 'Low confidence' },
  { value: 'vlow', label: 'Very low confidence' },
]

const FIRST_SCREEN_ID = PROBLEM_ANALYZER_SCHEMA.screens[0]?.id ?? 'problem'
const SCREEN_CONFIDENCE = 'confidence'
const SCREEN_RESULTS = 'results'
const TOOL_OWNED_BASE_KEYS = ['problem', 'conf', 'uncertain', 'screen'] as const
const ALLOWED_QUESTION_IDS = new Set(Object.keys(PROBLEM_ANALYZER_SCHEMA.questions))
const ALLOWED_SCREENS = new Set<string>([
  ...PROBLEM_ANALYZER_SCHEMA.screens.map((screen) => screen.id),
  SCREEN_CONFIDENCE,
  SCREEN_RESULTS,
])

function parseConfidence(value: string | null): Confidence {
  if (value === 'high' || value === 'med' || value === 'low' || value === 'vlow') return value
  return 'med'
}

function parseAnswersFromParams(params: ReadonlyURLSearchParams | URLSearchParams): AnswersMap {
  const answers: AnswersMap = {}

  for (const question of Object.values(PROBLEM_ANALYZER_SCHEMA.questions)) {
    const value = params.get(`q_${question.id}`)
    const isValid = question.options.some((opt) => opt.id === value)
    if (value && isValid) {
      answers[question.id] = value
    }
  }

  return answers
}

function parseUncertainFromParams(params: ReadonlyURLSearchParams | URLSearchParams): QuestionId[] {
  const raw = params.get('uncertain')
  if (!raw) return []
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter((id): id is QuestionId => Boolean(id) && ALLOWED_QUESTION_IDS.has(id))
    .sort()
}

function parseScreenFromParams(params: ReadonlyURLSearchParams | URLSearchParams): string {
  const raw = params.get('screen')
  if (!raw) return FIRST_SCREEN_ID
  return ALLOWED_SCREENS.has(raw) ? raw : FIRST_SCREEN_ID
}

function answersEqual(a: AnswersMap, b: AnswersMap): boolean {
  const questionIds = Object.keys(PROBLEM_ANALYZER_SCHEMA.questions)
  return questionIds.every((id) => a[id] === b[id])
}

function orderedUniqueQuestionIds(ids: QuestionId[]) {
  return Array.from(new Set(ids)).sort()
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

export default function ProblemAnalyzerWizard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [problemText, setProblemText] = useState(() => searchParams.get('problem') ?? '')
  const [answers, setAnswers] = useState<AnswersMap>(() => parseAnswersFromParams(searchParams))
  const [conf, setConf] = useState<Confidence>(() => parseConfidence(searchParams.get('conf')))
  const [uncertain, setUncertain] = useState<QuestionId[]>(() =>
    parseUncertainFromParams(searchParams)
  )
  const [screenId, setScreenId] = useState<string>(() => parseScreenFromParams(searchParams))
  const [debouncedProblemText, setDebouncedProblemText] = useState(problemText)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedProblemText(problemText)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [problemText])

  useEffect(() => {
    const nextProblemText = searchParams.get('problem') ?? ''
    const nextAnswers = parseAnswersFromParams(searchParams)
    const nextConf = parseConfidence(searchParams.get('conf'))
    const nextUncertain = parseUncertainFromParams(searchParams)
    const nextScreenId = parseScreenFromParams(searchParams)

    if (problemText !== nextProblemText) setProblemText(nextProblemText)
    if (debouncedProblemText !== nextProblemText) setDebouncedProblemText(nextProblemText)
    if (!answersEqual(answers, nextAnswers)) setAnswers(nextAnswers)
    if (conf !== nextConf) setConf(nextConf)
    if (!arraysEqual(uncertain, nextUncertain)) setUncertain(nextUncertain)
    if (screenId !== nextScreenId) setScreenId(nextScreenId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString())

    for (const key of TOOL_OWNED_BASE_KEYS) {
      sp.delete(key)
    }

    for (const questionId of Object.keys(PROBLEM_ANALYZER_SCHEMA.questions)) {
      sp.delete(`q_${questionId}`)
    }

    const normalizedProblem = debouncedProblemText.trim()
    if (normalizedProblem) {
      sp.set('problem', normalizedProblem)
    }

    for (const question of Object.values(PROBLEM_ANALYZER_SCHEMA.questions)) {
      const selected = answers[question.id]
      if (selected) {
        sp.set(`q_${question.id}`, selected)
      }
    }

    if (conf === 'med') {
      sp.delete('conf')
    } else {
      sp.set('conf', conf)
    }

    const sortedUncertain = orderedUniqueQuestionIds(uncertain)
    if (sortedUncertain.length > 0) {
      sp.set('uncertain', sortedUncertain.join(','))
    }

    if (screenId !== FIRST_SCREEN_ID) {
      sp.set('screen', screenId)
    } else {
      sp.delete('screen')
    }

    const nextQuery = sp.toString()
    const currentQuery = searchParams.toString()
    if (nextQuery === currentQuery) return
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [answers, conf, debouncedProblemText, pathname, router, screenId, searchParams, uncertain])

  const totalStepsBeforeResults = PROBLEM_ANALYZER_SCHEMA.screens.length + 1
  const currentScreen =
    PROBLEM_ANALYZER_SCHEMA.screens.find((screen) => screen.id === screenId) ?? null
  const currentScreenIndex = currentScreen
    ? PROBLEM_ANALYZER_SCHEMA.screens.findIndex((screen) => screen.id === currentScreen.id)
    : -1
  const isConfidenceStep = screenId === SCREEN_CONFIDENCE
  const isResultsStep = screenId === SCREEN_RESULTS

  const canGoNext = useMemo(() => {
    if (!currentScreen) return false
    const hasAllAnswers = currentScreen.questionIds.every((id) => Boolean(answers[id]))
    if (currentScreen.id === FIRST_SCREEN_ID) {
      return problemText.trim().length > 0 && hasAllAnswers
    }
    return hasAllAnswers
  }, [answers, currentScreen, problemText])

  const canViewResults = isConfidenceStep
  const progressLabel = isResultsStep
    ? 'Results'
    : isConfidenceStep
      ? `Step ${totalStepsBeforeResults} of ${totalStepsBeforeResults}: Confidence`
      : `Step ${currentScreenIndex + 1} of ${totalStepsBeforeResults}: ${currentScreen?.title ?? ''}`

  const scored = useMemo(() => scoreAnswers(answers, PROBLEM_ANALYZER_SCHEMA), [answers])
  const allQuestionIds = useMemo(
    () => Object.keys(PROBLEM_ANALYZER_SCHEMA.questions) as QuestionId[],
    []
  )

  const resultModel: ResultModel = useMemo(() => {
    const baseViewModel = buildResultsViewModel(
      scored,
      PROBLEM_ANALYZER_SCHEMA,
      conf,
      orderedUniqueQuestionIds(uncertain)
    )
    const uncertainTitles = orderedUniqueQuestionIds(uncertain)
      .map((id) => PROBLEM_ANALYZER_SCHEMA.questions[id]?.title)
      .filter((title): title is string => Boolean(title))

    return {
      problemText,
      tier: baseViewModel.tier,
      percent: baseViewModel.percent,
      isComplete: scored.perQuestion.length === allQuestionIds.length,
      strengths: baseViewModel.strengths,
      risksOrConstraints: baseViewModel.risksOrConstraints,
      allInsights: baseViewModel.allInsights,
      bucketCounts: baseViewModel.bucketCounts,
      screenDiagnostics: baseViewModel.screenDiagnostics,
      summaryMessage: baseViewModel.summaryMessage,
      conf,
      uncertainTitles,
      uncertainQuestionIds: orderedUniqueQuestionIds(uncertain),
    }
  }, [allQuestionIds.length, conf, problemText, scored, uncertain])

  const toggleUncertain = (questionId: QuestionId) => {
    setUncertain((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId]
    )
  }

  const onSelectOption = (questionId: QuestionId, optionId: OptionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
  }

  const goToNextScreen = () => {
    if (!currentScreen) return
    const nextIndex = currentScreenIndex + 1
    if (nextIndex >= PROBLEM_ANALYZER_SCHEMA.screens.length) {
      setScreenId(SCREEN_CONFIDENCE)
      return
    }
    setScreenId(PROBLEM_ANALYZER_SCHEMA.screens[nextIndex].id)
  }

  const goToPreviousScreen = () => {
    if (isResultsStep) {
      setScreenId(SCREEN_CONFIDENCE)
      return
    }
    if (isConfidenceStep) {
      const lastSchemaScreen =
        PROBLEM_ANALYZER_SCHEMA.screens[PROBLEM_ANALYZER_SCHEMA.screens.length - 1]
      setScreenId(lastSchemaScreen?.id ?? FIRST_SCREEN_ID)
      return
    }
    if (!currentScreen) {
      setScreenId(FIRST_SCREEN_ID)
      return
    }
    const prevIndex = Math.max(0, currentScreenIndex - 1)
    setScreenId(PROBLEM_ANALYZER_SCHEMA.screens[prevIndex].id)
  }

  const startOver = () => {
    setProblemText('')
    setDebouncedProblemText('')
    setAnswers({})
    setConf('med')
    setUncertain([])
    setScreenId(FIRST_SCREEN_ID)

    const sp = new URLSearchParams(searchParams.toString())
    for (const key of TOOL_OWNED_BASE_KEYS) {
      sp.delete(key)
    }
    for (const questionId of Object.keys(PROBLEM_ANALYZER_SCHEMA.questions)) {
      sp.delete(`q_${questionId}`)
    }

    const nextQuery = sp.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-3xl font-bold tracking-tight">Problem Analyzer</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Scaffold wizard for evaluating problem signal strength. Placeholder copy and schema.
        </p>
        <p className="mt-3 text-xs tracking-wide text-gray-500 uppercase">{progressLabel}</p>
      </div>

      {!isResultsStep ? (
        <div className="space-y-6">
          {currentScreen ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-xl font-semibold">{currentScreen.title}</h2>
              {currentScreen.description ? (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {currentScreen.description}
                </p>
              ) : null}

              {currentScreen.id === FIRST_SCREEN_ID ? (
                <div className="mt-4">
                  <label htmlFor="problemText" className="text-sm font-medium">
                    Problem statement
                  </label>
                  <textarea
                    id="problemText"
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="Describe the problem in one or two sentences..."
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          {currentScreen
            ? currentScreen.questionIds.map((questionId) => {
                const question = PROBLEM_ANALYZER_SCHEMA.questions[questionId]
                return (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => onSelectOption(question.id, value)}
                  />
                )
              })
            : null}

          {isConfidenceStep ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-xl font-semibold">Confidence Check</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Placeholder overlay. Final confidence calibration rules are TODO.
              </p>

              <fieldset className="mt-4">
                <legend className="text-sm font-medium">
                  How confident are you in these answers?
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {CONF_OPTIONS.map((option) => {
                    const checked = conf === option.value
                    return (
                      <label
                        key={option.value}
                        className={[
                          'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm',
                          checked
                            ? 'border-gray-900 bg-gray-100 dark:border-gray-100 dark:bg-gray-900'
                            : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="confidence"
                          checked={checked}
                          onChange={() => setConf(option.value)}
                          className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                        />
                        <span>{option.label}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="text-sm font-medium">Mark uncertain answers (optional)</legend>
                <div className="mt-2 grid gap-2">
                  {Object.values(PROBLEM_ANALYZER_SCHEMA.questions).map((question) => {
                    const checked = uncertain.includes(question.id)
                    return (
                      <label
                        key={question.id}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleUncertain(question.id)}
                          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                        />
                        <span>{question.title}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            </section>
          ) : null}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goToPreviousScreen}
              disabled={screenId === FIRST_SCREEN_ID}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
            >
              Back
            </button>

            {!isConfidenceStep ? (
              <button
                type="button"
                onClick={goToNextScreen}
                disabled={!canGoNext}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-100 dark:text-black"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setScreenId(SCREEN_RESULTS)}
                disabled={!canViewResults}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-100 dark:text-black"
              >
                View results
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ResultsPanel result={resultModel} onProblemTextChange={setProblemText} />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setScreenId(SCREEN_CONFIDENCE)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-700"
            >
              Back to confidence
            </button>
            <button
              type="button"
              onClick={startOver}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-gray-100 dark:text-black"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
