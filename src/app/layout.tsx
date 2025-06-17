import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CTF Web3 Game - Capture the Flag en Solana',
  description: 'Un juego de captura la bandera moderno construido en la blockchain de Solana con generación de imágenes AI.',
  keywords: ['web3', 'solana', 'capture-the-flag', 'blockchain', 'gaming', 'ai'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-game-dark text-white antialiased`}>
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151',
              },
              success: {
                style: {
                  border: '1px solid #16a34a',
                },
              },
              error: {
                style: {
                  border: '1px solid #dc2626',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 