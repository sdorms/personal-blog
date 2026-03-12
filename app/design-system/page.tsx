import type { Metadata } from 'next'
import ButtonSpecimen from '@/components/design-system/ButtonSpecimen'
import ColorSwatch, { PaletteScaleCard } from '@/components/design-system/ColorSwatch'
import EffectSpecimen from '@/components/design-system/EffectSpecimen'
import IconSpecimen from '@/components/design-system/IconSpecimen'
import SpacingSpecimen, { SpacingScaleSpecimen } from '@/components/design-system/SpacingSpecimen'
import TypographySpecimen from '@/components/design-system/TypographySpecimen'
import { COLOR_PALETTE_SCALES, COLOR_TOKEN_GROUPS } from '@/lib/design-system/colors'
import { BUTTON_SHARED_CLASSNAME, BUTTON_TOKENS } from '@/lib/design-system/buttons'
import { EFFECT_TOKENS } from '@/lib/design-system/effects'
import { SPACING_SCALE_TOKENS, SPACING_USAGE_TOKENS } from '@/lib/design-system/spacing'
import { TYPOGRAPHY_SECTIONS } from '@/lib/design-system/typography'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'Internal design-system reference for typography tokens.',
}

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Internal
        </p>
        <h1 className="font-pixel mt-2 text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Design System
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-300">
          Typography v1 documentation for editorial and product UI usage. This page is intended as a
          living reference and can be extended with color, spacing, and component specs later.
        </p>
      </header>

      <section className="mt-6 space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Typography
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Tokens below are grouped by usage context. Each specimen shows source, family, class
            contract, and a live preview.
          </p>
        </div>

        {TYPOGRAPHY_SECTIONS.map((section) => (
          <section key={section.id} className="space-y-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {section.description}
              </p>
            </div>

            <div className="grid gap-4">
              {section.tokens.map((token) => (
                <TypographySpecimen key={token.id} token={token} />
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Colors
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            v1 color reference for palette scales, semantic states, text hierarchy, surfaces,
            borders, and button styles.
          </p>
        </div>

        <section className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Palette
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Base scales for brand accents and neutral UI structure.
            </p>
          </div>
          <div className="grid gap-4">
            {COLOR_PALETTE_SCALES.map((scale) => (
              <PaletteScaleCard key={scale.id} scale={scale} />
            ))}
          </div>
        </section>

        {COLOR_TOKEN_GROUPS.filter((group) => group.id !== 'button').map((group) => (
          <section key={group.id} className="space-y-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {group.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {group.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {group.tokens.map((token) => (
                <ColorSwatch key={token.id} token={token} />
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Spacing
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            v1 spacing reference for approved scale tokens and practical layout patterns used in
            internal tools.
          </p>
        </div>

        <section className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Spacing Scale
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Approved v1 spacing values from smallest to largest for consistent rhythm.
            </p>
          </div>
          <SpacingScaleSpecimen tokens={SPACING_SCALE_TOKENS} />
        </section>

        <section className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Recommended Usage Patterns
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Practical defaults for card padding, layout stacks, grid spacing, page padding, and
              controls.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {SPACING_USAGE_TOKENS.map((token) => (
              <SpacingSpecimen key={token.id} token={token} />
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Surfaces & Effects
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Compact defaults for radius, border, shadow, and surface treatments to reduce visual
            inconsistency.
          </p>
        </div>

        <section className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Surfaces & Effects
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Approved foundation defaults for cards, controls, and nested panel shells.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {EFFECT_TOKENS.map((token) => (
              <EffectSpecimen key={token.id} token={token} />
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Icons
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Phosphor icon standards for library usage, size scale, and semantic mapping.
          </p>
        </div>

        <section className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Icons
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Practical icon reference using centralized mappings for scalable product usage.
            </p>
          </div>
          <IconSpecimen />
        </section>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            2.1 Buttons
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            Centralized button variants and state previews. Shared defaults for non-link variants:{' '}
            <code className="font-mono text-xs">{BUTTON_SHARED_CLASSNAME}</code>
          </p>
        </div>

        <section className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Buttons
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Primary, secondary, ghost, text-link, and destructive patterns with default,
              hover/focus, and disabled examples.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {BUTTON_TOKENS.map((token) => (
              <ButtonSpecimen key={token.id} token={token} />
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
