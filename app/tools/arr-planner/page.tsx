// app/tools/arr-reality-check/page.tsx
import ArrRealityCheck from '@/components/tools/ArrPlanner'

export const metadata = {
  title: 'ARR Planner',
  description:
    'Run the math before you commit. See what revenue goals imply for users and distribution.',
}

export default function Page() {
  return <ArrRealityCheck />
}
