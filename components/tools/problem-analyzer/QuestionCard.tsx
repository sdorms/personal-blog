import type { OptionId, Question } from '@/lib/problem-analyzer/schema'

type QuestionCardProps = {
  question: Question
  value?: OptionId
  onChange: (value: OptionId) => void
}

export default function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const titleId = `${question.id}-title`
  const descriptionId = `${question.id}-desc`

  return (
    <fieldset
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
      aria-labelledby={titleId}
      aria-describedby={question.description ? descriptionId : undefined}
    >
      <div id={titleId} className="mb-1 text-base font-semibold">
        {question.title}
      </div>
      {question.description ? (
        <p id={descriptionId} className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {question.description}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {question.options.map((option) => {
          const checked = value === option.id

          return (
            <label
              key={option.id}
              className={[
                'flex cursor-pointer gap-3 rounded-xl border p-4 text-sm transition-colors',
                checked
                  ? 'border-gray-900 bg-gray-100 dark:border-gray-100 dark:bg-gray-900'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900',
              ].join(' ')}
            >
              <input
                type="radio"
                name={`q_${question.id}`}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="mt-[2px] h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-500"
              />

              <div className="flex flex-col">
                <span className="leading-snug font-medium">{option.label}</span>

                {option.helpText && (
                  <span className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {option.helpText}
                  </span>
                )}
              </div>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
