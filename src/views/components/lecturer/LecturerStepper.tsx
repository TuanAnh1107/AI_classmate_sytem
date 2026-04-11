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
    <div className="wizard-stepper">
      {steps.map((step) => (
        <button key={step.id} type="button" className={`wizard-step-btn${step.isActive ? ' is-active' : ''}`} onClick={step.onClick}>
          {step.label}
        </button>
      ))}
    </div>
  )
}
