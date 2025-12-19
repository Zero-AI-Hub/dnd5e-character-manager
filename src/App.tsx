import { useState } from 'react';
import { calculateModifier } from '@shared/domain/calculators/modifiers';

/**
 * Componente principal de la aplicación
 * 
 * Este es un ejemplo mínimo que demuestra:
 * - React funcionando
 * - TypeScript funcionando
 * - Importación desde shared/ funcionando
 * - Uso de lógica de dominio
 */
function App() {
  const [abilityScore, setAbilityScore] = useState(10);
  
  // Calcular modificador usando lógica de dominio
  let modifier: number | string;
  try {
    modifier = calculateModifier(abilityScore);
  } catch (error) {
    modifier = 'Error';
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>D&D 5e Character Manager</h1>
      
      <div style={styles.card}>
        <h2 style={styles.subtitle}>Calculadora de Modificadores</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Puntuación de Atributo (1-30):
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={abilityScore}
            onChange={(e) => setAbilityScore(Number(e.target.value))}
            style={styles.input}
          />
        </div>
        
        <div style={styles.result}>
          <span style={styles.resultLabel}>Modificador:</span>
          <span style={styles.resultValue}>
            {typeof modifier === 'number' 
              ? (modifier >= 0 ? `+${modifier}` : modifier)
              : modifier
            }
          </span>
        </div>
        
        <div style={styles.info}>
          <p><strong>Ejemplos:</strong></p>
          <ul>
            <li>Score 10 → Modificador +0</li>
            <li>Score 16 → Modificador +3</li>
            <li>Score 8 → Modificador -1</li>
          </ul>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>✨ Electron + React + TypeScript funcionando</p>
        <p style={styles.version}>v0.1.0 - MVP Day 1</p>
      </footer>
    </div>
  );
}

/**
 * Estilos inline básicos (en el futuro usar Tailwind)
 */
const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '40px',
    color: '#1a202c',
  },
  card: {
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#2d3748',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#4a5568',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #cbd5e0',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
  },
  result: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    padding: '20px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  resultLabel: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#2d3748',
  },
  resultValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  info: {
    fontSize: '14px',
    color: '#4a5568',
    lineHeight: '1.6',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center' as const,
    color: '#718096',
    fontSize: '14px',
  },
  version: {
    fontSize: '12px',
    color: '#a0aec0',
  },
};

export default App;
