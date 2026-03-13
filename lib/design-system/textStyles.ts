export type TextStyleFamily = 'editorial' | 'ui' | 'both'
export type TextStyleSource = 'existing' | 'normalized' | 'new'
export type TextStyleCategory = 'headings' | 'body' | 'ui' | 'forms'

export type TextStyleToken = {
  id: string
  name: string
  category: TextStyleCategory
  usage: string
  className: string
  family: TextStyleFamily
  source: TextStyleSource
  sample: string
}

export type TextStyleSection = {
  id: TextStyleCategory
  title: string
  description: string
  tokens: TextStyleToken[]
}

export const TEXT_STYLES = {
  h1: {
    id: 'h1',
    name: 'H1',
    category: 'headings',
    family: 'both',
    source: 'normalized',
    className:
      'text-3xl leading-9 font-extrabold tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14',
    usage: 'Top-level page titles',
    sample: 'Designing for leverage',
  },
  h2: {
    id: 'h2',
    name: 'H2',
    category: 'headings',
    family: 'both',
    source: 'existing',
    className: 'text-2xl leading-8 font-bold tracking-tight',
    usage: 'Card titles and major section headings',
    sample: 'Opportunity Assessment',
  },
  h3: {
    id: 'h3',
    name: 'H3',
    category: 'headings',
    family: 'ui',
    source: 'new',
    className: 'text-xl leading-7 font-semibold tracking-tight',
    usage: 'Subsection headings inside cards and panels',
    sample: 'Strategic Recommendation',
  },
  h4: {
    id: 'h4',
    name: 'H4',
    category: 'headings',
    family: 'ui',
    source: 'new',
    className: 'text-lg leading-7 font-semibold',
    usage: 'Compact section headings',
    sample: 'Key Signals',
  },
  h5: {
    id: 'h5',
    name: 'H5',
    category: 'headings',
    family: 'ui',
    source: 'new',
    className: 'text-base leading-6 font-semibold',
    usage: 'Minor headings and grouped content titles',
    sample: 'Confidence',
  },
  h6: {
    id: 'h6',
    name: 'H6',
    category: 'headings',
    family: 'ui',
    source: 'new',
    className: 'text-sm leading-6 font-semibold',
    usage: 'Smallest heading tier',
    sample: 'Assumptions',
  },
  sectionLabel: {
    id: 'section-label-eyebrow',
    name: 'Section Label / Eyebrow',
    category: 'headings',
    family: 'ui',
    source: 'normalized',
    className: 'text-xs font-semibold uppercase tracking-wide',
    usage: 'Small uppercase labels above sections and grouped content',
    sample: 'STRATEGIC RECOMMENDATION',
  },
  bodyL: {
    id: 'body-l',
    name: 'Body L',
    category: 'body',
    family: 'ui',
    source: 'existing',
    className: 'text-lg leading-7',
    usage: 'Intro paragraphs and prominent explanatory text',
    sample: 'Use this calculator to estimate what your funnel needs to look like.',
  },
  bodyM: {
    id: 'body-m',
    name: 'Body M',
    category: 'body',
    family: 'ui',
    source: 'normalized',
    className: 'text-base leading-6',
    usage: 'Default body copy for product UI',
    sample: 'This is the default body style for readable product copy.',
  },
  bodyS: {
    id: 'body-s',
    name: 'Body S',
    category: 'body',
    family: 'ui',
    source: 'normalized',
    className: 'text-sm leading-6',
    usage: 'Secondary descriptions and compact supporting copy',
    sample: 'Useful for denser cards and interface descriptions.',
  },
  bodyXS: {
    id: 'body-xs',
    name: 'Body XS',
    category: 'body',
    family: 'ui',
    source: 'normalized',
    className: 'text-xs leading-5',
    usage: 'Tight support copy where readability still matters',
    sample: 'Small but still readable supporting content.',
  },
  buttonText: {
    id: 'button-text',
    name: 'Button Text',
    category: 'ui',
    family: 'ui',
    source: 'normalized',
    className: 'text-sm font-medium',
    usage: 'Buttons, segmented controls, and compact actions',
    sample: 'Show advanced assumptions',
  },
  linkText: {
    id: 'link-text',
    name: 'Link Text',
    category: 'ui',
    family: 'ui',
    source: 'existing',
    className: 'text-base leading-6 font-medium',
    usage: 'Standalone navigational and CTA links',
    sample: 'Read more →',
  },
  tag: {
    id: 'tag',
    name: 'Tag',
    category: 'ui',
    family: 'editorial',
    source: 'existing',
    className: 'font-pixel text-sm font-medium uppercase',
    usage: 'Content taxonomy tags and chips',
    sample: 'AI TOOLS',
  },
  meta: {
    id: 'meta-caption',
    name: 'Meta / Caption',
    category: 'ui',
    family: 'ui',
    source: 'normalized',
    className: 'text-sm leading-5 text-gray-500 dark:text-gray-400',
    usage: 'Muted metadata, dates, and secondary context',
    sample: 'March 11, 2026 · 2 uncertain answers',
  },
  metricValue: {
    id: 'metric-value',
    name: 'Metric Value',
    category: 'ui',
    family: 'ui',
    source: 'existing',
    className: 'text-xl font-semibold tracking-tight',
    usage: 'Stat values, KPIs, and computed outputs',
    sample: '24,000',
  },
  formLabel: {
    id: 'label',
    name: 'Label',
    category: 'forms',
    family: 'ui',
    source: 'existing',
    className: 'text-sm font-medium',
    usage: 'Form field labels',
    sample: 'Monthly Price',
  },
  inputText: {
    id: 'input-text',
    name: 'Input Text',
    category: 'forms',
    family: 'ui',
    source: 'existing',
    className: 'text-sm',
    usage: 'Text entered inside form fields',
    sample: '1,000,000',
  },
  helperText: {
    id: 'helper-text',
    name: 'Helper Text',
    category: 'forms',
    family: 'ui',
    source: 'existing',
    className: 'text-xs leading-5 text-gray-500 dark:text-gray-400',
    usage: 'Supporting guidance below inputs',
    sample: 'Enter your annual recurring revenue target.',
  },
  errorText: {
    id: 'error-text',
    name: 'Error Text',
    category: 'forms',
    family: 'ui',
    source: 'new',
    className: 'text-xs leading-5 font-medium text-red-600 dark:text-red-400',
    usage: 'Validation and error messages',
    sample: 'Please enter a valid number.',
  },
} satisfies Record<string, TextStyleToken>

