'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Modal from '@/components/ui/Modal'
import ProblemAnalyzerIntro from '@/components/tools/problem-analyzer/ProblemAnalyzerIntro'
import QuestionCard from '@/components/tools/problem-analyzer/QuestionCard'
import ResultsPanel, { type ResultModel } from '@/components/tools/problem-analyzer/ResultsPanel'
import {
  PROBLEM_ANALYZER_SCHEMA,
  type OptionId,
  type QuestionId,
} from '@/lib/problem-analyzer/schema'
import type { AnswersMap, QuestionConfidenceLevel } from '@/lib/problem-analyzer/score'
import { buildProblemAnalyzerV2Analysis } from '@/lib/problem-analyzer/v2/adapter'

const INTRO_SCREEN_ID = 'intro'
const FIRST_SCREEN_ID = PROBLEM_ANALYZER_SCHEMA.screens[0]?.id ?? 'problem'
const SCREEN_CONFIDENCE = 'confidence'
const SCREEN_RESULTS = 'results'
const TOOL_OWNED_BASE_KEYS = ['problem', 'audience', 'screen'] as const
const ALLOWED_QUESTION_IDS = new Set(Object.keys(PROBLEM_ANALYZER_SCHEMA.questions))
const ALLOWED_SCREENS = new Set<string>([
  INTRO_SCREEN_ID,
  ...PROBLEM_ANALYZER_SCHEMA.screens.map((screen) => screen.id),
  SCREEN_CONFIDENCE,
  SCREEN_RESULTS,
])

type MissingSchemaReference = {
  screenId: string
  questionId: QuestionId
}

type WizardStepHeaderProps = {
  stepNumber: number
  totalSteps: number
  title: string
  description: string
}

type ProblemSummaryProps = {
  problemText: string
  audienceText: string
  onEdit: () => void
}

type WizardNavigationProps = {
  onPrevious: () => void
  onNext: () => void
  nextLabel?: string
  isNextDisabled?: boolean
}

type ProblemDefinitionFieldsProps = {
  problemInputId: string
  audienceInputId: string
  problemText: string
  audienceText: string
  onProblemTextChange: (value: string) => void
  onAudienceTextChange: (value: string) => void
  showProblemError: boolean
  showAudienceError: boolean
}

