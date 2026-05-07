type ResultTone = 'strong' | 'emerging' | 'weak'

type ResultHeadlineProps = {
  children: React.ReactNode
  tone: ResultTone
}

const toneColorMap: Record<ResultTone, string> = {
  strong: 'text-success',
  emerging: 'text-warning',
  weak: 'text-danger',
}

export default function ResultHeadline({ children, tone }: ResultHeadlineProps) {
  return <h2 className={`text-h1 ${toneColorMap[tone]}`}>{children}</h2>
}
