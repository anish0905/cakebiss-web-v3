"use client";
import React, { Suspense, useRef } from "react";
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
import { motion, Variants } from "framer-motion"; // Variants import kiya
import * as THREE from "three";

// --- PNG to 3D Plane Component ---
function CakeImageModel({ url }: { url: string }) {
  const texture = useTexture(url);
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
        emissive={new THREE.Color("#ff4d6d")}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

const CakeHero = () => {
  // Animation Variants with explicit Types
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3, 
        delayChildren: 0.5 
      }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] // "easeOut" ki jagah cubic-bezier use kiya (Type Safe)
      } 
    }
  };

  return (
    <section className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col md:flex-row items-center">
      
      {/* ⚡ Background Effects */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#ff4d6d15] to-transparent pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#7209b7] rounded-full blur-[150px] opacity-20" />

      {/* 🖋️ Left Side: Rich Text Content */}
      <motion.div 
        className="relative z-10 w-full md:w-1/2 px-8 md:pl-24 flex flex-col justify-center"
        variants={containerVars}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={itemVars} className="text-[#ff4d6d] font-bold tracking-[0.3em] uppercase mb-4 block mt-14">
          Premium Dessert Experience
        </motion.span>

        <h1 
          className="text-6xl md:text-9xl font-[1000] text-white leading-[0.85] tracking-tighter mb-6 italic"
          style={{
            textShadow: "10px 10px 20px rgba(0,0,0,1), 0 0 20px rgba(255,77,109,0.2)"
          }}
        >
          PURE <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] via-[#f9829b] to-[#ff4d6d] bg-[length:200%_auto] animate-gradient-flow italic">
            DELIGHT.
          </span>
        </h1>

        <motion.p variants={itemVars} className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed mb-10">
          Hum banate hain sirf desserts nahi, balki ek yaadgar anubhav. Har bite mein premium quality aur 3D art ka sangam. 
        </motion.p>

        <motion.div variants={itemVars} className="flex flex-wrap gap-6">
          <button className="px-10 py-4 bg-[#ff4d6d] text-white rounded-full font-bold shadow-[0_10px_30px_rgba(255,77,109,0.3)] hover:scale-105 transition-all active:scale-95">
            Book Now — ₹999
          </button>
          <button className="px-10 py-4 border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-all">
            Explore Flavors
          </button>
        </motion.div>

        <motion.div variants={itemVars} className="mt-16 flex gap-10 border-t border-white/10 pt-10">
          <div>
            <h3 className="text-white text-2xl font-bold">12k+</h3>
            <p className="text-gray-500 text-sm">Happy Clients</p>
          </div>
          <div>
            <h3 className="text-white text-2xl font-bold">4.9/5</h3>
            <p className="text-gray-500 text-sm">Top Rated</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 🎨 Right Side: 3D Canvas */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }} 
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          duration: 1.8, 
          ease: [0.34, 1.56, 0.64, 1] // "backOut" ka cubic-bezier equivalent
        }} 
        className="relative w-full md:w-1/2 h-[70vh] md:h-full cursor-grab active:cursor-grabbing"
      >
        <Canvas dpr={[1, 2]} shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />
          <ambientLight intensity={0.4} /> 
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />
          <pointLight position={[-5, 2, -5]} intensity={3} color="#ff4d6d" />
          <pointLight position={[5, -2, -5]} intensity={2} color="#f9829b" />

          <Suspense fallback={null}>
            <Sparkles count={120} scale={8} size={3} speed={0.4} color="#ff4d6d" />
          <PresentationControls
  global
  snap={true} 
  speed={1.5} // 'config' ki jagah 'speed' use karein smoothness ke liye
  rotation={[0, -0.2, 0]}
  polar={[-Math.PI / 3, Math.PI / 3]}
  azimuth={[-Math.PI / 2, Math.PI / 2]}
>
  <Float 
    speed={5} 
    rotationIntensity={0.6} 
    floatIntensity={1.5}
  >
    <CakeImageModel url="/models/cakeimg.png" />
  </Float>
</PresentationControls>
            <ContactShadows position={[0, -2.8, 0]} opacity={0.8} scale={15} blur={2.5} far={4.5} color="#ff4d6d" />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ff4d6d20] rounded-full blur-[100px] -z-10" />
      </motion.div>

    </section>
  );
};

export default CakeHero;