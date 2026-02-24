'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  SCENARIOS,
  ScenarioKey,
  computeArrRealityCheck,
  formatCompact,
  Rates,
} from '@/lib/arr-planner'

function parseNumber(value: string | null, fallback: number) {
  if (!value) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function parseScenario(value: string | null): ScenarioKey {
  if (value === 'conservative' || value === 'base' || value === 'strong') return value
  return 'base'
}

function toPercentString(x01: number) {
  return String(Math.round(x01 * 1000) / 10) // one decimal percent
}

function fromPercentInput(s: string, fallback01: number) {
  const n = Number(s)
  if (!Number.isFinite(n)) return fallback01
  return Math.max(0, Math.min(1, n / 100))
}

export default function ArrRealityCheck() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  // 1) Initialize from query params (or defaults)
  const initialScenario = parseScenario(params.get('scenario'))
  const [scenario, setScenario] = useState<ScenarioKey>(initialScenario)

  const [arrTarget, setArrTarget] = useState(() => parseNumber(params.get('arr'), 1_000_000))
  const [months, setMonths] = useState(() => parseNumber(params.get('months'), 36))
  const [monthlyPrice, setMonthlyPrice] = useState(() => parseNumber(params.get('price'), 20))

  const [advancedOpen, setAdvancedOpen] = useState(false)

  const [rates, setRates] = useState<Rates>(() => {
    const preset = SCENARIOS[initialScenario].rates
    // Allow overrides via query params, fallback to preset
    return {
      exposureToVisit: params.get('e2v')
        ? fromPercentInput(params.get('e2v')!, preset.exposureToVisit)
        : preset.exposureToVisit,
      visitToTrial: params.get('v2t')
        ? fromPercentInput(params.get('v2t')!, preset.visitToTrial)
        : preset.visitToTrial,
      trialToPaid: params.get('t2p')
        ? fromPercentInput(params.get('t2p')!, preset.trialToPaid)
        : preset.trialToPaid,
    }
  })

  // 2) When scenario changes, update rates to that preset (unless you want “sticky custom” later)
  useEffect(() => {
    setRates(SCENARIOS[scenario].rates)
  }, [scenario])

  // 3) Sync state -> URL query params (shareable)
  useEffect(() => {
    const sp = new URLSearchParams()
    sp.set('scenario', scenario)
    sp.set('arr', String(Math.round(arrTarget)))
    sp.set('months', String(Math.round(months)))
    sp.set('price', String(monthlyPrice))

    // store rates as percent (e.g. 2 means 2%)
    sp.set('e2v', toPercentString(rates.exposureToVisit))
    sp.set('v2t', toPercentString(rates.visitToTrial))
    sp.set('t2p', toPercentString(rates.trialToPaid))

    router.replace(`${pathname}?${sp.toString()}`, { scroll: false })
  }, [scenario, arrTarget, months, monthlyPrice, rates, router, pathname])

  const outputs = useMemo(
    () =>
      computeArrRealityCheck({
        arrTarget,
        months,
        monthlyPrice,
        rates,
      }),
    [arrTarget, months, monthlyPrice, rates]
  )

  const summary = useMemo(() => {
    const paidPerMonth = outputs.paidUsersPerMonth
    const visitsPerMonth = outputs.visitsPerMonth

    if (!Number.isFinite(visitsPerMonth)) {
      return `One of your conversion rates is set to 0%, which makes required traffic infinite.`
    }

    if (monthlyPrice <= 20 && paidPerMonth > 150) {
      return `At this price point, the constraint is likely distribution. You’re signing ~${formatCompact(
        paidPerMonth
      )} new paid users/month, which implies ~${formatCompact(visitsPerMonth)} visits/month.`
    }

    return `You need ~${formatCompact(paidPerMonth)} new paid users/month, implying ~${formatCompact(
      visitsPerMonth
    )} visits/month under your current assumptions.`
  }, [outputs, monthlyPrice])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">ARR Reality Check</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Run the math before you commit. Adjust price, timeline, and funnel assumptions to see what
          scale you actually need.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Inputs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4">
            <p className="text-sm font-medium">Scenario</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {Object.entries(SCENARIOS).map(([key, cfg]) => {
                const k = key as ScenarioKey
                const active = k === scenario
                return (
                  <button
                    key={k}
                    onClick={() => setScenario(k)}
                    className={[
                      'rounded-xl border px-3 py-2 text-sm',
                      active
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900',
                    ].join(' ')}
                    type="button"
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="arrTarget" className="text-sm font-medium">
                ARR Target
              </label>
              <input
                id="arrTarget"
                type="number"
                inputMode="numeric"
                value={arrTarget}
                onChange={(e) => setArrTarget(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
              />
              <p className="mt-1 text-xs text-gray-500">Default: $1,000,000</p>
            </div>

            <div>
              <label htmlFor="months" className="text-sm font-medium">
                Time Horizon (months)
              </label>
              <input
                id="months"
                type="number"
                inputMode="numeric"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
              />
              <p className="mt-1 text-xs text-gray-500">Default: 36</p>
            </div>

            <div>
              <label htmlFor="monthlyPrice" className="text-sm font-medium">
                Monthly Price
              </label>
              <input
                id="monthlyPrice"
                type="number"
                inputMode="decimal"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
              />
              <p className="mt-1 text-xs text-gray-500">Default: $20</p>
            </div>

            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              {advancedOpen ? 'Hide' : 'Show'} advanced assumptions
            </button>

            {advancedOpen && (
              <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <div>
                  <label htmlFor="e2v" className="text-sm font-medium">
                    Exposure → Visit (%)
                  </label>
                  <input
                    id="e2v"
                    type="number"
                    inputMode="decimal"
                    value={toPercentString(rates.exposureToVisit)}
                    onChange={(e) =>
                      setRates((r) => ({
                        ...r,
                        exposureToVisit: fromPercentInput(e.target.value, r.exposureToVisit),
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
                <div>
                  <label htmlFor="v2t" className="text-sm font-medium">
                    Visit → Trial (%)
                  </label>
                  <input
                    id="v2t"
                    type="number"
                    inputMode="decimal"
                    value={toPercentString(rates.visitToTrial)}
                    onChange={(e) =>
                      setRates((r) => ({
                        ...r,
                        visitToTrial: fromPercentInput(e.target.value, r.visitToTrial),
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
                <div>
                  <label htmlFor="t2p" className="text-sm font-medium">
                    Trial → Paid (%)
                  </label>
                  <input
                    id="t2p"
                    type="number"
                    inputMode="decimal"
                    value={toPercentString(rates.trialToPaid)}
                    onChange={(e) =>
                      setRates((r) => ({
                        ...r,
                        trialToPaid: fromPercentInput(e.target.value, r.trialToPaid),
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Outputs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4">
            <p className="text-sm font-medium">Results</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Paying users (total)" value={formatCompact(outputs.paidUsersTotal)} />
            <Stat label="New paid / month" value={formatCompact(outputs.paidUsersPerMonth)} />
            <Stat label="Trials (total)" value={formatCompact(outputs.trialsTotal)} />
            <Stat label="Trials / month" value={formatCompact(outputs.trialsPerMonth)} />
            <Stat label="Visits (total)" value={formatCompact(outputs.visitsTotal)} />
            <Stat label="Visits / month" value={formatCompact(outputs.visitsPerMonth)} />
            <Stat label="Exposures (total)" value={formatCompact(outputs.exposuresTotal)} />
            <Stat label="Exposures / month" value={formatCompact(outputs.exposuresPerMonth)} />
          </div>

          <div className="mt-5 rounded-xl border border-gray-200 p-4 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
            <p className="font-medium text-gray-800 dark:text-gray-200">Assumptions</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Single-seat SaaS, monthly billing.</li>
              <li>Funnel model: exposure → visit → trial → paid.</li>
              <li>
                Rates: {toPercentString(rates.exposureToVisit)}% →{' '}
                {toPercentString(rates.visitToTrial)}% → {toPercentString(rates.trialToPaid)}%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  )
}
