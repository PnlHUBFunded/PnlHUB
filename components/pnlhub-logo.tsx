interface PnlHubLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PnlHubLogo({ className = "", size = "md" }: PnlHubLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* PH Logo */}
      <div
        className={`${sizeClasses[size]} relative flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 shadow-lg`}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-400 to-cyan-400 opacity-20 animate-pulse"></div>

        {/* PH Text */}
        <span className={`${textSizes[size]} font-bold text-white relative z-10 tracking-tight`}>PH</span>

        {/* Corner accent */}
        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80"></div>
      </div>

      {/* PnlHUB Text */}
      <span className={`${textSizes[size]} font-bold text-white tracking-wide`}>PnlHUB</span>
    </div>
  )
}
