/**
 * Utility functions for Pokemon sprites
 */

/**
 * Get the sprite URL for a Pokemon
 * Uses sprites from Smogon's Pokemon Showdown
 * 
 * @param speciesId Pokemon species ID (National Dex number)
 * @param isShiny Whether to return the shiny sprite
 * @returns URL to the sprite image
 */
export function getPokemonSpriteUrl(speciesId: number, isShiny: boolean = false): string {
  // Base URL for Pokemon Showdown sprites
  const baseUrl = 'https://play.pokemonshowdown.com/sprites';
  
  // Format the species ID with leading zeros (e.g. 25 -> 025)
  const formattedId = String(speciesId).padStart(3, '0');
  
  // Choose between normal and shiny sprites
  const spriteType = isShiny ? 'ani-shiny' : 'ani';
  
  // Return the full URL
  return `${baseUrl}/${spriteType}/${formattedId}.gif`;
}

/**
 * Get the back sprite URL for a Pokemon
 * 
 * @param speciesId Pokemon species ID (National Dex number)
 * @param isShiny Whether to return the shiny sprite
 * @returns URL to the back sprite image
 */
export function getPokemonBackSpriteUrl(speciesId: number, isShiny: boolean = false): string {
  // Base URL for Pokemon Showdown sprites
  const baseUrl = 'https://play.pokemonshowdown.com/sprites';
  
  // Format the species ID with leading zeros (e.g. 25 -> 025)
  const formattedId = String(speciesId).padStart(3, '0');
  
  // Choose between normal and shiny sprites
  const spriteType = isShiny ? 'ani-back-shiny' : 'ani-back';
  
  // Return the full URL
  return `${baseUrl}/${spriteType}/${formattedId}.gif`;
}

/**
 * Fallback sprite URL if the main sprite fails to load
 * Uses static sprites instead of animated ones
 * 
 * @param speciesId Pokemon species ID (National Dex number)
 * @param isShiny Whether to return the shiny sprite
 * @returns URL to the fallback sprite image
 */
export function getFallbackSpriteUrl(speciesId: number, isShiny: boolean = false): string {
  // Base URL for Pokemon Showdown sprites
  const baseUrl = 'https://play.pokemonshowdown.com/sprites';
  
  // Format the species ID with leading zeros (e.g. 25 -> 025)
  const formattedId = String(speciesId).padStart(3, '0');
  
  // Choose between normal and shiny sprites
  const spriteType = isShiny ? 'gen5-shiny' : 'gen5';
  
  // Return the full URL
  return `${baseUrl}/${spriteType}/${formattedId}.png`;
} 