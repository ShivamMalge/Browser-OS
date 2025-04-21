"use client"

import type { ReactNode } from "react"

interface DesktopIconProps {
  icon: ReactNode
  label: string
  onClick: () => void
  color?: string
  hidden?: boolean // Add this prop to control visibility
}

const DesktopIcon = ({ icon, label, onClick, color = "cyber-neon-pink", hidden = false }: DesktopIconProps) => {
  return (
    <div
      className={`desktop-icon flex flex-col items-center justify-center w-24 h-28 m-2 cursor-pointer group z-10 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"} transition-opacity duration-300`}
      onClick={onClick}
    >
      <div
        className={`icon-container flex items-center justify-center w-16 h-16 rounded-md bg-black/70 border-2 border-${color}/70 
                     group-hover:border-${color} group-hover:shadow-[0_0_15px_rgba(255,0,255,0.7)] transition-all duration-200`}
      >
        {/* Increase icon size and brightness */}
        <div className="text-3xl transform scale-125">{icon}</div>
      </div>
      <div
        className={`label mt-2 text-center text-sm font-bold neon-text px-3 py-1 rounded max-w-full overflow-hidden whitespace-nowrap text-ellipsis`}
      >
        {label}
      </div>
    </div>
  )
}

export default DesktopIcon
