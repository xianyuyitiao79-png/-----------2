import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function SnowyGround() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Use standard noise texture if available, or just procedural noise in shader
  // For simplicity and elegance, MeshReflectorMaterial provides a great "ice/snow" look
  
  return (
    <group position={[0, -10, 0]}>
      {/* Main Ground Plane */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 64, 64]} />
        <MeshReflectorMaterial
          blur={[400, 100]} // Blur ground reflections (width, height), 0 skips blur
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
          mixBlur={1} // How much blur mixes with surface roughness (default = 1)
          mixStrength={1.5} // Strength of the reflection
          roughness={0.6} // Roughness of the surface
          depthScale={1} // Scale the depth factor (0 = no depth, default = 0)
          minDepthThreshold={0.4} // Lower edge for the depthTexture interpolation (default = 0)
          maxDepthThreshold={1.4} // Upper edge for the depthTexture interpolation (default = 0)
          color="#151515" // Base color of the ground (Dark snow/ice)
          metalness={0.4}
          mirror={0.2} // Mirror intensity
        />
      </mesh>

      {/* Soft Snow Mounds (Simple spheres or displaced plane) */}
      {/* We can add a few soft white glows to simulate snow accumulation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
         <ringGeometry args={[0, 15, 64]} />
         <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.05} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
         />
      </mesh>
      
      {/* Golden Reflection Hint */}
      <pointLight position={[0, 2, 0]} intensity={2} color="#D4AF37" distance={15} decay={2} />
    </group>
  )
}
