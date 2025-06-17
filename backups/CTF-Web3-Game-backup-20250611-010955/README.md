# 🚩 CTF Web3 Game

Juego de Capture The Flag (CTF) construido en la blockchain de Solana con generación de banderas mediante inteligencia artificial (DALL-E de OpenAI).

## 🌟 Características principales

- **Generación de banderas AI** con DALL-E 3 de OpenAI
- **Smart Contract en Solana** para la lógica del juego
- **NFTs únicos** para cada bandera capturada
- **Sistema de equipos** (Rojo vs Azul)
- **UI moderna** con Next.js y Tailwind CSS
- **Integración Web3** con Wallet Adapter de Solana

## 📋 Requisitos previos

- Node.js 18+ y npm
- Una API key de OpenAI (para la generación de banderas)
- Una wallet de Solana (Phantom o Solflare recomendados)

## 🚀 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/CTF-Web3-Game.git
   cd CTF-Web3-Game
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:
   ```
   # OpenAI API Key - Necesario para la generación de banderas
   OPENAI_API_KEY=tu_api_key_aqui
   
   # Solana Cluster - Configuración para la conexión a Solana
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   
   # Program ID - La dirección del programa en la blockchain de Solana
   NEXT_PUBLIC_PROGRAM_ID=tu_program_id_aqui
   ```

## 🎮 Uso

### Modo desarrollo

Usa uno de los siguientes comandos según tu sistema operativo:

**Windows:**
```
run-dev.bat
```

**Linux/Mac:**
```
chmod +x run-dev.sh
./run-dev.sh
```

O manualmente:
```
npm run dev
```

### Modo producción

Usa uno de los siguientes comandos según tu sistema operativo:

**Windows:**
```
run-app.bat
```

**Linux/Mac:**
```
chmod +x run-app.sh
./run-app.sh
```

O manualmente:
```
npm run build
npm run start
```

## 🧪 Prueba de generación de banderas

Una vez que el servidor esté en ejecución, puedes probar la generación de banderas en:

- http://localhost:3000/test-flag-api.html

Esta página te permitirá probar la API de generación de banderas con diferentes prompts, equipos y estilos.

## 🔧 Estructura del proyecto

```
CTF-Web3-Game/
├── public/             # Archivos estáticos
├── src/
│   ├── app/            # Páginas de Next.js App Router
│   │   ├── api/        # API Routes (generación de banderas)
│   │   └── page.tsx    # Página principal
│   ├── components/     # Componentes React
│   ├── store/          # Estado global (Zustand)
│   ├── types/          # Definiciones de tipos
│   └── utils/          # Utilidades
├── solana-program/     # Programa de Solana
└── .env.local          # Variables de entorno (debes crearla)
```

## 🌐 API de generación de banderas

La API está disponible en `/api/generate-flag` y acepta solicitudes POST con el siguiente formato:

```json
{
  "prompt": "Un dragón feroz con espadas cruzadas",
  "team": "red",
  "style": "realistic"
}
```

Parámetros:
- `prompt`: Descripción de la bandera
- `team`: `red` o `blue` (afecta los colores)
- `style`: `realistic`, `cartoon`, `pixel` o `abstract`

## 📱 Desarrollo

Para contribuir al proyecto:

1. Realiza un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Envía un pull request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces

- **Demo Live**: [https://pokemon-solana.vercel.app](https://pokemon-solana.vercel.app)
- **Smart Contract**: [Ver en Solana Explorer](https://explorer.solana.com/address/PokeGamE1111111111111111111111111111111111111?cluster=devnet)
- **Discord**: [Únete a la comunidad](https://discord.gg/pokemon-solana)
- **Twitter**: [@PokemonSolana](https://twitter.com/PokemonSolana)

## 🙏 Reconocimientos

- **Pokémon Company**: Por la inspiración del universo Pokémon
- **Smogon**: Por las mecánicas de Pokémon Showdown
- **Solana Foundation**: Por la blockchain de alta velocidad
- **Anchor Protocol**: Por el framework de desarrollo

---

**¡Construido con ❤️ para la comunidad Web3 y Pokémon!**

*Gotta catch 'em all... on the blockchain!* ⚡🔗 