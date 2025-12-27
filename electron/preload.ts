import { contextBridge, ipcRenderer } from 'electron';

/**
 * Tipos de respuesta de operaciones de archivo
 */
interface SaveResult {
  success: boolean;
  canceled?: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

interface LoadResult {
  success: boolean;
  canceled?: boolean;
  data?: string;
  filePath?: string;
  fileName?: string;
  error?: string;
}

/**
 * API expuesta al renderer process (React)
 * 
 * Esta API es accesible en el frontend como: window.api
 */
const api = {
  // Ping de prueba
  ping: () => 'pong',

  // Operaciones de personaje
  character: {
    /**
     * Guarda un personaje a archivo
     * @param data - JSON string del personaje
     * @param filePath - Ruta opcional (si no se provee, muestra diálogo)
     */
    save: (data: string, filePath?: string): Promise<SaveResult> =>
      ipcRenderer.invoke('character:save', data, filePath),

    /**
     * Carga un personaje desde archivo
     * @param filePath - Ruta opcional (si no se provee, muestra diálogo)
     */
    load: (filePath?: string): Promise<LoadResult> =>
      ipcRenderer.invoke('character:load', filePath),
  },

  // Operaciones de sistema de archivos
  file: {
    /**
     * Verifica si un archivo existe
     */
    exists: (filePath: string): Promise<boolean> =>
      ipcRenderer.invoke('file:exists', filePath),
  },

  // Rutas del sistema
  path: {
    /**
     * Obtiene la ruta del directorio de documentos del usuario
     */
    documents: (): Promise<string> =>
      ipcRenderer.invoke('path:documents'),
  },
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
