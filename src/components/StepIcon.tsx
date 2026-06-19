import cameraIcon from '../assets/images/icons/camera-accordion-icon.png'
import securityIcon from '../assets/images/icons/security-accordion-icon.png'
import sensorIcon from '../assets/images/icons/sensor-accordion-icon.png'
import protectionIcon from '../assets/images/icons/protection-accordion-icon.png'
import { cn } from '@/lib/utils'

interface StepIconProps {
  iconName: string
  active: boolean
}

export function StepIcon({ iconName, active }: StepIconProps) {
  const cls = cn(
    'size-6 shrink-0 transition-all duration-200',
    active ? 'opacity-100 scale-105' : 'grayscale hover:opacity-80'
  )

  let src = securityIcon
  switch (iconName) {
    case 'camera':
      src = cameraIcon
      break
    case 'shield':
      src = securityIcon
      break
    case 'bell':
      src = sensorIcon
      break
    case 'grid':
      src = protectionIcon
      break
  }

  return <img src={src} className={cls} alt={`${iconName} icon`} />
}
