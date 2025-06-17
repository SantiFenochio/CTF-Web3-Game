@echo off
echo ================================================
echo    Iniciando CTF Web3 Game en modo desarrollo
echo ================================================
echo.
echo Verificando si existe el archivo .env.local...

if not exist .env.local (
    echo ERROR: No se encontro el archivo .env.local
    echo Por favor, crea el archivo .env.local con el siguiente contenido:
    echo.
    echo # OpenAI API Key - Necesario para la generacion de banderas
    echo OPENAI_API_KEY=tu_api_key_aqui
    echo.
    echo # Solana Cluster - Configuracion para la conexion a Solana
    echo NEXT_PUBLIC_SOLANA_NETWORK=devnet
    echo.
    echo # Program ID - La direccion del programa en la blockchain de Solana
    echo NEXT_PUBLIC_PROGRAM_ID=tu_program_id_aqui
    echo.
    pause
    exit /b 1
)

echo.
echo Iniciando servidor de desarrollo...
echo.
echo La aplicacion estara disponible en: http://localhost:3000
echo La API de generacion de banderas en: http://localhost:3000/api/generate-flag
echo La prueba de banderas en: http://localhost:3000/test-flag-api.html
echo.
echo Presiona Ctrl+C para detener el servidor.
echo.

call npm run dev 