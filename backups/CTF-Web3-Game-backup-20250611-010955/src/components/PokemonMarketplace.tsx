'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCartIcon, 
  TrendingUpIcon, 
  CreditCardIcon, 
  FilterIcon,
  SearchIcon,
  StarIcon,
  TimerIcon,
  GiftIcon,
  DollarSignIcon
} from 'lucide-react'
import { PublicKey } from '@solana/web3.js'
import { Pokemon, PokemonType } from '../types/pokemon'
import { POKEMON_TYPES } from '../data/pokemon'

interface MarketListing {
  id: string
  pokemon: Pokemon
  seller: PublicKey
  sellerUsername: string
  price: number
  listingType: 'auction' | 'instant'
  createdAt: number
  expiresAt?: number
  currentBid?: number
  bidder?: PublicKey
  isActive: boolean
}

interface MarketplaceProps {
  userPublicKey?: PublicKey
  userPokemon: Pokemon[]
  onPurchase: (listing: MarketListing) => void
  onSell: (pokemon: Pokemon, price: number, type: 'auction' | 'instant') => void
}

export default function PokemonMarketplace({ 
  userPublicKey, 
  userPokemon, 
  onPurchase, 
  onSell 
}: MarketplaceProps) {
  const [listings, setListings] = useState<MarketListing[]>([])
  const [selectedTab, setSelectedTab] = useState<'market' | 'sell' | 'my-listings'>('market')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<PokemonType | 'all'>('all')
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'none'>('none')
  const [showSellModal, setShowSellModal] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [sellPrice, setSellPrice] = useState(100)
  const [sellType, setSellType] = useState<'auction' | 'instant'>('instant')

  // Mock marketplace data
  useEffect(() => {
    const mockListings: MarketListing[] = [
      {
        id: '1',
        pokemon: {
          trainer: new PublicKey('11111111111111111111111111111112'),
          speciesId: 25,
          name: 'Pikachu',
          level: 50,
          experience: 5000,
          hp: 125,
          attack: 105,
          defense: 90,
          spAttack: 100,
          spDefense: 100,
          speed: 140,
          types: [PokemonType.Electric],
          moves: [1, 4, 8, 10],
          nature: 0,
          isShiny: true,
          caughtAt: Date.now() - 86400000,
          mint: PublicKey.unique(),
          bump: 0
        },
        seller: new PublicKey('11111111111111111111111111111113'),
        sellerUsername: 'PokemonMaster',
        price: 500,
        listingType: 'instant',
        createdAt: Date.now() - 3600000,
        isActive: true
      },
      {
        id: '2',
        pokemon: {
          trainer: new PublicKey('11111111111111111111111111111114'),
          speciesId: 150,
          name: 'Mewtwo',
          level: 80,
          experience: 12000,
          hp: 186,
          attack: 150,
          defense: 130,
          spAttack: 194,
          spDefense: 130,
          speed: 170,
          types: [PokemonType.Psychic],
          moves: [1, 10, 11, 12],
          nature: 15,
          isShiny: false,
          caughtAt: Date.now() - 172800000,
          mint: PublicKey.unique(),
          bump: 0
        },
        seller: new PublicKey('11111111111111111111111111111115'),
        sellerUsername: 'LegendaryTrainer',
        price: 2000,
        listingType: 'auction',
        createdAt: Date.now() - 7200000,
        expiresAt: Date.now() + 86400000,
        currentBid: 1800,
        bidder: new PublicKey('11111111111111111111111111111116'),
        isActive: true
      },
      {
        id: '3',
        pokemon: {
          trainer: new PublicKey('11111111111111111111111111111117'),
          speciesId: 4,
          name: 'Charmander',
          level: 15,
          experience: 800,
          hp: 54,
          attack: 67,
          defense: 58,
          spAttack: 75,
          spDefense: 65,
          speed: 80,
          types: [PokemonType.Fire],
          moves: [1, 2, 6, 10],
          nature: 3,
          isShiny: false,
          caughtAt: Date.now() - 43200000,
          mint: PublicKey.unique(),
          bump: 0
        },
        seller: new PublicKey('11111111111111111111111111111118'),
        sellerUsername: 'StarterCollector',
        price: 150,
        listingType: 'instant',
        createdAt: Date.now() - 1800000,
        isActive: true
      }
    ]
    
    setListings(mockListings)
  }, [])

  const filteredListings = listings
    .filter(listing => {
      if (!listing.isActive) return false
      if (searchTerm && !listing.pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (typeFilter !== 'all' && !listing.pokemon.types.includes(typeFilter)) return false
      return true
    })
    .sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price
      if (priceSort === 'desc') return b.price - a.price
      return b.createdAt - a.createdAt
    })

  const handleSellPokemon = () => {
    if (!selectedPokemon) return

    const newListing: MarketListing = {
      id: Date.now().toString(),
      pokemon: selectedPokemon,
      seller: userPublicKey!,
      sellerUsername: 'You',
      price: sellPrice,
      listingType: sellType,
      createdAt: Date.now(),
      expiresAt: sellType === 'auction' ? Date.now() + 86400000 : undefined,
      isActive: true
    }

    onSell(selectedPokemon, sellPrice, sellType)
    setListings(prev => [...prev, newListing])
    setShowSellModal(false)
    setSelectedPokemon(null)
  }

  const getRarityColor = (pokemon: Pokemon) => {
    if (pokemon.isShiny) return 'from-yellow-400 to-orange-500'
    if (pokemon.level >= 80) return 'from-purple-400 to-pink-500'
    if (pokemon.level >= 50) return 'from-blue-400 to-indigo-500'
    return 'from-gray-400 to-gray-600'
  }

  const getRarityLabel = (pokemon: Pokemon) => {
    if (pokemon.isShiny) return 'Shiny'
    if (pokemon.level >= 80) return 'Legendary'
    if (pokemon.level >= 50) return 'Rare'
    return 'Common'
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <ShoppingCartIcon className="w-8 h-8 mr-3 text-green-400" />
          Pokémon Marketplace
        </h2>
        <p className="text-gray-300">Trade NFT Pokémon with other trainers worldwide</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-6">
        {[
          { id: 'market', label: 'Browse Market', icon: ShoppingCartIcon },
          { id: 'sell', label: 'Sell Pokémon', icon: DollarSignIcon },
          { id: 'my-listings', label: 'My Listings', icon: TrendingUpIcon }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              selectedTab === tab.id
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Market Tab */}
      {selectedTab === 'market' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Pokémon..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as PokemonType)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">All Types</option>
                  {Object.entries(POKEMON_TYPES).map(([type, info]) => (
                    <option key={type} value={type}>{info.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Sort</label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="none">Latest First</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-300">
                  {filteredListings.length} listings found
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <motion.div
                key={listing.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  {/* Pokemon Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(listing.pokemon)} rounded-full flex items-center justify-center text-2xl`}>
                      {listing.pokemon.isShiny ? '✨' : '⚡'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white">{listing.pokemon.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          listing.pokemon.isShiny ? 'bg-yellow-500/20 text-yellow-400' :
                          listing.pokemon.level >= 80 ? 'bg-purple-500/20 text-purple-400' :
                          listing.pokemon.level >= 50 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {getRarityLabel(listing.pokemon)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">Level {listing.pokemon.level}</div>
                      <div className="flex space-x-1 mt-1">
                        {listing.pokemon.types.map(type => (
                          <span
                            key={type}
                            className="px-2 py-0.5 text-xs rounded"
                            style={{ backgroundColor: POKEMON_TYPES[type].color + '40' }}
                          >
                            {POKEMON_TYPES[type].name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-300">
                      Seller: <span className="text-white">{listing.sellerUsername}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Listed {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="border-t border-white/10 pt-4">
                    {listing.listingType === 'auction' ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Current Bid</span>
                          <span className="text-lg font-bold text-green-400">
                            {listing.currentBid || listing.price} PC
                          </span>
                        </div>
                        {listing.expiresAt && (
                          <div className="flex items-center text-xs text-yellow-400">
                            <TimerIcon className="w-3 h-3 mr-1" />
                            Ends in {Math.ceil((listing.expiresAt - Date.now()) / 3600000)}h
                          </div>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onPurchase(listing)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-lg font-bold"
                        >
                          Place Bid
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Price</span>
                          <span className="text-lg font-bold text-green-400">{listing.price} PC</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onPurchase(listing)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center space-x-2"
                        >
                          <CreditCardIcon className="w-4 h-4" />
                          <span>Buy Now</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sell Tab */}
      {selectedTab === 'sell' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Select Pokémon to Sell</h3>
          
          {userPokemon.length === 0 ? (
            <div className="text-center py-12">
              <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No Pokémon Available</h4>
              <p className="text-gray-400">Catch some Pokémon first to start selling!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPokemon.map(pokemon => (
                <motion.button
                  key={pokemon.mint.toString()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPokemon(pokemon)
                    setShowSellModal(true)
                  }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-green-400 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(pokemon)} rounded-full flex items-center justify-center text-lg`}>
                      {pokemon.isShiny ? '✨' : '⚡'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{pokemon.name}</div>
                      <div className="text-sm text-gray-300">Level {pokemon.level}</div>
                      <div className="text-xs text-green-400">{getRarityLabel(pokemon)}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sell Modal */}
      <AnimatePresence>
        {showSellModal && selectedPokemon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/20 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Sell {selectedPokemon.name}</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Listing Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSellType('instant')}
                      className={`p-3 rounded-lg border transition-all ${
                        sellType === 'instant'
                          ? 'border-green-400 bg-green-400/20 text-green-400'
                          : 'border-gray-600 bg-gray-800 text-gray-300'
                      }`}
                    >
                      Instant Sale
                    </button>
                    <button
                      onClick={() => setSellType('auction')}
                      className={`p-3 rounded-lg border transition-all ${
                        sellType === 'auction'
                          ? 'border-orange-400 bg-orange-400/20 text-orange-400'
                          : 'border-gray-600 bg-gray-800 text-gray-300'
                      }`}
                    >
                      Auction
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {sellType === 'auction' ? 'Starting Price' : 'Price'} (PokéCoins)
                  </label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSellPokemon}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex-1"
                  >
                    List for Sale
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowSellModal(false)
                      setSelectedPokemon(null)
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 