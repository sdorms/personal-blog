import type { OptionId, Question } from '@/lib/problem-analyzer/schema'
import RadioGroup, { RadioOption } from '@/components/ui/RadioGroup'

type QuestionCardProps = {
  question: Question
  value?: OptionId
  onChange: (value: OptionId) => void
  isInvalid?: boolean
}

export default function QuestionCard({ question, value, onChange, isInvalid }: QuestionCardProps) {
  return (
    <div id={`question-${question.id}`}>
      <RadioGroup
        label={question.title}
        helper={question.description}
        error={isInvalid ? 'Please select an answer for this question.' : undefined}
        name={`q_${question.id}`}
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as OptionId)}
      >
        {question.options.map((option) => (
          <RadioOption
            key={option.id}
            value={option.id}
            label={option.label}
            helper={option.helpText}
          />
        ))}
      </RadioGroup>
    </div>
  )
}
