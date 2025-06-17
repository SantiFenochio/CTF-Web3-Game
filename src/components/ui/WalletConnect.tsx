'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWalletStore } from '@/store/walletStore'

export default function WalletConnect() {
  const { publicKey, connected, connecting } = useWallet()
  const { setConnection, connectWallet } = useWalletStore()

  useEffect(() => {
    if (connected && publicKey) {
      // Update the wallet store when wallet connects
      connectWallet()
    }
  }, [connected, publicKey, connectWallet])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="wallet-connect-container"
    >
      {!connected ? (
        <div className="text-center">
          <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700 !rounded-lg !px-8 !py-3 !text-lg !font-semibold !transition-all !duration-200" />
          <p className="text-sm text-gray-400 mt-2">
            Conecta tu wallet para empezar a jugar
          </p>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Conectado</span>
          </div>
          <WalletMultiButton className="!bg-gray-700 hover:!bg-gray-600 !rounded-lg !px-4 !py-2" />
        </div>
      )}
    </motion.div>
  )
} 