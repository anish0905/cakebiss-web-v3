"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  useTexture, 
  Float, 
  PresentationControls,
  ContactShadows,
  Environment,
  Sparkles,
  PerspectiveCamera
} from "@react-three/drei";
import { motion } from "framer-motion"; 
import * as THREE from "three";

function CakeImageModel({ url }: { url: string }) {
  const texture = useTexture(url);
  
  // Image ko sharp karne ke liye settings
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.15;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[4.5, 4.5, 1]}> 
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial 
        map={texture} 
        transparent={true} 
        side={THREE.DoubleSide} 
        alphaTest={0.5}
        emissive={new THREE.Color("#ffffff")}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

const CakeHero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-screen bg-[#0a0a0a]" />;

  return (
    <section className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col md:flex-row items-center">
      
      {/* 🌑 Mobile Dark Overlay - No Blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-20 md:hidden pointer-events-none" />

      {/* 🖋️ Text Section */}
      <div className="relative z-30 w-full md:w-1/2 px-6 md:pl-24 flex flex-col justify-center mt-20 md:mt-0 text-center md:text-left">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#ff4d6d] font-black tracking-[0.3em] uppercase mb-4 block text-[10px]">
          Premium Dessert Experience
        </motion.span>
        <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-6 italic">
          PURE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] via-[#f9829b] to-[#ff4d6d] bg-[length:200%_auto] animate-gradient-flow italic">
            DELIGHT.
          </span>
        </h1>
        <p className="text-gray-200 md:text-gray-400 text-sm md:text-xl max-w-md mx-auto md:mx-0 leading-relaxed mb-10 font-medium">
          Hum banate hain sirf desserts nahi, balki ek yaadgar anubhav. Har bite mein premium quality.
        </p>
        <div className="flex justify-center md:justify-start">
           <button className="px-10 py-4 bg-[#ff4d6d] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">
             Order Now — ₹999
           </button>
        </div>
      </div>

      {/* 🎨 3D Canvas Section */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }} 
        // Mobile: 40% opacity (No Blur) | Desktop: 100% Opacity
        className="absolute md:relative w-full h-full md:w-1/2 md:h-full z-10 opacity-40 md:opacity-100 transition-all duration-700"
      >
        <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={35} />
          <ambientLight intensity={1} /> 
          <pointLight position={[-5, 5, 5]} intensity={2} color="#ffffff" />
          
          <Suspense fallback={null}>
            <Sparkles count={40} scale={6} size={2} speed={0.3} color="#ffffff" />
            <PresentationControls
              global
              snap={true} 
              speed={1.2}
              rotation={[0, -0.2, 0]}
              polar={[-0.1, 0.1]}
              azimuth={[-0.3, 0.3]}
            >
              <Float speed={3} rotationIntensity={0.4} floatIntensity={1}>
                <CakeImageModel url="/models/cakeimg.png" />
              </Float>
            </PresentationControls>
            {/* Blur ko 0 kar diya gaya hai */}
            <ContactShadows position={[0, -2.8, 0]} opacity={0.6} scale={10} blur={0} far={4} color="#000" />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </motion.div>

    </section>
  );
};

export default CakeHero;