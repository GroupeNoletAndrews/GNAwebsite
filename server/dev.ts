// Script de développement avec rechargement automatique
import { spawn } from 'child_process';
import chokidar from 'chokidar';

let serverProcess: any = null;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
  }

  console.log('🔄 Démarrage du serveur...');

  serverProcess = spawn('tsx', ['server/index.ts'], {
    stdio: 'inherit',
    shell: true,
  });

  serverProcess.on('error', (error: Error) => {
    console.error('❌ Erreur serveur:', error);
  });
}

// Démarrer le serveur
startServer();

// Surveiller les changements
const watcher = chokidar.watch(['server/**/*.ts', 'lib/email.ts'], {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('change', path => {
  console.log(`\n📝 Fichier modifié: ${path}`);
  startServer();
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  if (serverProcess) {
    serverProcess.kill();
  }
  watcher.close();
  process.exit(0);
});