function truncateText(value: string, maxLength: number): string {
  const trimmed = value.trim()
  if (!trimmed) return 'Not set'
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`
}

function WizardStepHeader({ stepNumber, totalSteps, title, description }: WizardStepHeaderProps) {
  return (
    <div className="space-y-2">
      <p className="text-caption text-muted">
        Step {stepNumber} of {totalSteps}
      </p>
      <h2 className="text-h2 text-heading">{title}</h2>
      {description ? <p className="text-body-md text-body">{description}</p> : null}
    </div>
  )
}

function ProblemDefinitionFields({
  problemInputId,
  audienceInputId,
  problemText,
  audienceText,
  onProblemTextChange,
  onAudienceTextChange,
  showProblemError,
  showAudienceError,
}: ProblemDefinitionFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="field">
        <label htmlFor={problemInputId} className="field-label">
          Problem statement
        </label>

        <textarea
          id={problemInputId}
          value={problemText}
          onChange={(e) => onProblemTextChange(e.target.value)}
          placeholder="Describe the problem in one or two sentences..."
          rows={4}
          aria-invalid={showProblemError}
          className={['field-control', showProblemError && 'field-control-error']
            .filter(Boolean)
            .join(' ')}
        />
      </div>

      <div className="field">
        <label htmlFor={audienceInputId} className="field-label">
          Who experiences this problem?
        </label>

        <textarea
          id={audienceInputId}
          value={audienceText}
          onChange={(e) => onAudienceTextChange(e.target.value)}
          placeholder="Describe the specific audience affected by this problem..."
          rows={4}
          aria-invalid={showAudienceError}
          className={['field-control', showAudienceError && 'field-control-error']
            .filter(Boolean)
            .join(' ')}
        />
      </div>
    </div>
  )
}

function ProblemSummary({ problemText, audienceText, onEdit }: ProblemSummaryProps) {
  return (
    <section className="w-full rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-2">
            <p className="text-caption text-body">Problem</p>
            <p className="text-body-xs text-muted break-words">{truncateText(problemText, 160)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-caption text-body">Audience</p>
            <p className="text-body-xs text-muted break-words">{truncateText(audienceText, 160)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-body-xs text-muted hover:bg-subtle hover:text-body focus-visible:outline-primary-500 inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-1 py-1 focus-visible:outline-2"
          aria-label="Edit problem"
        >
          <Icon name="edit" size="small" className="text-current" />
          <span>Edit</span>
        </button>
      </div>
    </section>
  )
}

function WizardNavigation({
  onPrevious,
  onNext,
  nextLabel = 'Next',
  isNextDisabled = false,
}: WizardNavigationProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <Button type="button" variant="text-back" onClick={onPrevious}>
        Previous
      </Button>
      <Button type="button" variant="text" onClick={onNext} disabled={isNextDisabled}>
        {nextLabel}
      </Button>
    </div>
  )
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
  if (!raw) {
    const hasWizardState =
      Boolean(params.get('problem')) ||
      Boolean(params.get('audience')) ||
      Array.from(ALLOWED_QUESTION_IDS).some((questionId) =>
        Boolean(params.get(`q_${questionId}`))
      ) ||
      Array.from(ALLOWED_QUESTION_IDS).some((questionId) => Boolean(params.get(`c_${questionId}`)))

    return hasWizardState ? FIRST_SCREEN_ID : INTRO_SCREEN_ID
  }
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
  const [screenId, setScreenId] = useState<string>(INTRO_SCREEN_ID)
  const [debouncedProblemText, setDebouncedProblemText] = useState('')
  const [debouncedAudienceText, setDebouncedAudienceText] = useState('')
  const [attemptedNext, setAttemptedNext] = useState(false)
  const [missingQuestionIds, setMissingQuestionIds] = useState<QuestionId[]>([])
  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [draftProblemText, setDraftProblemText] = useState('')
  const [draftAudienceText, setDraftAudienceText] = useState('')
  const [attemptedEditSave, setAttemptedEditSave] = useState(false)

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
    const nextAnswers = parseAnswersFromParams(searchParams)
    const nextConfidenceByQuestion = parseConfidenceByQuestion(searchParams)
    const nextScreenId = parseScreenFromParams(searchParams)

    if (!hasHydratedFromUrl) {
      const nextProblemText = searchParams.get('problem') ?? ''
      const nextAudienceText = searchParams.get('audience') ?? ''

      setProblemText(nextProblemText)
      setDebouncedProblemText(nextProblemText)
      setAudienceText(nextAudienceText)
      setDebouncedAudienceText(nextAudienceText)
      setAnswers(nextAnswers)
      setConfidenceByQuestion(nextConfidenceByQuestion)
      setScreenId(nextScreenId)
      setHasHydratedFromUrl(true)

      return
    }

    // After initial hydration, don't sync text inputs from URL.
    // React state becomes the source of truth while typing.

    if (!answersEqual(answers, nextAnswers)) {
      setAnswers(nextAnswers)
    }

    if (!confidenceMapsEqual(confidenceByQuestion, nextConfidenceByQuestion)) {
      setConfidenceByQuestion(nextConfidenceByQuestion)
    }

    if (screenId !== nextScreenId) {
      setScreenId(nextScreenId)
    }

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

    const normalizedProblem = debouncedProblemText
    if (normalizedProblem) {
      sp.set('problem', normalizedProblem)
    }
    const normalizedAudience = debouncedAudienceText
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

    const hasWizardState =
      Boolean(normalizedProblem) ||
      Boolean(normalizedAudience) ||
      Object.values(answers).some(Boolean) ||
      Object.values(confidenceByQuestion).some(Boolean)

    if (screenId !== INTRO_SCREEN_ID) {
      sp.set('screen', screenId)
    } else if (hasWizardState) {
      sp.set('screen', INTRO_SCREEN_ID)
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

  const totalStepsBeforeResults = PROBLEM_ANALYZER_SCHEMA.screens.length
  const isIntroStep = screenId === INTRO_SCREEN_ID
  const currentScreen =
    PROBLEM_ANALYZER_SCHEMA.screens.find((screen) => screen.id === screenId) ?? null
  const currentScreenIndex = currentScreen
    ? PROBLEM_ANALYZER_SCHEMA.screens.findIndex((screen) => screen.id === currentScreen.id)
    : -1
  // temporarily removed confidence step
  // const isConfidenceStep = screenId === SCREEN_CONFIDENCE
  const isConfidenceStep = false
  const isResultsStep = screenId === SCREEN_RESULTS
  const isPostDefineQuestionScreen =
    Boolean(currentScreen) && screenId !== FIRST_SCREEN_ID && !isConfidenceStep && !isResultsStep

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
  const headerTitle = isConfidenceStep ? 'Confidence Calibration' : (currentScreen?.title ?? '')
  const headerDescription = isConfidenceStep
    ? 'Review your confidence in each answer.'
    : (currentScreen?.description ?? '')

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
  const isDraftProblemTextMissing = !draftProblemText.trim()
  const isDraftAudienceTextMissing = !draftAudienceText.trim()

  const onSelectOption = (questionId: QuestionId, optionId: OptionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }))
  }

  const openEditModal = () => {
    setDraftProblemText(problemText)
    setDraftAudienceText(audienceText)
    setAttemptedEditSave(false)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setAttemptedEditSave(false)
  }

  const saveEditModal = () => {
    if (isDraftProblemTextMissing || isDraftAudienceTextMissing) {
      setAttemptedEditSave(true)
      return
    }

    setProblemText(draftProblemText)
    setDebouncedProblemText(draftProblemText)
    setAudienceText(draftAudienceText)
    setDebouncedAudienceText(draftAudienceText)
    setIsEditModalOpen(false)
    setAttemptedEditSave(false)
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
    // hiding confidence screen temporarily
    // if (nextIndex >= PROBLEM_ANALYZER_SCHEMA.screens.length) {
    //   setScreenId(SCREEN_CONFIDENCE)
    //   return
    // }
    if (nextIndex >= PROBLEM_ANALYZER_SCHEMA.screens.length) {
      setScreenId(SCREEN_RESULTS)
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
    if (screenId === FIRST_SCREEN_ID) {
      setScreenId(INTRO_SCREEN_ID)
      return
    }
    if (!currentScreen) {
      setScreenId(INTRO_SCREEN_ID)
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
    setScreenId(INTRO_SCREEN_ID)

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="surface-card">
        {!isResultsStep ? (
          isIntroStep ? (
            <ProblemAnalyzerIntro onStart={() => setScreenId(FIRST_SCREEN_ID)} />
          ) : (
            <div className="space-y-6">
              {currentScreen?.id === FIRST_SCREEN_ID ? (
                <section className="mx-auto w-full max-w-3xl space-y-8">
                  <WizardStepHeader
                    stepNumber={1}
                    totalSteps={totalStepsBeforeResults}
                    title="Define your problem"
                    description="Start by describing the problem you want to evaluate and who experiences it."
                  />

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <ProblemDefinitionFields
                        problemInputId="problemText"
                        audienceInputId="audienceText"
                        problemText={problemText}
                        audienceText={audienceText}
                        onProblemTextChange={setProblemText}
                        onAudienceTextChange={setAudienceText}
                        showProblemError={attemptedNext && isProblemTextMissing}
                        showAudienceError={attemptedNext && isAudienceTextMissing}
                      />

                      {attemptedNext && (isProblemTextMissing || isAudienceTextMissing) ? (
                        <p role="alert" className="field-error">
                          Please complete all fields before continuing
                        </p>
                      ) : null}
                    </div>

                    <WizardNavigation onPrevious={goToPreviousScreen} onNext={goToNextScreen} />
                  </div>
                </section>
              ) : null}

              {isPostDefineQuestionScreen && currentScreen ? (
                <section className="mx-auto w-full max-w-3xl space-y-8">
                  <ProblemSummary
                    problemText={problemText}
                    audienceText={audienceText}
                    onEdit={openEditModal}
                  />

                  <WizardStepHeader
                    stepNumber={currentScreenIndex + 1}
                    totalSteps={totalStepsBeforeResults}
                    title={headerTitle}
                    description={headerDescription}
                  />

                  <div className="space-y-8">
                    <div className="space-y-8">
                      {currentScreen.questionIds.map((questionId) => {
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
                      })}
                    </div>

                    <div className="space-y-2">
                      {attemptedNext &&
                      (missingQuestionIds.length > 0 ||
                        isProblemTextMissing ||
                        isAudienceTextMissing) ? (
                        <p role="alert" className="field-error">
                          Please answer all questions before continuing
                        </p>
                      ) : null}

                      <WizardNavigation
                        onPrevious={goToPreviousScreen}
                        onNext={goToNextScreen}
                        isNextDisabled={!currentScreen}
                      />
                    </div>
                  </div>
                </section>
              ) : null}

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

              {screenId !== FIRST_SCREEN_ID && !isPostDefineQuestionScreen ? (
                <div className="space-y-2">
                  {attemptedNext &&
                  (missingQuestionIds.length > 0 ||
                    isProblemTextMissing ||
                    isAudienceTextMissing) ? (
                    <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                      Please answer all questions before continuing.
                    </p>
                  ) : null}

                  {!isConfidenceStep ? (
                    <WizardNavigation
                      onPrevious={goToPreviousScreen}
                      onNext={goToNextScreen}
                      isNextDisabled={!currentScreen}
                    />
                  ) : (
                    <WizardNavigation
                      onPrevious={goToPreviousScreen}
                      onNext={() => setScreenId(SCREEN_RESULTS)}
                      nextLabel="View results"
                      isNextDisabled={!canViewResults}
                    />
                  )}
                </div>
              ) : null}
            </div>
          )
        ) : (
          <div className="space-y-6">
            <ResultsPanel result={resultModel} />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="text-back"
                onClick={() => {
                  const lastSchemaScreen =
                    PROBLEM_ANALYZER_SCHEMA.screens[PROBLEM_ANALYZER_SCHEMA.screens.length - 1]

                  setScreenId(lastSchemaScreen?.id ?? FIRST_SCREEN_ID)
                }}
              >
                Back to confidence
              </Button>
              <Button type="button" variant="secondary" onClick={startOver}>
                Start over
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit problem"
        footer={
          <>
            <Button onClick={saveEditModal}>Save</Button>
            <Button variant="secondary" onClick={closeEditModal}>
              Discard
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <ProblemDefinitionFields
            problemInputId="editProblemText"
            audienceInputId="editAudienceText"
            problemText={draftProblemText}
            audienceText={draftAudienceText}
            onProblemTextChange={setDraftProblemText}
            onAudienceTextChange={setDraftAudienceText}
            showProblemError={attemptedEditSave && isDraftProblemTextMissing}
            showAudienceError={attemptedEditSave && isDraftAudienceTextMissing}
          />

          {attemptedEditSave && (isDraftProblemTextMissing || isDraftAudienceTextMissing) ? (
            <p role="alert" className="field-error">
              Please complete all fields before continuing
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
