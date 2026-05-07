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
import type { AnswersMap, QuestionConfidenceLevel } from '@/lib/problem-analyzer/score'
import { buildProblemAnalyzerV2Analysis } from '@/lib/problem-analyzer/v2/adapter'

const FIRST_SCREEN_ID = PROBLEM_ANALYZER_SCHEMA.screens[0]?.id ?? 'problem'
const SCREEN_CONFIDENCE = 'confidence'
const SCREEN_RESULTS = 'results'
const TOOL_OWNED_BASE_KEYS = ['problem', 'audience', 'screen'] as const
const ALLOWED_QUESTION_IDS = new Set(Object.keys(PROBLEM_ANALYZER_SCHEMA.questions))
const ALLOWED_SCREENS = new Set<string>([
  ...PROBLEM_ANALYZER_SCHEMA.screens.map((screen) => screen.id),
  SCREEN_CONFIDENCE,
  SCREEN_RESULTS,
])

type MissingSchemaReference = {
  screenId: string
  questionId: QuestionId
}

function findMissingSchemaReferences(): MissingSchemaReference[] {
  const missing: MissingSchemaReference[] = []
  for (const screen of PROBLEM_ANALYZER_SCHEMA.screens) {
    for (const questionId of screen.questionIds) {
      if (!PROBLEM_ANALYZER_SCHEMA.questions[questionId]) {
        missing.push({ screenId: screen.id, questionId })
      }
    }
  }
  return missing
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

function parseConfidenceByQuestion(
  params: ReadonlyURLSearchParams | URLSearchParams
): Partial<Record<QuestionId, QuestionConfidenceLevel>> {
  const map: Partial<Record<QuestionId, QuestionConfidenceLevel>> = {}
  for (const questionId of ALLOWED_QUESTION_IDS) {
    const raw = params.get(`c_${questionId}`)
    if (raw === 'low' || raw === 'med' || raw === 'high') {
      map[questionId] = raw
    }
  }
  return map
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

function confidenceMapsEqual(
  a: Partial<Record<QuestionId, QuestionConfidenceLevel>>,
  b: Partial<Record<QuestionId, QuestionConfidenceLevel>>
) {
  const allIds = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const id of allIds) {
    if (a[id] !== b[id]) return false
  }
  return true
}

export default function ProblemAnalyzerWizard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [problemText, setProblemText] = useState('')
  const [audienceText, setAudienceText] = useState('')
  const [answers, setAnswers] = useState<AnswersMap>({})
  const [confidenceByQuestion, setConfidenceByQuestion] = useState<
    Partial<Record<QuestionId, QuestionConfidenceLevel>>
  >({})
  const [screenId, setScreenId] = useState<string>(FIRST_SCREEN_ID)
  const [debouncedProblemText, setDebouncedProblemText] = useState('')
  const [debouncedAudienceText, setDebouncedAudienceText] = useState('')
  const [attemptedNext, setAttemptedNext] = useState(false)
  const [missingQuestionIds, setMissingQuestionIds] = useState<QuestionId[]>([])
  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const missingRefs = findMissingSchemaReferences()
    for (const ref of missingRefs) {
      console.error(
        `[ProblemAnalyzer] Invalid schema reference: screen "${ref.screenId}" references missing question "${ref.questionId}".`
      )
    }
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedProblemText(problemText)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [problemText])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedAudienceText(audienceText)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [audienceText])

  useEffect(() => {
    const nextProblemText = searchParams.get('problem') ?? ''
    const nextAudienceText = searchParams.get('audience') ?? ''
    const nextAnswers = parseAnswersFromParams(searchParams)
    const nextConfidenceByQuestion = parseConfidenceByQuestion(searchParams)
    const nextScreenId = parseScreenFromParams(searchParams)

    if (problemText !== nextProblemText) setProblemText(nextProblemText)
    if (debouncedProblemText !== nextProblemText) setDebouncedProblemText(nextProblemText)
    if (audienceText !== nextAudienceText) setAudienceText(nextAudienceText)
    if (debouncedAudienceText !== nextAudienceText) setDebouncedAudienceText(nextAudienceText)
    if (!answersEqual(answers, nextAnswers)) setAnswers(nextAnswers)
    if (!confidenceMapsEqual(confidenceByQuestion, nextConfidenceByQuestion)) {
      setConfidenceByQuestion(nextConfidenceByQuestion)
    }
    if (screenId !== nextScreenId) setScreenId(nextScreenId)
    if (!hasHydratedFromUrl) setHasHydratedFromUrl(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydratedFromUrl, searchParams])

  useEffect(() => {
    if (!hasHydratedFromUrl) return
    const currentUrlParams = new URLSearchParams(window.location.search)
    const sp = new URLSearchParams()

    // Preserve unrelated params while fully rewriting tool-owned params.
    for (const [key, value] of currentUrlParams.entries()) {
      const isBaseOwned = TOOL_OWNED_BASE_KEYS.includes(
        key as (typeof TOOL_OWNED_BASE_KEYS)[number]
      )
      const isAnswerOwned = key.startsWith('q_')
      const isConfidenceOwned = key.startsWith('c_')
      if (!isBaseOwned && !isAnswerOwned && !isConfidenceOwned) {
        sp.append(key, value)
      }
    }

    const normalizedProblem = debouncedProblemText.trim()
    if (normalizedProblem) {
      sp.set('problem', normalizedProblem)
    }
    const normalizedAudience = debouncedAudienceText.trim()
    if (normalizedAudience) {
      sp.set('audience', normalizedAudience)
    }

    for (const question of Object.values(PROBLEM_ANALYZER_SCHEMA.questions)) {
      const selected = answers[question.id]
      if (selected) {
        sp.set(`q_${question.id}`, selected)
      }
    }

    for (const questionId of Object.keys(PROBLEM_ANALYZER_SCHEMA.questions)) {
      const level = confidenceByQuestion[questionId]
      if (level) {
        sp.set(`c_${questionId}`, level)
      }
    }

    if (screenId !== FIRST_SCREEN_ID) {
      sp.set('screen', screenId)
    } else {
      sp.delete('screen')
    }

    const nextQuery = sp.toString()
    const currentQuery = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search
    if (nextQuery === currentQuery) return
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }, [
    answers,
    confidenceByQuestion,
    debouncedAudienceText,
    debouncedProblemText,
    hasHydratedFromUrl,
    pathname,
    router,
    screenId,
  ])

  const totalStepsBeforeResults = PROBLEM_ANALYZER_SCHEMA.screens.length + 1
  const currentScreen =
    PROBLEM_ANALYZER_SCHEMA.screens.find((screen) => screen.id === screenId) ?? null
  const currentScreenIndex = currentScreen
    ? PROBLEM_ANALYZER_SCHEMA.screens.findIndex((screen) => screen.id === currentScreen.id)
    : -1
  const isConfidenceStep = screenId === SCREEN_CONFIDENCE
  const isResultsStep = screenId === SCREEN_RESULTS
  const [isHeaderEditing, setIsHeaderEditing] = useState(false)
  const [headerProblemDraft, setHeaderProblemDraft] = useState(problemText)
  const [headerAudienceDraft, setHeaderAudienceDraft] = useState(audienceText)

  const currentMissingQuestionIds = useMemo(() => {
    if (!currentScreen || isConfidenceStep || isResultsStep) return []
    return currentScreen.questionIds.filter((id) => !answers[id])
  }, [answers, currentScreen, isConfidenceStep, isResultsStep])

  const isProblemTextMissing = useMemo(
    () => Boolean(currentScreen && currentScreen.id === FIRST_SCREEN_ID && !problemText.trim()),
    [currentScreen, problemText]
  )
  const isAudienceTextMissing = useMemo(
    () => Boolean(currentScreen && currentScreen.id === FIRST_SCREEN_ID && !audienceText.trim()),
    [audienceText, currentScreen]
  )

  useEffect(() => {
    setAttemptedNext(false)
    setMissingQuestionIds([])
  }, [screenId])

  useEffect(() => {
    if (!attemptedNext) return
    if (currentMissingQuestionIds.length === 0 && !isProblemTextMissing && !isAudienceTextMissing) {
      setAttemptedNext(false)
      setMissingQuestionIds([])
    } else {
      setMissingQuestionIds(currentMissingQuestionIds)
    }
  }, [attemptedNext, currentMissingQuestionIds, isAudienceTextMissing, isProblemTextMissing])

  const canViewResults = isConfidenceStep
  const progressStep = isConfidenceStep
    ? totalStepsBeforeResults
    : Math.max(1, currentScreenIndex + 1)
  const progressPercent = Math.round((progressStep / totalStepsBeforeResults) * 100)
  const headerTitle = isConfidenceStep ? 'Confidence Calibration' : (currentScreen?.title ?? '')
  const headerDescription = isConfidenceStep
    ? 'Review your confidence in each answer.'
    : (currentScreen?.description ?? '')

  useEffect(() => {
    if (!isHeaderEditing) {
      setHeaderProblemDraft(problemText)
      setHeaderAudienceDraft(audienceText)
    }
  }, [audienceText, isHeaderEditing, problemText])

  const resultModel: ResultModel = useMemo(() => {
    return buildProblemAnalyzerV2Analysis({
      problemText,
      audienceText,
      answers,
      confidenceByQuestion,
    })
  }, [answers, audienceText, confidenceByQuestion, problemText])
  const answeredQuestions = useMemo(
    () =>
      Object.values(PROBLEM_ANALYZER_SCHEMA.questions).filter((question) => answers[question.id]),
    [answers]
  )

  const onSelectOption = (questionId: QuestionId, optionId: OptionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
  }

  const goToNextScreen = () => {
    if (!currentScreen) return
    const missing = currentScreen.questionIds.filter((id) => !answers[id])
    const hasProblemTextError = currentScreen.id === FIRST_SCREEN_ID && !problemText.trim()
    const hasAudienceTextError = currentScreen.id === FIRST_SCREEN_ID && !audienceText.trim()

    if (missing.length > 0 || hasProblemTextError || hasAudienceTextError) {
      setAttemptedNext(true)
      setMissingQuestionIds(missing)

      const firstTargetId =
        missing.length > 0
          ? `question-${missing[0]}`
          : hasProblemTextError
            ? 'problemText'
            : 'audienceText'
      const target = document.getElementById(firstTargetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setAttemptedNext(false)
    setMissingQuestionIds([])

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
    setAudienceText('')
    setDebouncedAudienceText('')
    setAnswers({})
    setConfidenceByQuestion({})
    setScreenId(FIRST_SCREEN_ID)

    const sp = new URLSearchParams(searchParams.toString())
    for (const key of TOOL_OWNED_BASE_KEYS) {
      sp.delete(key)
    }
    for (const questionId of Object.keys(PROBLEM_ANALYZER_SCHEMA.questions)) {
      sp.delete(`q_${questionId}`)
      sp.delete(`c_${questionId}`)
    }

    const nextQuery = sp.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }

  const saveHeaderContext = () => {
    setProblemText(headerProblemDraft)
    setAudienceText(headerAudienceDraft)
    setIsHeaderEditing(false)
  }

  const cancelHeaderContextEdit = () => {
    setHeaderProblemDraft(problemText)
    setHeaderAudienceDraft(audienceText)
    setIsHeaderEditing(false)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {!isResultsStep ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h1 className="text-3xl font-bold tracking-tight">Problem Analyzer</h1>

            {screenId === FIRST_SCREEN_ID ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Answer a short set of questions about the problem you want to solve to get a
                structured read on strengths, risks, and what you should validate next.
              </p>
            ) : null}

            {screenId !== FIRST_SCREEN_ID ? (
              <div className="mt-3">
                {!isHeaderEditing ? (
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 text-sm leading-snug text-gray-600 dark:text-gray-400">
                      <p className="break-words">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Problem:
                        </span>{' '}
                        {problemText || 'Not set'}
                      </p>
                      <p className="break-words">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Audience:
                        </span>{' '}
                        {audienceText || 'Not set'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsHeaderEditing(true)}
                      className="cursor-pointer text-xs font-medium text-gray-600 underline hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:text-white dark:focus-visible:ring-gray-400"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="headerProblemText"
                        className="text-xs font-medium text-gray-700 dark:text-gray-200"
                      >
                        Problem
                      </label>
                      <textarea
                        id="headerProblemText"
                        value={headerProblemDraft}
                        onChange={(e) => setHeaderProblemDraft(e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="headerAudienceText"
                        className="text-xs font-medium text-gray-700 dark:text-gray-200"
                      >
                        Audience
                      </label>
                      <textarea
                        id="headerAudienceText"
                        value={headerAudienceDraft}
                        onChange={(e) => setHeaderAudienceDraft(e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveHeaderContext}
                        className="cursor-pointer rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-500 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200 dark:focus-visible:ring-gray-400"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelHeaderContextEdit}
                        className="cursor-pointer rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-500 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus-visible:ring-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {screenId !== FIRST_SCREEN_ID ? (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-800" />
            ) : null}

            <h2 className="mt-5 text-xl font-semibold">{headerTitle}</h2>
            {headerDescription ? (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{headerDescription}</p>
            ) : null}

            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                <div
                  className="h-full rounded-full bg-gray-900 transition-[width] dark:bg-gray-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {progressStep} of {totalStepsBeforeResults}
              </p>
            </div>
          </section>

          {currentScreen?.id === FIRST_SCREEN_ID ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="space-y-4">
                <div>
                  <label htmlFor="problemText" className="text-sm font-medium">
                    Problem statement
                  </label>
                  <textarea
                    id="problemText"
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="Describe the problem in one or two sentences..."
                    rows={4}
                    className={[
                      'mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm dark:bg-gray-950',
                      attemptedNext && isProblemTextMissing
                        ? 'border-red-300 dark:border-red-900/60'
                        : 'border-gray-200 dark:border-gray-800',
                    ].join(' ')}
                  />
                </div>

                <div>
                  <label htmlFor="audienceText" className="text-sm font-medium">
                    Who experiences this problem?
                  </label>
                  <textarea
                    id="audienceText"
                    value={audienceText}
                    onChange={(e) => setAudienceText(e.target.value)}
                    placeholder="Describe the specific audience affected by this problem..."
                    rows={3}
                    className={[
                      'mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm dark:bg-gray-950',
                      attemptedNext && isAudienceTextMissing
                        ? 'border-red-300 dark:border-red-900/60'
                        : 'border-gray-200 dark:border-gray-800',
                    ].join(' ')}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {currentScreen
            ? currentScreen.questionIds.map((questionId) => {
                const question = PROBLEM_ANALYZER_SCHEMA.questions[questionId]
                if (!question) {
                  if (process.env.NODE_ENV === 'development') {
                    console.error(
                      `[ProblemAnalyzer] Invalid schema reference during render: screen "${currentScreen.id}" references missing question "${questionId}".`
                    )
                  }
                  return null
                }
                return (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => onSelectOption(question.id, value)}
                    isInvalid={attemptedNext && missingQuestionIds.includes(question.id)}
                  />
                )
              })
            : null}

          {isConfidenceStep ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-xl font-semibold">Confidence Calibration (Optional)</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Startup ideas often rely on assumptions early on. This step helps distinguish
                between answers based on evidence and those based on guesswork. Lower confidence
                usually indicates where further discovery or customer validation is needed.
              </p>

              <div className="mt-4 space-y-3">
                {answeredQuestions.length > 0 ? (
                  answeredQuestions.map((question) => {
                    const selectedLevel = confidenceByQuestion[question.id]
                    const selectedOption = question.options.find(
                      (option) => option.id === answers[question.id]
                    )

                    if (!selectedOption) {
                      return null
                    }

                    return (
                      <div
                        key={question.id}
                        className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                      >
                        <p className="text-sm font-medium">{question.title}</p>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                          Your answer: {selectedOption.label}
                        </p>

                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          Confidence level
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4">
                          {(['low', 'med', 'high'] as const).map((level) => {
                            const checked = selectedLevel === level
                            const label =
                              level === 'low' ? 'Low' : level === 'med' ? 'Medium' : 'High'
                            return (
                              <label
                                key={level}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                              >
                                <input
                                  type="radio"
                                  name={`confidence-${question.id}`}
                                  checked={checked}
                                  onChange={() =>
                                    setConfidenceByQuestion((current) => ({
                                      ...current,
                                      [question.id]: level,
                                    }))
                                  }
                                  className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                                />
                                <span>{label}</span>
                              </label>
                            )
                          })}

                          <button
                            type="button"
                            onClick={() =>
                              setConfidenceByQuestion((current) => {
                                const next = { ...current }
                                delete next[question.id]
                                return next
                              })
                            }
                            className="cursor-pointer text-xs text-gray-600 underline hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No answered questions yet.
                  </p>
                )}
              </div>
            </section>
          ) : null}

          <div className="space-y-2">
            {attemptedNext &&
            (missingQuestionIds.length > 0 || isProblemTextMissing || isAudienceTextMissing) ? (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                Please answer all questions before continuing.
              </p>
            ) : null}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousScreen}
                disabled={screenId === FIRST_SCREEN_ID}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition-colors enabled:cursor-pointer enabled:hover:bg-gray-50 enabled:focus-visible:ring-2 enabled:focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:enabled:hover:bg-gray-900 dark:enabled:focus-visible:ring-gray-400"
              >
                Back
              </button>

              {!isConfidenceStep ? (
                <button
                  type="button"
                  onClick={goToNextScreen}
                  disabled={!currentScreen}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors enabled:cursor-pointer enabled:hover:bg-gray-800 enabled:focus-visible:ring-2 enabled:focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-100 dark:text-black dark:enabled:hover:bg-gray-200 dark:enabled:focus-visible:ring-gray-400"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setScreenId(SCREEN_RESULTS)}
                  disabled={!canViewResults}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors enabled:cursor-pointer enabled:hover:bg-gray-800 enabled:focus-visible:ring-2 enabled:focus-visible:ring-gray-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-100 dark:text-black dark:enabled:hover:bg-gray-200 dark:enabled:focus-visible:ring-gray-400"
                >
                  View results
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ResultsPanel result={resultModel} />
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
