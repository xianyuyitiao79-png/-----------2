import { Html } from '@react-three/drei'
import { useState, useEffect } from 'react'

interface LoveLetterProps {
  isOpen: boolean
  onClose: () => void
}

export function LoveLetter({ isOpen, onClose }: LoveLetterProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(false), 500) // Wait for fade out
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  return (
    <Html fullscreen style={{ pointerEvents: isOpen ? 'auto' : 'none', zIndex: 100 }}>
      <div 
        className={`fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      >
        <div 
          className={`relative max-w-lg w-[90%] bg-[#fffcf5] p-8 rounded-sm shadow-[0_0_50px_rgba(255,215,0,0.3)] transform transition-all duration-700 ${isOpen ? 'scale-100 translate-y-0 rotate-0' : 'scale-50 translate-y-20 rotate-6'}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the letter itself
        >
          {/* Paper Texture Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} 
          />
          
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-50" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] opacity-50" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] opacity-50" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-50" />

          {/* Letter Content */}
          <div className="relative z-10 font-serif text-[#4a4a4a]">
            <h2 className="text-3xl text-center mb-6 text-[#D4AF37] tracking-widest uppercase border-b border-[#D4AF37]/30 pb-4 mx-8">
              My Dearest
            </h2>
            
            <div className="space-y-4 text-lg leading-relaxed italic opacity-90">
              <p>
                Merry Christmas! 🎄
              </p>
              <p>
                As you watch these lights twinkle, I want you to know that you are the brightest star in my universe.
              </p>
              <p>
                This digital tree will never wither, just like my love for you. May our days be filled with as much joy and magic as this moment.
              </p>
              <p>
                I love you more than words can say.
              </p>
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-bold text-[#D4AF37]">Forever Yours,</p>
              <p className="text-lg mt-1">Jingqiyan</p>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-4 -right-4 w-10 h-10 bg-[#D4AF37] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#b89628] transition-colors z-20"
          >
            ✕
          </button>
        </div>
      </div>
    </Html>
  )
}
