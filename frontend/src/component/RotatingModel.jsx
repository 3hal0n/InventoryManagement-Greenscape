// RotatingModel.js
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Statue } from './Statue';

const RotatingModel = ({ scale, position }) => {
  const modelRef = useRef();
  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    position: position,
    config: { mass: 1, tension: 170, friction: 26 }
  }));

  // Only gentle floating motion, no rotation
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Gentle floating motion only
      modelRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.001;
      // No rotation - keeping the model static
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      api.start({
        position: isMobile ? [2, -1.2, -1] : [3, -1.5, -1], // Position on the right side
        rotation: [0, 0, 0] // Keep rotation static
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [api]);

  return (
    <animated.group 
      ref={modelRef} 
      {...spring} 
      scale={scale}
    >
      <Statue />
    </animated.group>
  );
};

export default RotatingModel;
