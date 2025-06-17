'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Props simplificadas
interface BoosterPackProps {
  isOpening: boolean
  onOpenComplete: (cards: any) => void
  onClose: () => void
}

// Componente simplificado
export default function BoosterPack({ isOpening, onOpenComplete, onClose }: BoosterPackProps) {
  const [mounted, setMounted] = useState(false)
  
  // Solo renderizar en el cliente
  useEffect(() => {
    setMounted(true)
    
    // Si está abierto, simular la apertura después de 2 segundos
    if (isOpening) {
      const timer = setTimeout(() => {
        const mockCards = [
          { name: 'Charizard', level: 85, isShiny: true, types: ['Fire', 'Flying'] },
          { name: 'Blastoise', level: 75, isShiny: false, types: ['Water'] },
          { name: 'Venusaur', level: 60, isShiny: false, types: ['Grass', 'Poison'] }
        ];
        onOpenComplete(mockCards);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpening, onOpenComplete]);
  
  // No renderizar nada en el servidor o si no está abriendo
  if (!mounted || !isOpening) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Premium Booster Pack</h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="h-96 flex flex-col items-center justify-center">
          <div className="relative w-64 h-96 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-xl border-4 border-yellow-300 overflow-hidden">
              <div className="absolute top-4 left-0 w-full flex justify-center">
                <div className="bg-yellow-300 w-32 h-8 rounded-full flex items-center justify-center">
                  <span className="text-yellow-800 font-bold text-sm">PREMIUM</span>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🎁</div>
              </div>
              
              <div className="absolute bottom-6 left-0 w-full flex justify-center">
                <div className="bg-yellow-300/50 backdrop-blur-sm w-48 h-12 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-800 font-bold">Pokémon Cards</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-yellow-400 font-bold">Abriendo sobre...</p>
        </div>
      </div>
    </div>
  );
} 