import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CameraControllerProps {
  introState: 'waiting' | 'opening' | 'finished'
}

export function CameraController({ introState }: CameraControllerProps) {
  const { camera } = useThree()
  // Store initial position to avoid jumping if needed, but we'll hardcode for cinematic feel
  
  useEffect(() => {
    if (introState === 'waiting') {
      // Start position looking at the gift
      // Gift center is roughly at (0, 2.5, 0)
      // To center it, camera should be level or slightly above, looking directly at it
      camera.position.set(0, 2.5, 18) // Moved back slightly for better framing
      camera.lookAt(0, 2.5, 0)
    }
  }, [introState, camera])

  useFrame((state, delta) => {
    if (introState === 'opening') {
      // Move camera closer to observe the explosion, but DO NOT enter the box
      // Target position: slightly above and in front
      const target = new THREE.Vector3(0, 4, 12) 
      // Smoothly interpolate
      camera.position.lerp(target, delta * 1.5)
      camera.lookAt(0, 2.5, 0)
    }
    
    if (introState === 'finished') {
       // When finished, pull back to show the full tree
       
       // Increase Z distance to 45 to comfortably fit the whole tree
       // Center Y at 1
       const treeViewPos = new THREE.Vector3(0, 1, 45)
       
       // Smoothly pull back (Zoom out effect)
       // We removed the forced snap logic to allow for a cinematic pull-back
       camera.position.lerp(treeViewPos, delta * 1.5)
       
       // Smoothly adjust lookAt target from box center (0, 2.5, 0) to tree center (0, 10, 0)
       // Actually, (0, 1, 0) is the orbit target.
       // Let's just look at (0, 8, 0) roughly center of tree? No, OrbitControls usually targets 0,0,0
       // Let's look at 0,1,0
       const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position)
       const targetLookAt = new THREE.Vector3(0, 1, 0)
       
       // Simple lookAt is fine as lerp updates position each frame
       camera.lookAt(0, 1, 0) 
    }
  })

  return null
}
