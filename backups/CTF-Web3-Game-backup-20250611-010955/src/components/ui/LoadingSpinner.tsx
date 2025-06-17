'use client'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          animate-spin
          rounded-full
          border-2
          border-gray-600
          border-t-primary-500
          border-r-primary-500
        `}
      >
      </div>
    </div>
  )
} 