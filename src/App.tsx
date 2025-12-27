import { useState, useEffect } from 'react';
import { CharacterSheet } from './components/CharacterSheet';
import type { Character } from '@shared/types/character';
import {
  createCharacterFile,
  serializeCharacter,
  deserializeCharacter,
  updateMetadata,
  CharacterFile
} from '@shared/domain/persistence/characterSchema';

/**
 * Estado de la aplicación
 */
interface AppState {
  character: Character | null;
  filePath: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Verifica si estamos en contexto Electron
 */
const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.api !== undefined;
};

/**
 * Componente principal de la aplicación
 */
function App() {
  const [state, setState] = useState<AppState>({
    character: null,
    filePath: null,
    hasUnsavedChanges: false,
    isLoading: true,
    error: null,
  });

  // Inicializar personaje por defecto
  useEffect(() => {
    const charFile = createCharacterFile();
    setState(prev => ({
      ...prev,
      character: charFile.character,
      isLoading: false,
    }));
  }, []);

  // Manejar cambios en el personaje
  const handleCharacterChange = (character: Character) => {
    setState(prev => ({
      ...prev,
      character,
      hasUnsavedChanges: true,
      error: null,
    }));
  };

  // Guardar personaje
  const handleSave = async () => {
    if (!state.character) return;

    // Verificar si estamos en Electron
    if (!isElectron()) {
      // Fallback: descargar como archivo en el navegador
      try {
        const charFile = createCharacterFile(state.character);
        charFile.metadata = updateMetadata(charFile.metadata);
        const json = serializeCharacter(charFile);

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${state.character.basics.name || 'personaje'}.dnd5e`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setState(prev => ({
          ...prev,
          hasUnsavedChanges: false,
          error: null,
        }));
      } catch (error) {
        console.error('Error saving character:', error);
        setState(prev => ({
          ...prev,
          error: 'Error al guardar el personaje',
        }));
      }
      return;
    }

    // En Electron: usar IPC
    try {
      const charFile = createCharacterFile(state.character);
      charFile.metadata = updateMetadata(charFile.metadata);
      const json = serializeCharacter(charFile);

      const result = await window.api.character.save(json, state.filePath || undefined);

      if (result.success && result.filePath) {
        setState(prev => ({
          ...prev,
          filePath: result.filePath!,
          hasUnsavedChanges: false,
          error: null,
        }));
      } else if (result.error) {
        setState(prev => ({
          ...prev,
          error: result.error || 'Error desconocido',
        }));
      }
    } catch (error) {
      console.error('Error saving character:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al guardar el personaje',
      }));
    }
  };

  // Cargar personaje
  const handleLoad = async () => {
    // Verificar si estamos en Electron
    if (!isElectron()) {
      // Fallback: usar input file en el navegador
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.dnd5e,.json';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const charFile = deserializeCharacter(text);
          setState({
            character: charFile.character,
            filePath: file.name,
            hasUnsavedChanges: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error loading character:', error);
          setState(prev => ({
            ...prev,
            error: 'Error al cargar el personaje. Archivo inválido.',
          }));
        }
      };
      input.click();
      return;
    }

    // En Electron: usar IPC
    try {
      const result = await window.api.character.load();

      if (result.success && result.data) {
        const charFile = deserializeCharacter(result.data);
        setState({
          character: charFile.character,
          filePath: result.filePath || null,
          hasUnsavedChanges: false,
          isLoading: false,
          error: null,
        });
      } else if (result.error) {
        setState(prev => ({
          ...prev,
          error: result.error || 'Error desconocido',
        }));
      }
    } catch (error) {
      console.error('Error loading character:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al cargar el personaje',
      }));
    }
  };

  // Nuevo personaje
  const handleNew = () => {
    const charFile = createCharacterFile();
    setState({
      character: charFile.character,
      filePath: null,
      hasUnsavedChanges: false,
      isLoading: false,
      error: null,
    });
  };

  // Cerrar error
  const dismissError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  if (state.isLoading) {
    return (
      <div className="app">
        <div className="app__header">
          <h1 className="app__title">Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <h1 className="app__title">D&D 5e Character Manager</h1>
        <p className="app__subtitle">
          Gestor de fichas de personaje para Dungeons & Dragons 5ª Edición
        </p>

        {/* Toolbar */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button className="btn btn--secondary" onClick={handleNew}>
            📄 Nuevo
          </button>
          <button className="btn btn--secondary" onClick={handleLoad}>
            📂 Abrir
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
          >
            💾 Guardar {state.hasUnsavedChanges && '●'}
          </button>
        </div>

        {/* Error message */}
        {state.error && (
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: 'var(--color-accent-red)',
            borderRadius: '4px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{state.error}</span>
            <button
              onClick={dismissError}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Status */}
        <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {!isElectron() && '🌐 Modo navegador | '}
          {state.filePath
            ? `📁 ${state.filePath.split(/[\\/]/).pop()}`
            : '📝 Nuevo personaje sin guardar'}
          {state.hasUnsavedChanges && ' (cambios sin guardar)'}
        </p>
      </header>

      {/* Character Sheet */}
      {state.character && (
        <CharacterSheet
          character={state.character}
          onCharacterChange={handleCharacterChange}
        />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '48px',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.8rem',
        paddingTop: '24px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <p>✨ Electron + React + TypeScript</p>
        <p>v0.2.0 - MVP</p>
      </footer>
    </div>
  );
}

export default App;
