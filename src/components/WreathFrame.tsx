import { useMemo } from 'react'

export function WreathFrame() {
  // Generate random positions for lights and gold accents around the frame
  const decorations = useMemo(() => {
    const items = []
    const count = 40 // Number of lights/accents
    
    for (let i = 0; i < count; i++) {
      // Position around the edge (0 to 100%)
      // We want them in the outer 15% of the screen
      const angle = (i / count) * Math.PI * 2
      
      // Elliptical distribution to match screen aspect ratio roughly
      // But simple percentage based positioning works well for CSS
      const x = 50 + Math.cos(angle) * 45 // 5% padding
      const y = 50 + Math.sin(angle) * 45
      
      // Randomize slightly
      const rX = x + (Math.random() - 0.5) * 5
      const rY = y + (Math.random() - 0.5) * 5
      
      // Type: Light or Gold
      const type = Math.random() > 0.6 ? 'gold' : 'light'
      
      items.push({
        id: i,
        left: `${rX}%`,
        top: `${rY}%`,
        type,
        delay: Math.random() * 2,
        scale: 0.5 + Math.random() * 0.5
      })
    }
    return items
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* 1. Vignette Background (Evergreen fade) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at center, transparent 55%, rgba(10, 40, 20, 0.3) 70%, rgba(5, 30, 10, 0.7) 85%, rgba(2, 20, 5, 0.9) 100%)',
        }}
      />
      
      {/* 2. Texture Overlay (Optional, for leaf noise feel) */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Lights and Accents */}
      {decorations.map((item) => (
        <div
          key={item.id}
          className={`absolute rounded-full transition-opacity duration-1000 ${
            item.type === 'light' 
              ? 'w-2 h-2 bg-[#fff5c2] shadow-[0_0_10px_2px_rgba(255,240,150,0.6)] animate-pulse' 
              : 'w-1.5 h-1.5 bg-[#D4AF37] shadow-[0_0_5px_1px_rgba(212,175,55,0.4)]'
          }`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: `${item.delay}s`,
            transform: `scale(${item.scale})`,
            opacity: item.type === 'gold' ? 0.8 : 1
          }}
        />
      ))}
      
      {/* 4. Extra "Pine" touches (Stylized blur blobs) */}
      {/* Top Left */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#0a2f15] blur-3xl opacity-40 rounded-full" />
      {/* Top Right */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#0a2f15] blur-3xl opacity-40 rounded-full" />
      {/* Bottom Left */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#0a2f15] blur-3xl opacity-40 rounded-full" />
      {/* Bottom Right */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#0a2f15] blur-3xl opacity-40 rounded-full" />
      
    </div>
  )
}
