import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoveLetterProps {
  isOpen: boolean
  onClose: () => void
}

export function LoveLetter({ isOpen, onClose }: LoveLetterProps) {
  // Use state to delay text appearance for typing effect
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Delay text slightly after letter opens
      const timer = setTimeout(() => setShowText(true), 800)
      return () => clearTimeout(timer)
    } else {
      setShowText(false)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay / Vignette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-40 bg-black/60 pointer-events-auto flex items-center justify-center backdrop-blur-[2px]"
            onClick={onClose}
          >
            {/* The Letter */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.5 } }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                delay: 0.2 // Wait for light trail
              }}
              className="relative w-[90vw] max-w-[600px] bg-[#FDFBF7] p-8 md:p-12 shadow-[0_0_50px_rgba(255,215,0,0.3)] rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking letter
              style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`, // Subtle paper texture
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Golden Border */}
              <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none" />
              <div className="absolute inset-3 border border-[#D4AF37]/20 pointer-events-none" />
              
              {/* Close Icon (Heart) */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Content */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <span className="text-[#D4AF37] font-serif text-sm tracking-[0.2em] uppercase">Merry Christmas</span>
                </motion.div>

                {/* Body Text - Typewriter Effect */}
                <div className="font-serif text-[#4A4A4A] leading-relaxed text-lg md:text-xl min-h-[200px] flex flex-col justify-center">
                  {showText && (
                    <TypewriterText 
                      text={[
                        "To my dearest,",
                        "May this Christmas bring you as much joy",
                        "as you have brought into my life.",
                        "You are my brightest star.",
                        "Forever yours,"
                      ]} 
                    />
                  )}
                </div>

                {/* Footer / Signature */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showText ? 1 : 0 }} // Show after text
                  transition={{ delay: 4, duration: 1 }} // Rough timing
                  className="pt-4"
                >
                  <span className="font-handwriting text-3xl text-[#D4AF37]">Love</span>
                </motion.div>
              </div>

              {/* Floating Particles (CSS Animation) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-1 bg-[#D4AF37] rounded-full opacity-50 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`
                        }}
                      />
                  ))}
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Helper for typewriter effect
function TypewriterText({ text }: { text: string[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.8 } }
      }}
      className="space-y-2"
    >
      {text.map((line, i) => (
        <motion.p
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          {line}
        </motion.p>
      ))}
    </motion.div>
  )
}
