import { useMemo, useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { generatePhotoData } from '../utils/tree-math'

interface PhotoOrnamentsProps {
  progressRef: React.MutableRefObject<number>
  formed: boolean
  memoryMode: boolean // New prop
}

const PHOTO_COUNT = 12

export function PhotoOrnaments({ progressRef, formed, memoryMode }: PhotoOrnamentsProps) {
  // Load textures
  // We assume photos are named 1.jpg to 12.jpg
  const photoPaths = useMemo(() => {
    // In Vite, import.meta.env.BASE_URL gives us the configured base path
    // This works for both dev (if base is set) and prod
    const base = import.meta.env.BASE_URL
    // Ensure base doesn't end with slash if we're adding one, or just join carefully
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
    return Array.from({ length: PHOTO_COUNT }, (_, i) => `${cleanBase}/photos/${i + 1}.jpg`)
  }, [])

  const textures = useLoader(THREE.TextureLoader, photoPaths)

  const photos = useMemo(() => generatePhotoData(PHOTO_COUNT), [])

  // Luxury Ease
  const easeInOutCubic = (x: number): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  
  // Track active photo for fullscreen
  const [activePhoto, setActivePhoto] = useState<number | null>(null)
  
  // Use ref for rotation to avoid re-renders causing stutter
  const rotationRef = useRef(0)

  return (
    <group>
      {photos.map((data, i) => (
        <PhotoItem 
            key={i} 
            data={data} 
            texture={textures[i]} 
            progressRef={progressRef} 
            easeInOutCubic={easeInOutCubic}
            isActive={activePhoto === i}
            isMemoryMode={memoryMode}
            isMemoryFocus={memoryMode && false} // Disable focus zoom for circle mode
            memoryIndex={i}
            totalPhotos={PHOTO_COUNT}
            rotationRef={rotationRef}
            onSelect={() => setActivePhoto(activePhoto === i ? null : i)}
        />
      ))}
      
      {/* Fullscreen Overlay when active */}
      {activePhoto !== null && (
          <Html fullscreen style={{ pointerEvents: 'none' }}>
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto" onClick={() => setActivePhoto(null)}>
                  {/* Backdrop handled by component logic, just click handler here */}
              </div>
          </Html>
      )}
    </group>
  )
}

function PhotoItem({ data, texture, progressRef, easeInOutCubic, isActive, onSelect, isMemoryMode, isMemoryFocus, memoryIndex, totalPhotos, rotationRef }: any) {
    const meshRef = useRef<THREE.Group>(null)
    const targetRef = useRef(new THREE.Vector3())
    const lookAtRef = useRef(new THREE.Vector3())
    
    // Animation state for click
    const activeProgress = useRef(0)
    const memoryProgress = useRef(0)
    
    // Spiral logic helper
    const rotateY = (vec: THREE.Vector3, angle: number) => {
        const s = Math.sin(angle)
        const c = Math.cos(angle)
        const x = vec.x
        const z = vec.z
        vec.x = c * x + s * z
        vec.z = -s * x + c * z
    }
    
    useFrame((state, delta) => {
        if (!meshRef.current) return
        
        // Update active transition
        activeProgress.current = THREE.MathUtils.lerp(activeProgress.current, isActive ? 1 : 0, delta * 5)
        const activeP = activeProgress.current

        // Update memory transition
        memoryProgress.current = THREE.MathUtils.lerp(memoryProgress.current, isMemoryMode ? 1 : 0, delta * 2) // Slow transition
        const memP = memoryProgress.current
        
        const t = state.clock.elapsedTime
        // const p = easeInOutCubic(progressRef.current)
        const globalP = progressRef.current
        
        // Calculate Local Progress for Stagger
        // Normalize Y (Target Pos) approx -5 to 10?
        const { chaosPos, targetPos } = data
        const normT = (targetPos.y + 10) / 22
        const safeT = THREE.MathUtils.clamp(normT, 0, 1)
        
        let localP = globalP * 2.5 - (1.5 - safeT * 1.5)
        localP = THREE.MathUtils.clamp(localP, 0, 1)
        const p = easeInOutCubic(localP)
        
        // 1. Calculate Base Position (Tree)
        const treePos = new THREE.Vector3().lerpVectors(chaosPos, targetPos, p)
        
        // Apply spiral
        const twistStrength = (1 - p) * 10.0
        rotateY(treePos, twistStrength)
        
        // Floating + Swaying (Gentle swing)
        treePos.y += Math.sin(t * 1.5 + data.id) * 0.2
        
        // Swaying Rotation (When on tree)
        if (!isActive && !isMemoryMode) {
             const sway = Math.sin(t * 2 + data.id) * 0.08 * p // Sway only when formed
             meshRef.current.rotation.z += sway
        }

        // --- MEMORY MODE LOGIC: ROTATING CIRCLE ---
        
        // Update global rotation if first item (hacky but efficient)
        if (memoryIndex === 0 && isMemoryMode) {
             rotationRef.current += delta * 0.2 // Rotation speed
        }

        // Circle Calculation
        const radius = 18 // Distance from center
        const angleStep = (Math.PI * 2) / totalPhotos
        const currentAngle = memoryIndex * angleStep + rotationRef.current
        
        const cx = Math.sin(currentAngle) * radius
        const cz = Math.cos(currentAngle) * radius
        const cy = -5 // Changed from 2 to -5 to move circle down
        
        const memoryPos = new THREE.Vector3(cx, cy, cz)

        // --- FINAL POSITION MIXING ---
        
        // Get camera position and move forward (for Active Click Mode)
        const camPos = state.camera.position.clone()
        const camDir = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion)
        const activeTarget = camPos.clone().add(camDir.multiplyScalar(10)) 
        
        // Mix: Tree -> Memory -> Active
        // First mix Tree and Memory based on memP
        const currentBasePos = new THREE.Vector3().lerpVectors(treePos, memoryPos, memP)
        
        // Then mix with Active Click (Click overrides everything)
        // Actually, if memory mode is on, we disable click active mode usually, or let click override memory
        // Let's assume click overrides memory.
        meshRef.current.position.lerpVectors(currentBasePos, activeTarget, activeP)
        
        
        // --- ROTATION MIXING ---
        // Tree: Face Center (Rotated 180)
        // Memory: Face Camera (0)
        // Active: Face Camera (0)
        
        // Calculate Tree Look Target (Center)
        const treeLook = new THREE.Vector3(0, meshRef.current.position.y, 0)
        // Calculate Active/Memory Look Target (Camera)
        const activeLook = state.camera.position.clone()
        
        // Interpolate look target
        // If memP > 0 or activeP > 0, we start looking at camera
        const lookAtCameraWeight = Math.max(memP, activeP)
        lookAtRef.current.lerpVectors(treeLook, activeLook, lookAtCameraWeight)
        
        meshRef.current.lookAt(lookAtRef.current)
        meshRef.current.up.set(0, 1, 0)
        
        // Fix Y rotation (Tree needs 180 flip to face out, Camera needs 0)
        // So we rotate by PI * (1 - weight)
        meshRef.current.rotateY(Math.PI * (1 - lookAtCameraWeight))
        
        
        // --- SCALE LOGIC ---
        const baseScale = 1.0
        const memoryScale = isMemoryFocus ? 2.5 : 1.5 // Focus big, others med
        const activeScale = 3.0
        
        // Mix scales
        let currentScale = THREE.MathUtils.lerp(baseScale, memoryScale, memP)
        currentScale = THREE.MathUtils.lerp(currentScale, activeScale, activeP)
        
        meshRef.current.scale.setScalar(currentScale)
        
        // Opacity/Fade for non-focused memory items?
        // We can't easily fade opaque materials without transparency.
        // But we can scale them down more? Done above.
        
        // Extra spin active
        if (isActive) {
             meshRef.current.rotation.z = t * 0.5 
             meshRef.current.rotation.y += Math.sin(t * 0.5) * 0.1
        }
    })
    
    return (
        <group ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect() }}>
            {/* Hanging String (Hanger) */}
            {/* Visual line connecting to a virtual "branch" point */}
            {/* We can randomize the attachment point slightly to look like it's hooked on a nearby branch/ball */}
            {/* Just drawing a line straight up is good enough for now, but let's make it longer and angled */}
            <group position={[0, 2.3, 0]}>
                {/* String */}
                <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, 1.6]} />
                    <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
                </mesh>
                
                {/* Decorative Connector Ball (Simulating connection to tree ornament) */}
                <mesh position={[0, 1.6, 0]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshStandardMaterial color="#D4AF37" metalness={1.0} roughness={0.1} />
                </mesh>
            </group>
            
            {/* Hook/Ring on Frame */}
            <mesh position={[0, 2.3, 0]}>
                <torusGeometry args={[0.15, 0.03, 8, 16]} />
                <meshStandardMaterial color="#D4AF37" metalness={1.0} roughness={0.2} />
            </mesh>

            {/* Gold Outer Frame */}
            {/* Expanded to 3.6 x 4.6 for luxury border */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.6, 4.6, 0.1]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* White Matting (The "white border") */}
            <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[3.2, 4.2, 0.02]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
            </mesh>
            
            {/* Photo Plane */}
            {/* Size 3x4 */}
            <mesh position={[0, 0, 0.08]}>
                <planeGeometry args={[3, 4]} />
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}
