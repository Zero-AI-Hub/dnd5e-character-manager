# D&D 5e Character Manager

Aplicación de escritorio para gestionar fichas de personaje de Dungeons & Dragons 5e.

## 🚀 Setup Inicial (Día 1)

### Requisitos
- Node.js 18+ 
- npm 9+

### Instalación
```bash
# 1. Clonar repositorio
git clone <tu-repo>
cd dnd5e-character-manager

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles
```bash
# Desarrollo (Electron + React con hot reload)
npm run dev

# Tests (unit tests con Vitest)
npm test

# Tests en modo watch
npm run test:watch

# Tests con UI
npm run test:ui

# Build de producción
npm run build
```

## 📁 Estructura del Proyecto
```
dnd5e-character-manager/
├── electron/           # Backend (Main process)
│   ├── main.ts         # Entry point de Electron
│   └── preload.ts      # Bridge seguro frontend-backend
├── src/                # Frontend (Renderer process)
│   ├── main.tsx        # Entry point de React
│   └── App.tsx         # Componente principal
├── shared/             # Código compartido
│   ├── domain/         # Lógica de negocio pura
│   │   └── calculators/
│   │       └── modifiers.ts
│   └── types/          # Tipos TypeScript
│       └── character.types.ts
└── tests/              # Tests
    └── unit/
        └── domain/
            └── modifiers.test.ts
```

## ✅ Estado Actual (Día 1)

- [x] Electron + React funcionando
- [x] TypeScript configurado
- [x] Estructura de carpetas creada
- [x] Ejemplo de dominio (`calculateModifier`)
- [x] Test unitario funcionando
- [ ] Persistencia de datos
- [ ] UI completa
- [ ] Datos del SRD

## 🧪 Tests

Actualmente tenemos 10 tests pasando:
```bash
npm test

# Output:
# ✓ calculateModifier (8 tests)
# ✓ calculateAllModifiers (1 test)
```

## 📚 Próximos Pasos

1. Implementar más calculadoras de dominio
2. Crear sistema de persistencia (JSON)
3. Implementar wizard de creación
4. Cargar datos del SRD

## 🤝 Contribuir

Este proyecto sigue arquitectura limpia:
- `shared/domain/`: Lógica pura (sin dependencias)
- `electron/`: Orquestación y acceso a filesystem
- `src/`: Presentación (React)

Ver `docs/architecture.md` para más detalles.
