type ResultTone = 'strong' | 'emerging' | 'weak'

type ProgressBarProps = {
  tone: ResultTone
}

const toneFillMap: Record<ResultTone, string> = {
  strong: 'bg-success',
  emerging: 'bg-warning',
  weak: 'bg-danger',
}

// In the future the ValueMap should be refactored for AI to handle - something like value={output.strengthScore} //

const toneValueMap: Record<ResultTone, number> = {
  strong: 75,
  emerging: 50,
  weak: 25,
}

export default function ProgressBar({ tone }: ProgressBarProps) {
  return (
    <div className="bg-subtle h-[3px] w-full rounded-[12px]">
      <div
        className={`h-full rounded-[12px] ${toneFillMap[tone]}`}
        style={{ width: `${toneValueMap[tone]}%` }}
      />
    </div>
  )
}
