"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Cake icons ya images ki list
const CAKE_ICONS = ['🎂', '🍰', '🧁', '🎁', '✨'];

const FallingCakes = () => {
  const [items, setItems] = useState<{ id: number; x: number; icon: string }[]>([]);

  useEffect(() => {
    // Har 500ms mein ek naya cake add karne ke liye interval
    const interval = setInterval(() => {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100, // Screen ki random width (%)
          icon: CAKE_ICONS[Math.floor(Math.random() * CAKE_ICONS.length)],
        },
      ]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Purane items ko remove karna taaki memory full na ho
  useEffect(() => {
    if (items.length > 20) {
      setItems((prev) => prev.slice(1));
    }
  }, [items]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: -50, x: `${item.x}vw`, opacity: 0, rotate: 0 }}
            animate={{ 
              y: '110vh', 
              opacity: [0, 1, 1, 0], 
              rotate: 360 
            }}
            transition={{ 
              duration: 4, 
              ease: "linear" 
            }}
            className="absolute text-4xl"
          >
            {item.icon}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FallingCakes;