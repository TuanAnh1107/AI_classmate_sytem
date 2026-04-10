type Step = {
  id: string
  label: string
  isActive?: boolean
  onClick: () => void
}

type LecturerStepperProps = {
  steps: Step[]
}

export function LecturerStepper({ steps }: LecturerStepperProps) {
  return (
    <div className="lecturer-stepper">
      {steps.map((step, index) => (
        <button key={step.id} type="button" className={step.isActive ? 'is-active' : undefined} onClick={step.onClick}>
          <span>{index + 1}</span>
          {step.label}
        </button>
      ))}
    </div>
  )
}
