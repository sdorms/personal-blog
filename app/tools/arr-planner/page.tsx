import { Suspense } from 'react'
import ArrRealityCheck from '@/components/tools/ArrPlanner'

export const metadata = {
  title: 'ARR Planner',
  description:
    'Run the math before you commit. See what revenue goals imply for users and distribution.',
}

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10">Loading…</div>}>
      <ArrRealityCheck />
    </Suspense>
  )
}
