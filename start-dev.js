const { spawn } = require('child_process');
const path = require('path');

// Función para iniciar un proceso
function startProcess(command, args, name) {
  console.log(`Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    stdio: 'pipe',
    shell: true
  });
  
  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });
  
  process.on('close', (code) => {
    console.log(`${name} se cerró con código ${code}`);
  });
  
  return process;
}

// Iniciar servidor Next.js
const nextServer = startProcess('npm', ['run', 'dev'], 'Next.js');

// Iniciar servidor de batallas WebSocket
const battleServer = startProcess('node', ['server/battleServer.js'], 'Battle Server');

// Manejar señales para cerrar correctamente
process.on('SIGINT', () => {
  console.log('Cerrando servidores...');
  
  nextServer.kill();
  battleServer.kill();
  
  process.exit(0);
});

console.log('\n=================================================');
console.log('Servidores iniciados:');
console.log('- Next.js: http://localhost:3000');
console.log('- Battle Server WebSocket: ws://localhost:3001');
console.log('=================================================\n');
console.log('Presiona Ctrl+C para detener ambos servidores.\n'); 