import { contextBridge, ipcRenderer } from 'electron';

/**
 * API expuesta al renderer process (React)
 * 
 * Esta API es accesible en el frontend como: window.api
 * 
 * Nota: Por ahora está vacía, pero aquí irán todos los
 * métodos para comunicarse con el backend (guardar, cargar, etc.)
 */
const api = {
  // Por ahora solo un método de ejemplo
  ping: () => 'pong',
  
  // Aquí irán métodos como:
  // character: {
  //   save: (data) => ipcRenderer.invoke('character:save', data),
  //   load: (path) => ipcRenderer.invoke('character:load', path),
  // },
};

/**
 * Exponer API de forma segura al renderer
 */
contextBridge.exposeInMainWorld('api', api);

/**
 * TypeScript: definir tipos para window.api
 */
export type ElectronAPI = typeof api;

// Declaración global para TypeScript
declare global {
  interface Window {
    api: ElectronAPI;
  }
}
