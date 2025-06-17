@echo off
echo ================================================
echo    Creando respaldo de CTF Web3 Game
echo ================================================
echo.

set BACKUP_NAME=CTF-Web3-Game-backup-%date:~-4,4%%date:~-7,2%%date:~-10,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_NAME=%BACKUP_NAME: =0%

echo Creando carpeta de respaldo %BACKUP_NAME%...
mkdir "backups" 2>nul
mkdir "backups\%BACKUP_NAME%"

echo.
echo Copiando archivos...

rem Copiar archivos de código fuente
xcopy "src" "backups\%BACKUP_NAME%\src\" /E /I /H /Y
xcopy "public" "backups\%BACKUP_NAME%\public\" /E /I /H /Y
xcopy "solana-program" "backups\%BACKUP_NAME%\solana-program\" /E /I /H /Y

rem Copiar archivos de configuración
copy "package.json" "backups\%BACKUP_NAME%\"
copy "package-lock.json" "backups\%BACKUP_NAME%\"
copy "next.config.js" "backups\%BACKUP_NAME%\"
copy "tsconfig.json" "backups\%BACKUP_NAME%\"
copy "tailwind.config.js" "backups\%BACKUP_NAME%\"
copy "postcss.config.js" "backups\%BACKUP_NAME%\"
copy ".env.local" "backups\%BACKUP_NAME%\" 2>nul

rem Copiar archivos adicionales
copy "README.md" "backups\%BACKUP_NAME%\"
copy "GAME_FEATURES.md" "backups\%BACKUP_NAME%\"
copy "CODIGO_OPTIMIZADO.md" "backups\%BACKUP_NAME%\"
copy "test-flag-api.html" "backups\%BACKUP_NAME%\"

rem Copiar scripts
copy "run-app.bat" "backups\%BACKUP_NAME%\"
copy "run-dev.bat" "backups\%BACKUP_NAME%\"
copy "run-app.sh" "backups\%BACKUP_NAME%\"
copy "run-dev.sh" "backups\%BACKUP_NAME%\"

echo.
echo ¡Respaldo completado en la carpeta "backups\%BACKUP_NAME%"!
echo.
echo Puedes restaurar este respaldo copiando los archivos de vuelta
echo a la carpeta principal del proyecto.
echo.
pause 