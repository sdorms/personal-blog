export type ScenarioKey = 'conservative' | 'base' | 'strong'

export type Rates = {
  exposureToVisit: number // 0-1
  visitToTrial: number // 0-1
  trialToPaid: number // 0-1
}

export type Inputs = {
  arrTarget: number
  months: number
  monthlyPrice: number
  rates: Rates
}

export type Outputs = {
  paidUsersTotal: number
  paidUsersPerMonth: number
  trialsTotal: number
  trialsPerMonth: number
  visitsTotal: number
  visitsPerMonth: number
  exposuresTotal: number
  exposuresPerMonth: number
}

export const SCENARIOS: Record<ScenarioKey, { label: string; rates: Rates }> = {
  conservative: {
    label: 'Conservative',
    rates: { exposureToVisit: 0.01, visitToTrial: 0.02, trialToPaid: 0.1 },
  },
  base: {
    label: 'Base',
    rates: { exposureToVisit: 0.02, visitToTrial: 0.038, trialToPaid: 0.18 },
  },
  strong: {
    label: 'Strong',
    rates: { exposureToVisit: 0.05, visitToTrial: 0.06, trialToPaid: 0.25 },
  },
}

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(1, n))
}

function safePos(n: number, fallback: number) {
  if (!Number.isFinite(n) || n <= 0) return fallback
  return n
}

export function computeArrRealityCheck(raw: Inputs): Outputs {
  const arrTarget = safePos(raw.arrTarget, 1_000_000)
  const months = Math.round(safePos(raw.months, 36))
  const monthlyPrice = safePos(raw.monthlyPrice, 20)

  const exposureToVisit = clamp01(raw.rates.exposureToVisit)
  const visitToTrial = clamp01(raw.rates.visitToTrial)
  const trialToPaid = clamp01(raw.rates.trialToPaid)

  // Core: ARR = users * price * 12
  const paidUsersTotal = arrTarget / (monthlyPrice * 12)
  const paidUsersPerMonth = paidUsersTotal / months

  // Avoid divide-by-zero by returning Infinity if rates are 0 (UI can handle)
  const trialsTotal = trialToPaid > 0 ? paidUsersTotal / trialToPaid : Infinity
  const visitsTotal = visitToTrial > 0 ? trialsTotal / visitToTrial : Infinity
  const exposuresTotal = exposureToVisit > 0 ? visitsTotal / exposureToVisit : Infinity

  return {
    paidUsersTotal,
    paidUsersPerMonth,
    trialsTotal,
    trialsPerMonth: trialsTotal / months,
    visitsTotal,
    visitsPerMonth: visitsTotal / months,
    exposuresTotal,
    exposuresPerMonth: exposuresTotal / months,
  }
}

export function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return '∞'
  // Avoid Intl rounding surprises; keep it simple
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(2)}k`
  return n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)
}
