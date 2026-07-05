import { motion } from 'framer-motion'

interface StepperProps {
  steps: string[]
  active: number
}

function Stepper({ steps, active }: StepperProps) {
  return (
    <div className="btn-row" aria-label="Process steps">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          className={`chip ${index === active ? 'on' : ''}`}
          animate={{ scale: index === active ? 1.04 : 1, opacity: index <= active ? 1 : 0.58 }}
        >
          {index + 1}. {step}
        </motion.div>
      ))}
    </div>
  )
}

export default Stepper
