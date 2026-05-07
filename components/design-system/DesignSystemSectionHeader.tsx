export default function DesignSystemSectionHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
      ) : null}
    </div>
  )
}
