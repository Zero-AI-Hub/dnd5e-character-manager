import { app, BrowserWindow } from 'electron';
import path from 'path';

/**
 * Ventana principal de la aplicación
 */
let mainWindow: BrowserWindow | null = null;

/**
 * Determina la URL de desarrollo o producción
 */
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

/**
 * Crea la ventana principal de Electron
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      // Preload script para comunicación segura
      preload: path.join(__dirname, 'preload.js'),
      // Seguridad: deshabilitar nodeIntegration
      nodeIntegration: false,
      // Seguridad: habilitar contextIsolation
      contextIsolation: true,
    },
    // Ocultar hasta que esté lista (evita flash blanco)
    show: false,
  });

  // Cargar la aplicación
  if (VITE_DEV_SERVER_URL) {
    // Modo desarrollo: cargar desde Vite dev server
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    // Abrir DevTools en desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    // Modo producción: cargar HTML compilado
    mainWindow.loadFile(path.join(__dirname, '../dist-renderer/index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Limpiar referencia cuando se cierra
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Evento: Electron está listo
 */
app.whenReady().then(() => {
  createWindow();

  // En macOS, recrear ventana al hacer click en el dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Evento: Todas las ventanas cerradas
 */
app.on('window-all-closed', () => {
  // En macOS, las apps se mantienen activas hasta Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Logging básico
 */
console.log('Electron app starting...');
console.log('Node version:', process.versions.node);
console.log('Electron version:', process.versions.electron);
console.log('Chrome version:', process.versions.chrome);
