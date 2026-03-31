import React from 'react'

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 font-semibold ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <rect x="4" y="10" width="24" height="12" rx="6" fill="currentColor" />
        <path
          d="M16 10V22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="16" r="2" fill="white" />
        <circle cx="22" cy="16" r="2" fill="white" />
      </svg>
      <span className="text-xl tracking-tight text-text">apoteq</span>
    </div>
  )
}
