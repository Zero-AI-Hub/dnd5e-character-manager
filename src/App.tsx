import { useState, useEffect } from 'react';
import { CharacterSheet } from './components/CharacterSheet';
import type { Character } from '@shared/types/character';
import {
  createCharacterFile,
  serializeCharacter,
  deserializeCharacter,
  updateMetadata
} from '@shared/domain/persistence/characterSchema';

/**
 * Estado de la aplicación
 */
interface AppState {
  character: Character | null;
  filePath: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
}

/**
 * Componente principal de la aplicación
 */
function App() {
  const [state, setState] = useState<AppState>({
    character: null,
    filePath: null,
    hasUnsavedChanges: false,
    isLoading: true,
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
    }));
  };

  // Guardar personaje
  const handleSave = async () => {
    if (!state.character) return;

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
        }));
      }
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  // Cargar personaje
  const handleLoad = async () => {
    try {
      const result = await window.api.character.load();

      if (result.success && result.data) {
        const charFile = deserializeCharacter(result.data);
        setState({
          character: charFile.character,
          filePath: result.filePath || null,
          hasUnsavedChanges: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error loading character:', error);
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
    });
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
            disabled={!state.hasUnsavedChanges && state.filePath !== null}
          >
            💾 Guardar {state.hasUnsavedChanges && '●'}
          </button>
        </div>

        {/* Status */}
        <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
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