export const textClass = {
  h1: TEXT_STYLES.h1.className,
  h2: TEXT_STYLES.h2.className,
  h3: TEXT_STYLES.h3.className,
  h4: TEXT_STYLES.h4.className,
  h5: TEXT_STYLES.h5.className,
  h6: TEXT_STYLES.h6.className,
  sectionLabel: TEXT_STYLES.sectionLabel.className,
  bodyL: TEXT_STYLES.bodyL.className,
  bodyM: TEXT_STYLES.bodyM.className,
  bodyS: TEXT_STYLES.bodyS.className,
  bodyXS: TEXT_STYLES.bodyXS.className,
  buttonText: TEXT_STYLES.buttonText.className,
  linkText: TEXT_STYLES.linkText.className,
  tag: TEXT_STYLES.tag.className,
  meta: TEXT_STYLES.meta.className,
  metricValue: TEXT_STYLES.metricValue.className,
  formLabel: TEXT_STYLES.formLabel.className,
  inputText: TEXT_STYLES.inputText.className,
  helperText: TEXT_STYLES.helperText.className,
  errorText: TEXT_STYLES.errorText.className,
}

export const TEXT_STYLE_SECTIONS: TextStyleSection[] = [
  {
    id: 'headings',
    title: 'Headings',
    description: 'Heading hierarchy for pages, cards, and section structure.',
    tokens: [
      TEXT_STYLES.h1,
      TEXT_STYLES.h2,
      TEXT_STYLES.h3,
      TEXT_STYLES.h4,
      TEXT_STYLES.h5,
      TEXT_STYLES.h6,
      TEXT_STYLES.sectionLabel,
    ],
  },
  {
    id: 'body',
    title: 'Body',
    description: 'Body copy scale for long and short interface content.',
    tokens: [TEXT_STYLES.bodyL, TEXT_STYLES.bodyM, TEXT_STYLES.bodyS, TEXT_STYLES.bodyXS],
  },
  {
    id: 'ui',
    title: 'UI',
    description: 'Interface text patterns for controls, metadata, and signals.',
    tokens: [
      TEXT_STYLES.buttonText,
      TEXT_STYLES.linkText,
      TEXT_STYLES.tag,
      TEXT_STYLES.meta,
      TEXT_STYLES.metricValue,
    ],
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Form labels, entered text, helpers, and validation states.',
    tokens: [
      TEXT_STYLES.formLabel,
      TEXT_STYLES.inputText,
      TEXT_STYLES.helperText,
      TEXT_STYLES.errorText,
    ],
  },
]
