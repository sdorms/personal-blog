'use client'

import { useState } from 'react'
import { PROBLEM_ANALYZER_TEST_CASES } from '@/lib/problem-analyzer/v2/fixtures'
import { analyzeProblem } from '@/lib/problem-analyzer/v2/interpreter'

export default function ProblemAnalyzerV2TestPage() {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0)

  const selectedCase =
    PROBLEM_ANALYZER_TEST_CASES[selectedCaseIndex] ?? PROBLEM_ANALYZER_TEST_CASES[0]
  const output = analyzeProblem(selectedCase.answers, selectedCase.confidenceByQuestion)

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="space-y-8">
        <header className="space-y-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Internal Test Page
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Problem Analyzer v2
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              Switch between fixtures to inspect the rough `ResultOutput` structure from the new
              interpreter.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="problem-analyzer-v2-case"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Test case
            </label>
            <select
              id="problem-analyzer-v2-case"
              value={String(selectedCaseIndex)}
              onChange={(event) => setSelectedCaseIndex(Number(event.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            >
              {PROBLEM_ANALYZER_TEST_CASES.map((testCase, index) => (
                <option key={testCase.caseName} value={index}>
                  {testCase.caseName}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Problem Statement
          </h2>
          <p className="text-base leading-7 text-gray-700 dark:text-gray-200">
            {selectedCase.problemStatement}
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {output.summary}
            </h2>
            <p className="text-base leading-7 text-gray-700 dark:text-gray-200">{output.detail}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {output.signals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                {signal}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recommendation
            </h2>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {output.recommendation.title}
            </h3>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">
              {output.recommendation.detail}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Next Focus</h2>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {output.nextFocus.title}
            </h3>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">
              {output.nextFocus.detail}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confidence</h2>
            <p className="text-sm font-medium text-gray-900 capitalize dark:text-gray-100">
              {output.confidence.level}
            </p>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">
              {output.confidence.explanation}
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Expected Classification
          </h2>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Primary risk</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {selectedCase.expected.primaryRisk}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Recommendation
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {selectedCase.expected.recommendationType}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Next focus</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {selectedCase.expected.nextFocusType}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  )
}
