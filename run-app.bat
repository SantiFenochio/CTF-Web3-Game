@echo off
echo ================================================
echo    Iniciando CTF Web3 Game en produccion
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

echo Construyendo la aplicacion...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la construccion de la aplicacion.
    pause
    exit /b 1
)

echo.
echo Iniciando servidor...
echo.
echo La aplicacion estara disponible en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor.
echo.

call npm run start 