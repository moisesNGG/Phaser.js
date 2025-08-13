# Contratos de Implementación - Phaser.js Demo

## API Contracts

### Backend Endpoints
- `GET /api/demos` - Obtener lista de demos disponibles
- `GET /api/demos/:id` - Obtener detalles específicos de una demo
- `POST /api/scores` - Guardar puntuaciones del juego
- `GET /api/scores/leaderboard` - Obtener tabla de puntuaciones
- `GET /api/assets/manifest` - Obtener manifiesto de assets del juego

### Frontend to Backend Integration
- Reemplazar `mockData` con llamadas reales a la API
- Integrar sistema de puntuaciones con base de datos
- Cargar assets dinámicamente desde el backend

## Datos Mock a Reemplazar

### En mock.js:
- `basicDemos[]` - Reemplazar con datos de `/api/demos?level=basic`
- `intermediateDemos[]` - Reemplazar con datos de `/api/demos?level=intermediate`  
- `advancedDemos[]` - Reemplazar con datos de `/api/demos?level=advanced`
- `features[]` - Mantener estático (no requiere backend)

## Implementación Backend

### Modelos MongoDB:
```python
class Demo(BaseModel):
    id: str
    title: str
    description: str
    level: str  # "basic", "intermediate", "advanced"
    code_example: str
    technologies: List[str]
    difficulty: str

class Score(BaseModel):
    id: str
    player_name: str
    score: int
    level: int
    timestamp: datetime
```

### Endpoints a implementar:
1. CRUD para demos
2. Sistema de puntuaciones
3. Servir assets estáticos de Phaser.js

## Integración Phaser.js

### Instalación:
- `yarn add phaser` en frontend
- Crear directorio `/public/assets/` para sprites, sonidos, etc.

### Implementación Real:
1. **Demos Básicas** - Sprites reales, movimiento funcional, input real
2. **Demos Intermedias** - Animaciones, colisiones, audio funcional  
3. **Demos Avanzadas** - Partículas, físicas Matter.js, iluminación
4. **Juego Final** - Space Shooter completamente jugable

### Assets Necesarios:
- Sprites de nave, enemigos, asteroides
- Sonidos de disparos, explosiones, música de fondo
- Efectos de partículas para explosiones

### Estructura de Archivos:
```
/app/frontend/src/
├── phaser/
│   ├── scenes/
│   │   ├── BasicDemos.js
│   │   ├── IntermediateDemos.js  
│   │   ├── AdvancedDemos.js
│   │   └── SpaceShooterGame.js
│   ├── objects/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   └── Bullet.js
│   └── utils/
│       ├── AssetLoader.js
│       └── GameConfig.js
```

## Integración Frontend-Backend

### Reemplazos en componentes:
1. `HomePage.js` - Cargar demos desde API
2. `GameCanvas.js` - Integrar Phaser.js real, guardar puntuaciones
3. `DemoSection.js` - Ejecutar demos reales de Phaser.js

### Flujo de datos:
1. Frontend carga demos desde API
2. Phaser.js se inicializa con configuración real
3. Demos ejecutan código Phaser.js funcional
4. Puntuaciones se envían al backend
5. Assets se cargan dinámicamente

## Testing Strategy

### Frontend Testing:
- Verificar que todas las demos de Phaser.js funcionen
- Probar controles del juego (teclado, mouse)
- Validar sistema de puntuaciones
- Confirmar carga de assets

### Backend Testing:
- Endpoints de demos respondan correctamente
- Sistema de puntuaciones funcione
- Assets se sirvan correctamente

## Assets y Recursos

### Crear/Obtener:
- Sprites para nave espacial (32x32px)
- Sprites para enemigos (16x16px, 24x24px)
- Sprites para asteroides (varios tamaños)
- Efectos de sonido (shoot.wav, explosion.wav)
- Música de fondo (background.mp3)
- Efectos de partículas (spark.png, fire.png)