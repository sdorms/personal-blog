import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'

export const metadata: Metadata = {
  title: 'Design System - Fields',
  description: 'Input controls for text, numeric, and choice-style interactions.',
}

function Specimen({
  title,
  source,
  note,
  children,
}: {
  title: string
  source: string
  note?: string
  children: ReactNode
}) {
  return (
    <article className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Source: <code className="font-mono">{source}</code>
        </p>
        {note ? <p className="text-sm text-gray-600 dark:text-gray-300">{note}</p> : null}
      </div>
      {children}
    </article>
  )
}

export default function Page() {
  return (
    <DesignSystemPageShell sectionId="fields">
      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Text Inputs"
          description="Baseline labeled text-entry fields for standard form and tool workflows."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Specimen
            title="Standard Labeled Text Input"
            source="components/tools/ArrPlanner.tsx"
            note="Default label + input shell for straightforward text entry."
          >
            <label htmlFor="field-standard" className="text-sm font-medium">
              Field label
            </label>
            <input
              id="field-standard"
              type="text"
              defaultValue="Example value"
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
            />
          </Specimen>

          <Specimen
            title="Textarea Field"
            source="components/tools/problem-analyzer/ProblemAnalyzerWizard.tsx"
            note="Label + textarea pattern used for longer free-form responses."
          >
            <label htmlFor="field-textarea" className="text-sm font-medium">
              Problem statement
            </label>
            <textarea
              id="field-textarea"
              rows={4}
              defaultValue="Teams lose time and money because their handoff process is still manual."
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
            />
          </Specimen>
        </div>
      </section>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Numeric Inputs"
          description="Number-focused input shells including prefixed/currency values."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Specimen
            title="Prefixed Currency Input"
            source="components/tools/ArrPlanner.tsx"
            note="Dollar prefix anchored inside the field with padded input text."
          >
            <label htmlFor="field-arr" className="text-sm font-medium">
              ARR target
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500">
                $
              </span>
              <input
                id="field-arr"
                type="text"
                defaultValue="1,000,000"
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-3 pl-7 text-sm dark:border-gray-800 dark:bg-gray-950"
              />
            </div>
          </Specimen>

          <Specimen
            title="Numeric Input With Helper Text"
            source="components/tools/ArrPlanner.tsx"
            note="Supports compact guidance text directly below the control."
          >
            <label htmlFor="field-price" className="text-sm font-medium">
              Monthly price
            </label>
            <input
              id="field-price"
              type="number"
              defaultValue={49}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
            />
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Use your expected average monthly price per customer.
            </p>
          </Specimen>
        </div>
      </section>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Choice Controls"
          description="Inputs where the user selects one option from a predefined set, including segmented controls and radio groups."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Specimen
            title="Segmented Control (Scenario Selector)"
            source="components/tools/ArrPlanner.tsx"
            note="Three-option segmented choice with a prominent active state."
          >
            <p className="text-sm font-medium">Scenario</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
              >
                Conservative
              </button>
              <button
                type="button"
                className="rounded-xl border border-gray-900 bg-gray-900 px-3 py-2 text-sm text-white dark:border-white dark:bg-white dark:text-black"
              >
                Base
              </button>
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
              >
                Strong
              </button>
            </div>
          </Specimen>

          <Specimen
            title="Radio Option Group (QuestionCard Style)"
            source="components/tools/problem-analyzer/QuestionCard.tsx"
            note="Recommended rich-radio pattern for options with labels and helper copy."
          >
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">How often does this problem occur?</legend>

              <div className="flex gap-3 rounded-xl border border-gray-900 bg-gray-100 p-4 text-sm dark:border-gray-100 dark:bg-gray-900">
                <input
                  id="choice-selected"
                  type="radio"
                  name="question-choice"
                  aria-label="Weekly or more"
                  defaultChecked
                  className="mt-[2px] h-4 w-4"
                />
                <span className="flex flex-col">
                  <span className="leading-snug font-medium">Weekly or more</span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Repeated pain with meaningful operational impact.
                  </span>
                </span>
              </div>

              <div className="flex gap-3 rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-800">
                <input
                  id="choice-unselected"
                  type="radio"
                  name="question-choice"
                  aria-label="Occasionally"
                  className="mt-[2px] h-4 w-4"
                />
                <span className="flex flex-col">
                  <span className="leading-snug font-medium">Occasionally</span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Pain exists but appears lower urgency or less consistent.
                  </span>
                </span>
              </div>
            </fieldset>
          </Specimen>
        </div>
      </section>
    </DesignSystemPageShell>
  )
}
