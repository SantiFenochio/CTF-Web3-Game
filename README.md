# 🎮 Pokémon Solana Game
Juego de Pokémon en la blockchain de Solana con NFTs y batallas PvP.

## 🌟 Características
- **NFTs de Pokémon** en Solana
- **Batallas PvP** con mecánicas tipo Pokémon Showdown  
- **Smart Contract** para lógica del juego
- **UI moderna** con Next.js y Tailwind CSS

## 📋 Requisitos
- Node.js 18+ y npm
- Wallet de Solana (Phantom o Solflare)

## 🚀 Instalación
1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Crea `.env.local`:
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_PROGRAM_ID=tu_program_id_aqui
   ```

## 🎮 Uso
**Desarrollo:** `run-dev.bat` o `npm run dev`
**Producción:** `run-app.bat` o `npm run build && npm run start`

## 🔧 Estructura
```
src/
├── app/            # Páginas Next.js
├── components/     # Componentes React  
├── store/          # Estado global
├── types/          # Tipos TypeScript
└── utils/          # Utilidades
```

## 📄 Licencia
MIT