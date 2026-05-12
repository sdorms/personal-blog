import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import DesignSystemPageShell from '@/components/design-system/DesignSystemPageShell'
import RadioGroupDemo from '@/components/design-system/RadioGroupDemo'
import DesignSystemSectionHeader from '@/components/design-system/DesignSystemSectionHeader'

export const metadata: Metadata = {
  title: 'Design System - Fields',
  description:
    'Reusable field and radio primitives for labels, controls, helper text, and error states.',
}

function Specimen({
  title,
  code,
  note,
  children,
}: {
  title: string
  code: string
  note?: string
  children: ReactNode
}) {
  return (
    <article className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="space-y-2">
        <h3 className="text-h5 text-heading">{title}</h3>
        <code className="text-helper text-muted block break-all">{code}</code>
        {note ? <p className="text-body-sm text-body">{note}</p> : null}
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
          title="Field Primitives"
          description="These CSS primitives define the shared field shell only. Existing production forms should keep their current inline classes until they are migrated intentionally."
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-3">
            <p className="text-body-md text-body">
              Available primitives: <code className="text-helper text-heading">.field</code>,{' '}
              <code className="text-helper text-heading">.field-label</code>,{' '}
              <code className="text-helper text-heading">.field-control</code>,{' '}
              <code className="text-helper text-heading">.field-control-error</code>,{' '}
              <code className="text-helper text-heading">.field-helper</code>, and{' '}
              <code className="text-helper text-heading">.field-error</code>.
            </p>
            <p className="text-helper text-muted">
              Focus treatment uses both border and visible outline. Error state is supported with
              either <code className="text-heading">.field-control-error</code> or{' '}
              <code className="text-heading">aria-invalid=&quot;true&quot;</code>.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Specimen
            title="Default Input"
            code='<div className="field">...</div>'
            note="Base label and control pairing for single-line text entry."
          >
            <div className="field">
              <label htmlFor="field-default" className="field-label">
                Full name
              </label>
              <input
                id="field-default"
                type="text"
                className="field-control"
                placeholder="Enter your name"
                defaultValue="Stephen Dorman"
              />
            </div>
          </Specimen>

          <Specimen
            title="Textarea"
            code='<textarea className="field-control" />'
            note="Textarea controls share the same shell and allow vertical resizing only."
          >
            <div className="field">
              <label htmlFor="field-textarea" className="field-label">
                Problem statement
              </label>
              <textarea
                id="field-textarea"
                rows={5}
                className="field-control"
                defaultValue="Teams lose time each week because project status updates still require manual follow-up across several tools."
              />
            </div>
          </Specimen>

          <Specimen
            title="Input With Helper Text"
            code='<p className="field-helper">...</p>'
            note="Helper copy stays visually secondary and can be wired with aria-describedby."
          >
            <div className="field">
              <label htmlFor="field-helper" className="field-label">
                Monthly price
              </label>
              <input
                id="field-helper"
                type="number"
                className="field-control"
                aria-describedby="field-helper-copy"
                defaultValue={49}
              />
              <p id="field-helper-copy" className="field-helper">
                Use your expected average monthly price per customer.
              </p>
            </div>
          </Specimen>

          <Specimen
            title="Input With Error State"
            code='className="field-control field-control-error"'
            note="This specimen also includes aria-invalid and an error message for assistive technology compatibility."
          >
            <div className="field">
              <label htmlFor="field-error" className="field-label">
                Email address
              </label>
              <input
                id="field-error"
                type="email"
                className="field-control field-control-error"
                aria-invalid="true"
                aria-describedby="field-error-copy"
                defaultValue="hello@"
              />
              <p id="field-error-copy" className="field-error" role="alert">
                Enter a valid email address.
              </p>
            </div>
          </Specimen>

          <Specimen
            title="Disabled Input"
            code='disabled className="field-control"'
            note="Disabled controls use subtle surface treatment, muted text, and suppress hover affordances."
          >
            <div className="field">
              <label htmlFor="field-disabled" className="field-label">
                Workspace
              </label>
              <input
                id="field-disabled"
                type="text"
                className="field-control"
                value="Personal Blog"
                disabled
                readOnly
              />
              <p className="field-helper">This value is managed automatically.</p>
            </div>
          </Specimen>

          <Specimen
            title="State Notes"
            code=".field-control hover/focus-visible behavior"
            note="Use this as implementation guidance while production fields are still on their legacy inline classes."
          >
            <div className="border-border bg-subtle space-y-3 rounded-lg border p-4">
              <p className="text-body-sm text-body">
                Hover moves the control border from <code className="text-helper">border</code> to{' '}
                <code className="text-helper">gray-300</code>.
              </p>
              <p className="text-body-sm text-body">
                Keyboard focus keeps a visible <code className="text-helper">primary-500</code>{' '}
                outline with a matching focus border, even when the Tailwind Forms plugin is
                present.
              </p>
              <p className="text-body-sm text-body">
                Error fields preserve the focus outline while keeping the danger border override.
              </p>
            </div>
          </Specimen>
        </div>
      </section>

      <section className="space-y-4">
        <DesignSystemSectionHeader
          title="Radio Primitives"
          description="These CSS primitives define reusable radio group and radio option shells only. Existing production radios should keep their current implementation until they are migrated intentionally."
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-3">
            <p className="text-body-md text-body">
              Reusable components: <code className="text-helper text-heading">RadioGroup</code> and{' '}
              <code className="text-helper text-heading">RadioOption</code>.
            </p>
            <p className="text-body-md text-body">
              Available primitives: <code className="text-helper text-heading">.radio-group</code>,{' '}
              <code className="text-helper text-heading">.radio-group-header</code>,{' '}
              <code className="text-helper text-heading">.radio-group-label</code>,{' '}
              <code className="text-helper text-heading">.radio-group-helper</code>,{' '}
              <code className="text-helper text-heading">.radio-options</code>,{' '}
              <code className="text-helper text-heading">.radio-option</code>,{' '}
              <code className="text-helper text-heading">.radio-option-input</code>,{' '}
              <code className="text-helper text-heading">.radio-option-control</code>,{' '}
              <code className="text-helper text-heading">.radio-option-indicator</code>,{' '}
              <code className="text-helper text-heading">.radio-option-content</code>,{' '}
              <code className="text-helper text-heading">.radio-option-label</code>,{' '}
              <code className="text-helper text-heading">.radio-option-helper</code>, and{' '}
              <code className="text-helper text-heading">.radio-group-error</code>.
            </p>
            <p className="text-helper text-muted">
              Selected, disabled, focus-visible, and error states are handled with native input
              selectors plus <code className="text-heading">.radio-option-error</code> and{' '}
              <code className="text-heading">aria-invalid=&quot;true&quot;</code> support when
              needed.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Specimen
            title="Default Radio Group"
            code='<RadioGroup name="problemFrequency" value={value} onValueChange={setValue}>...</RadioGroup>'
            note="The base component uses a semantic fieldset with native radios and a clickable card label."
          >
            <RadioGroupDemo
              label="Problem frequency"
              name="problem-frequency-default"
              options={[
                {
                  value: 'rarely',
                  label: 'Rarely',
                  helper: 'Occurs occasionally and does not block most workflows.',
                },
                {
                  value: 'frequently',
                  label: 'Frequently',
                  helper: 'Shows up weekly or more and creates regular drag.',
                },
              ]}
            />
          </Specimen>

          <Specimen
            title="Selected State"
            code='<RadioOption value="frequently" label="Frequently" />'
            note="Selection is controlled by the group value while native arrow-key behavior stays intact."
          >
            <RadioGroupDemo
              label="Workflow maturity"
              name="workflow-maturity-selected"
              initialValue="repeatable"
              options={[
                {
                  value: 'informal',
                  label: 'Mostly informal',
                  helper: 'The team still relies on ad hoc coordination.',
                },
                {
                  value: 'repeatable',
                  label: 'Repeatable process',
                  helper: 'The same operating rhythm is followed most weeks.',
                },
              ]}
            />
          </Specimen>

          <Specimen
            title="Helper Text"
            code='helper="How often does this occur?"'
            note="Group helper text is announced through aria-describedby on each radio."
          >
            <RadioGroupDemo
              label="Team size"
              helper="Choose the range that best reflects the people involved in the workflow."
              name="team-size-helper"
              options={[
                {
                  value: 'small',
                  label: '1 to 5 people',
                  helper: 'Typical for a narrow or single-team workflow.',
                },
                {
                  value: 'large',
                  label: '6 or more people',
                  helper: 'Common when several teams need shared visibility.',
                },
              ]}
            />
          </Specimen>

          <Specimen
            title="Error State"
            code='error="Please select an option" required'
            note="Error copy is connected through aria-describedby and invalid state is applied to the radios."
          >
            <RadioGroupDemo
              label="Primary goal"
              helper="Pick the outcome you want this workflow to optimize first."
              error="Please select the primary outcome this workflow should improve."
              name="primary-goal-error"
              required
              options={[
                {
                  value: 'save-time',
                  label: 'Save time each week',
                  helper: 'Reduce repetitive status chasing and manual updates.',
                },
                {
                  value: 'improve-quality',
                  label: 'Improve decision quality',
                  helper: 'Give stakeholders cleaner, more reliable signals.',
                },
              ]}
            />
          </Specimen>

          <Specimen
            title="Disabled Option"
            code="disabled on <RadioOption />"
            note="Disabled options stay readable, keep native semantics, and suppress active hover affordances."
          >
            <RadioGroupDemo
              label="Review cadence"
              name="review-cadence-disabled"
              initialValue="weekly"
              options={[
                {
                  value: 'weekly',
                  label: 'Weekly',
                  helper: 'Best when the workflow changes often.',
                },
                {
                  value: 'monthly',
                  label: 'Monthly',
                  helper: 'Locked until the reporting integration is configured.',
                  disabled: true,
                },
              ]}
            />
          </Specimen>

          <Specimen
            title="Long Helper Copy"
            code='helper="Longer guidance can live at the group or option level."'
            note="Longer copy wraps inside the existing primitives without changing the radio card structure."
          >
            <RadioGroupDemo
              label="Implementation scope"
              helper="Use this group when a decision needs a little more framing before someone can choose confidently. The helper text should remain secondary, readable, and associated to each radio in assistive technology."
              name="implementation-scope-long-helper"
              initialValue="phased"
              options={[
                {
                  value: 'phased',
                  label: 'Phased rollout',
                  helper:
                    'Start with one high-friction workflow, confirm that the new process is stable, and expand only after the team has a repeatable operating rhythm.',
                },
                {
                  value: 'full-launch',
                  label: 'Full launch',
                  helper:
                    'Adopt the process across the entire team at once when the tooling, ownership, and reporting path are already clearly defined.',
                },
              ]}
            />
          </Specimen>

          <Specimen
            title="State Notes"
            code=".radio-option selected/disabled/focus-visible behavior"
            note="Use this as implementation guidance while production radios are still on their current markup."
          >
            <div className="border-border bg-subtle space-y-3 rounded-lg border p-4">
              <p className="text-body-sm text-body">
                Checked options use <code className="text-helper">primary-600</code> for the card
                border while the custom indicator dot becomes visible.
              </p>
              <p className="text-body-sm text-body">
                Keyboard focus uses the same visible{' '}
                <code className="text-helper">primary-500</code> outline and subtle ring pattern as{' '}
                <code className="text-helper">.field-control</code>.
              </p>
              <p className="text-body-sm text-body">
                Error options keep the danger border override even while the focus outline stays
                primary for accessibility.
              </p>
            </div>
          </Specimen>
        </div>
      </section>
    </DesignSystemPageShell>
  )
}
