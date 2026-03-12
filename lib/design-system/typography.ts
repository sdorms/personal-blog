export type TypographyFamily = 'editorial' | 'ui' | 'both'
export type TypographySource = 'existing' | 'normalized' | 'new'
export type TypographyCategory = 'headings' | 'body' | 'ui' | 'forms'

export type TypographyToken = {
  id: string
  name: string
  usage: string
  className: string
  family: TypographyFamily
  source: TypographySource
  sample: string
}

export type TypographySection = {
  id: TypographyCategory
  title: string
  description: string
  tokens: TypographyToken[]
}

export const TYPOGRAPHY_SECTIONS: TypographySection[] = [
  {
    id: 'headings',
    title: 'Headings',
    description: 'Heading hierarchy for pages, cards, and section structure.',
    tokens: [
      {
        id: 'h1',
        name: 'H1',
        family: 'both',
        source: 'normalized',
        className:
          'text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14',
        usage: 'Top-level page titles',
        sample: 'Designing for leverage',
      },
      {
        id: 'h2',
        name: 'H2',
        family: 'both',
        source: 'existing',
        className: 'text-2xl leading-8 font-bold tracking-tight',
        usage: 'Card titles and major section headings',
        sample: 'Opportunity Assessment',
      },
      {
        id: 'h3',
        name: 'H3',
        family: 'ui',
        source: 'new',
        className: 'text-xl leading-7 font-semibold tracking-tight',
        usage: 'Subsection headings inside cards and panels',
        sample: 'Strategic Recommendation',
      },
      {
        id: 'h4',
        name: 'H4',
        family: 'ui',
        source: 'new',
        className: 'text-lg leading-7 font-semibold',
        usage: 'Compact section headings',
        sample: 'Key Signals',
      },
      {
        id: 'h5',
        name: 'H5',
        family: 'ui',
        source: 'new',
        className: 'text-base leading-6 font-semibold',
        usage: 'Minor headings and grouped content titles',
        sample: 'Confidence',
      },
      {
        id: 'h6',
        name: 'H6',
        family: 'ui',
        source: 'new',
        className: 'text-sm leading-6 font-semibold',
        usage: 'Smallest heading tier',
        sample: 'Assumptions',
      },
      {
        id: 'section-label-eyebrow',
        name: 'Section Label / Eyebrow',
        family: 'ui',
        source: 'normalized',
        className: 'text-xs font-semibold uppercase tracking-wide',
        usage: 'Small uppercase labels above sections and grouped content',
        sample: 'STRATEGIC RECOMMENDATION',
      },
    ],
  },
  {
    id: 'body',
    title: 'Body',
    description: 'Body copy scale for long and short interface content.',
    tokens: [
      {
        id: 'body-l',
        name: 'Body L',
        family: 'ui',
        source: 'existing',
        className: 'text-lg leading-7',
        usage: 'Intro paragraphs and prominent explanatory text',
        sample: 'Use this calculator to estimate what your funnel needs to look like.',
      },
      {
        id: 'body-m',
        name: 'Body M',
        family: 'ui',
        source: 'normalized',
        className: 'text-base leading-6',
        usage: 'Default body copy for product UI',
        sample: 'This is the default body style for readable product copy.',
      },
      {
        id: 'body-s',
        name: 'Body S',
        family: 'ui',
        source: 'normalized',
        className: 'text-sm leading-6',
        usage: 'Secondary descriptions and compact supporting copy',
        sample: 'Useful for denser cards and interface descriptions.',
      },
      {
        id: 'body-xs',
        name: 'Body XS',
        family: 'ui',
        source: 'normalized',
        className: 'text-xs leading-5',
        usage: 'Tight support copy where readability still matters',
        sample: 'Small but still readable supporting content.',
      },
    ],
  },
  {
    id: 'ui',
    title: 'UI',
    description: 'Interface text patterns for controls, metadata, and signals.',
    tokens: [
      {
        id: 'button-text',
        name: 'Button Text',
        family: 'ui',
        source: 'normalized',
        className: 'text-sm font-medium',
        usage: 'Buttons, segmented controls, and compact actions',
        sample: 'Show advanced assumptions',
      },
      {
        id: 'link-text',
        name: 'Link Text',
        family: 'ui',
        source: 'existing',
        className: 'text-base leading-6 font-medium',
        usage: 'Standalone navigational and CTA links',
        sample: 'Read more →',
      },
      {
        id: 'tag',
        name: 'Tag',
        family: 'editorial',
        source: 'existing',
        className: 'font-pixel text-sm font-medium uppercase',
        usage: 'Content taxonomy tags and chips',
        sample: 'AI TOOLS',
      },
      {
        id: 'meta-caption',
        name: 'Meta / Caption',
        family: 'ui',
        source: 'normalized',
        className: 'text-sm leading-5 text-gray-500 dark:text-gray-400',
        usage: 'Muted metadata, dates, and secondary context',
        sample: 'March 11, 2026 · 2 uncertain answers',
      },
      {
        id: 'metric-value',
        name: 'Metric Value',
        family: 'ui',
        source: 'existing',
        className: 'text-xl font-semibold tracking-tight',
        usage: 'Stat values, KPIs, and computed outputs',
        sample: '24,000',
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Form labels, entered text, helpers, and validation states.',
    tokens: [
      {
        id: 'label',
        name: 'Label',
        family: 'ui',
        source: 'existing',
        className: 'text-sm font-medium',
        usage: 'Form field labels',
        sample: 'Monthly Price',
      },
      {
        id: 'input-text',
        name: 'Input Text',
        family: 'ui',
        source: 'existing',
        className: 'text-sm',
        usage: 'Text entered inside form fields',
        sample: '1,000,000',
      },
      {
        id: 'helper-text',
        name: 'Helper Text',
        family: 'ui',
        source: 'existing',
        className: 'text-xs leading-5 text-gray-500 dark:text-gray-400',
        usage: 'Supporting guidance below inputs',
        sample: 'Enter your annual recurring revenue target.',
      },
      {
        id: 'error-text',
        name: 'Error Text',
        family: 'ui',
        source: 'new',
        className: 'text-xs leading-5 font-medium text-red-600 dark:text-red-400',
        usage: 'Validation and error messages',
        sample: 'Please enter a valid number.',
      },
    ],
  },
]
