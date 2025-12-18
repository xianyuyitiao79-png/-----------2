import { useState, useEffect } from 'react'

export function Countdown() {
  const [days, setDays] = useState(0)
  const [loveDays, setLoveDays] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date()
      
      // 1. Days Until Meet (Target: January 1, 2026)
      const target = new Date('2026-01-01T00:00:00')
      const diff = target.getTime() - now.getTime()
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))
      setDays(Math.max(0, diffDays))

      // 2. Days in Love (Start: August 29, 2025 -> Today Dec 19 is 113th day)
      // Calculation: (Dec 19 - Aug 29) = 112 days. +1 for inclusive = 113.
      const start = new Date('2025-08-29T00:00:00')
      const diffLove = now.getTime() - start.getTime()
      const loveDaysCount = Math.floor(diffLove / (1000 * 60 * 60 * 24)) + 1
      setLoveDays(Math.max(0, loveDaysCount))
    }

    calculateDays()
    
    const timer = setInterval(calculateDays, 60000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-4 flex flex-col gap-2">
        <p className="text-2xl text-white/90 font-serif tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center">
            <span className="text-[#D4AF37] font-bold text-4xl mr-3 relative inline-block animate-pulse-slow drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">
                {days}
            </span>
            Days Until We Meet
        </p>
        
        <p className="text-2xl text-white/90 font-serif tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center">
            <span className="text-[#D4AF37] font-bold text-4xl mr-3 relative inline-block animate-pulse-slow drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" style={{ animationDelay: '1.5s' }}>
                {loveDays}
            </span>
            Days in Love
        </p>
    </div>
  )
}
