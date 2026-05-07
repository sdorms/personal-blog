type ActionFeedbackProps = {
  children: React.ReactNode
  position?: 'top'
}

export default function ActionFeedback({ children, position = 'top' }: ActionFeedbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`action-feedback action-feedback-${position} action-feedback-anim`}
    >
      {children}
    </div>
  )
}
