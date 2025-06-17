'use client'

import { useState } from 'react'
import { getPokemonSpriteUrl, getPokemonBackSpriteUrl, getFallbackSpriteUrl } from '../utils/pokemonSprites'

interface PokemonSpriteProps {
  speciesId: number
  isShiny?: boolean
  isBackView?: boolean
  className?: string
  size?: number
  showFallbackOnError?: boolean
}

export default function PokemonSprite({
  speciesId,
  isShiny = false,
  isBackView = false,
  className = '',
  size = 120,
  showFallbackOnError = true
}: PokemonSpriteProps) {
  const [error, setError] = useState(false)
  const [secondaryError, setSecondaryError] = useState(false)
  
  // Get the appropriate sprite URL
  const getSpriteUrl = () => {
    if (secondaryError) {
      // Use a local placeholder image as last resort
      return '/images/pokeball.svg'
    }
    
    if (error && showFallbackOnError) {
      return getFallbackSpriteUrl(speciesId, isShiny)
    }
    
    return isBackView 
      ? getPokemonBackSpriteUrl(speciesId, isShiny)
      : getPokemonSpriteUrl(speciesId, isShiny)
  }
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <img
        src={getSpriteUrl()}
        alt={`Pokemon #${speciesId}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        onError={() => {
          if (!error && showFallbackOnError) {
            setError(true)
          } else if (error && !secondaryError) {
            setSecondaryError(true)
          }
        }}
      />
    </div>
  )
} 