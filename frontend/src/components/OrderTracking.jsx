
import { Check, Package, Truck, Box } from 'lucide-react'

function OrderTracking({ orderStatus }) {
  const steps = [
    {
      status: 'PLACED',
      label: 'Order Placed',
      description: 'Your order has been placed successfully.',
      icon: Package,
    },
    {
      status: 'CONFIRMED',
      label: 'Confirmed',
      description: 'Your order has been confirmed.',
      icon: Check,
    },
    {
      status: 'SHIPPED',
      label: 'Shipped',
      description: 'Your package is on its way.',
      icon: Truck,
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      description: 'Your order has been delivered.',
      icon: Box,
    },
  ]

  const currentStep = steps.findIndex(
    (step) => step.status === orderStatus
  )

  
return (
  <div className="order-tracking">
    {orderStatus === 'CANCELLED' ? (
      <div className="tracking-cancelled">
        <Package size={22} />
        <div>
          <strong>Order Cancelled</strong>
          <p>This order has been cancelled.</p>
        </div>
      </div>
    ) : (
      <div className="tracking-timeline">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = index <= currentStep
          const isCurrent = index === currentStep

          return (
            <div
              className={`tracking-step ${
                isCompleted ? 'completed' : ''
              } ${isCurrent ? 'current' : ''}`}
              key={step.status}
            >
              <div className="tracking-step-indicator">
                <div className="tracking-step-icon">
                  {isCompleted ? (
                    <Check size={18} />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>

                {index !== steps.length - 1 && (
                  <div className="tracking-step-line" />
                )}
              </div>

              <div className="tracking-step-content">
                <h4>{step.label}</h4>
                <p>{step.description}</p>

                {isCurrent && (
                  <span className="tracking-current-badge">
                    Current Status
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )}
  </div>
)

  
}

export default OrderTracking
