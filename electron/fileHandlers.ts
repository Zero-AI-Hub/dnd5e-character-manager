/**
 * Manejadores IPC para operaciones de archivos
 * 
 * Estos handlers se registran en el proceso principal de Electron
 * y permiten al renderer guardar/cargar personajes de forma segura.
 */
import { ipcMain, dialog, BrowserWindow } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Extensión por defecto para archivos de personaje
const CHARACTER_EXTENSION = '.dnd5e';

/**
 * Registra todos los handlers IPC para operaciones de archivos
 */
export function registerFileHandlers(): void {
    // Guardar personaje
    ipcMain.handle('character:save', async (_event, data: string, filePath?: string) => {
        try {
            let targetPath = filePath;

            if (!targetPath) {
                // Mostrar diálogo de guardar
                const window = BrowserWindow.getFocusedWindow();
                const result = await dialog.showSaveDialog(window!, {
                    title: 'Guardar Personaje',
                    defaultPath: 'personaje' + CHARACTER_EXTENSION,
                    filters: [
                        { name: 'D&D 5e Character', extensions: ['dnd5e'] },
                        { name: 'JSON', extensions: ['json'] },
                    ],
                });

                if (result.canceled || !result.filePath) {
                    return { success: false, canceled: true };
                }

                targetPath = result.filePath;
            }

            // Asegurar extensión correcta
            if (!targetPath.endsWith(CHARACTER_EXTENSION) && !targetPath.endsWith('.json')) {
                targetPath += CHARACTER_EXTENSION;
            }

            // Escribir archivo
            await fs.writeFile(targetPath, data, 'utf-8');

            return {
                success: true,
                filePath: targetPath,
                fileName: path.basename(targetPath),
            };
        } catch (error) {
            console.error('Error saving character:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    });

    // Cargar personaje
    ipcMain.handle('character:load', async (_event, filePath?: string) => {
        try {
            let targetPath = filePath;

            if (!targetPath) {
                // Mostrar diálogo de abrir
                const window = BrowserWindow.getFocusedWindow();
                const result = await dialog.showOpenDialog(window!, {
                    title: 'Abrir Personaje',
                    filters: [
                        { name: 'D&D 5e Character', extensions: ['dnd5e'] },
                        { name: 'JSON', extensions: ['json'] },
                        { name: 'All Files', extensions: ['*'] },
                    ],
                    properties: ['openFile'],
                });

                if (result.canceled || result.filePaths.length === 0) {
                    return { success: false, canceled: true };
                }

                targetPath = result.filePaths[0];
            }

            // Leer archivo
            const data = await fs.readFile(targetPath, 'utf-8');

            return {
                success: true,
                data,
                filePath: targetPath,
                fileName: path.basename(targetPath),
            };
        } catch (error) {
            console.error('Error loading character:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    });

    // Verificar si un archivo existe
    ipcMain.handle('file:exists', async (_event, filePath: string) => {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    });

    // Obtener ruta del directorio de documentos
    ipcMain.handle('path:documents', async () => {
        const { app } = await import('electron');
        return app.getPath('documents');
    });
}

/**
 * Tipos de respuesta para operaciones de archivo
 */
export interface SaveResult {
    success: boolean;
    canceled?: boolean;
    filePath?: string;
    fileName?: string;
    error?: string;
}

export interface LoadResult {
    success: boolean;
    canceled?: boolean;
    data?: string;
    filePath?: string;
    fileName?: string;
    error?: string;
}
