from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from models import Demo, DemoCreate, Score, ScoreCreate, LeaderboardEntry, GameStats
from datetime import datetime

# Database will be injected from server.py
db = None

def get_database():
    """Get database instance - will be set by server.py"""
    return db

def set_database(database):
    """Set database instance from server.py"""
    global db
    db = database

router = APIRouter()

# Datos de demos iniciales
INITIAL_DEMOS = [
    {
        "title": "Sprites Básicos",
        "description": "Cargar y mostrar sprites estáticos en pantalla",
        "level": "basic",
        "difficulty": "Fácil",
        "preview": "Sprite estático",
        "scene_name": "BasicSpritesScene",
        "technologies": ["Sprites", "Preload", "Create"],
        "code_example": """// Cargar sprite
this.load.image('player', 'assets/sprites/player.png');

// Mostrar sprite en create()
this.add.image(400, 300, 'player');"""
    },
    {
        "title": "Movimiento Simple",
        "description": "Control básico de movimiento con teclas de dirección",
        "level": "basic",
        "difficulty": "Fácil",
        "preview": "Movimiento con flechas",
        "scene_name": "BasicMovementScene",
        "technologies": ["Input", "Update", "Physics"],
        "code_example": """// En create()
this.cursors = this.input.keyboard.createCursorKeys();

// En update()
if (this.cursors.left.isDown) {
    this.player.x -= 200 * this.game.loop.delta / 1000;
}
if (this.cursors.right.isDown) {
    this.player.x += 200 * this.game.loop.delta / 1000;
}"""
    },
    {
        "title": "Manejo de Entrada",
        "description": "Capturar clicks del mouse y teclas del teclado",
        "level": "basic",
        "difficulty": "Fácil",
        "preview": "Click & teclado",
        "scene_name": "InputHandlingScene",
        "technologies": ["Mouse", "Keyboard", "Events"],
        "code_example": """// Mouse input
this.input.on('pointerdown', (pointer) => {
    console.log('Click en:', pointer.x, pointer.y);
    this.add.circle(pointer.x, pointer.y, 10, 0x00ff00);
});

// Keyboard input
this.spaceKey = this.input.keyboard.addKey('SPACE');
if (this.spaceKey.isDown) {
    // Acción al presionar espacio
}"""
    },
    {
        "title": "Animaciones",
        "description": "Crear y reproducir animaciones de sprites",
        "level": "intermediate",
        "difficulty": "Medio",
        "preview": "Sprite animado",
        "scene_name": "AnimationScene",
        "technologies": ["Animation", "Spritesheet", "Timeline"],
        "code_example": """// Crear animación en preload()
this.load.spritesheet('player', 'assets/sprites/player-sheet.png', {
    frameWidth: 32, frameHeight: 32
});

// En create()
this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

// Reproducir animación
this.player.anims.play('walk');"""
    },
    {
        "title": "Detección de Colisiones",
        "description": "Implementar colisiones entre objetos del juego",
        "level": "intermediate",
        "difficulty": "Medio",
        "preview": "Objetos colisionando",
        "scene_name": "CollisionScene",
        "technologies": ["Physics", "Overlap", "Collide"],
        "code_example": """// Habilitar físicas
this.physics.world.setBoundsCollision(true, true, true, false);

// Crear objetos con físicas
this.player = this.physics.add.sprite(400, 500, 'player');
this.enemies = this.physics.add.group();

// Detectar colisión
this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
    enemy.destroy();
    this.score += 10;
});"""
    },
    {
        "title": "Sistema de Audio",
        "description": "Reproducir efectos de sonido y música de fondo",
        "level": "intermediate",
        "difficulty": "Medio",
        "preview": "Sonidos y música",
        "scene_name": "AudioScene",
        "technologies": ["Audio", "Sound", "Music"],
        "code_example": """// Cargar audio en preload()
this.load.audio('shoot', 'assets/sounds/shoot.wav');
this.load.audio('music', 'assets/music/background.mp3');

// En create()
this.shootSound = this.sound.add('shoot');
this.bgMusic = this.sound.add('music', { 
    volume: 0.5, 
    loop: true 
});

// Reproducir
this.shootSound.play();
this.bgMusic.play();"""
    },
    {
        "title": "Sistema de Partículas",
        "description": "Crear efectos visuales con sistemas de partículas",
        "level": "advanced",
        "difficulty": "Avanzado",
        "preview": "Explosiones y efectos",
        "scene_name": "ParticleScene",
        "technologies": ["Particles", "Emitters", "Effects"],
        "code_example": """// Crear emisor de partículas
this.explosion = this.add.particles(0, 0, 'spark', {
    speed: { min: 100, max: 200 },
    scale: { start: 0.5, end: 0 },
    blendMode: 'ADD',
    lifespan: 600
});

// Crear explosión en posición específica
this.explosion.explode(20, x, y);"""
    },
    {
        "title": "Físicas Avanzadas",
        "description": "Implementar gravedad, fuerzas y cuerpos físicos complejos",
        "level": "advanced",
        "difficulty": "Avanzado",
        "preview": "Física realista",
        "scene_name": "AdvancedPhysicsScene",
        "technologies": ["Matter.js", "Gravity", "Forces"],
        "code_example": """// Configurar Matter.js
this.matter.world.setBounds(0, 0, 800, 600);
this.matter.world.disableGravity();

// Crear cuerpos físicos personalizados
const body = this.matter.add.rectangle(x, y, w, h, {
    isStatic: false,
    restitution: 0.8
});

// Aplicar fuerzas
this.matter.applyForce(body, { x: 0, y: -0.01 });"""
    },
    {
        "title": "Efectos de Iluminación",
        "description": "Implementar luces dinámicas y sombras en tiempo real",
        "level": "advanced",
        "difficulty": "Avanzado",
        "preview": "Luces y sombras",
        "scene_name": "LightingScene",
        "technologies": ["Lighting", "Shaders", "Pipeline"],
        "code_example": """// Habilitar pipeline de luces
this.lights.enable();
this.lights.setAmbientColor(0x404040);

// Crear luz dinámica
const light = this.lights.addLight(x, y, 200)
    .setColor(0xffffff)
    .setIntensity(1);

// Sprites con iluminación
this.player.setPipeline('Light2D');"""
    }
]

@router.get("/demos", response_model=List[Demo])
async def get_demos(level: Optional[str] = Query(None, description="Filtrar por nivel: basic, intermediate, advanced")):
    """Obtener todas las demos o filtrar por nivel"""
    try:
        # Verificar si ya existen demos en la base de datos
        count = await db.demos.count_documents({})
        
        # Si no hay demos, insertar las demos iniciales
        if count == 0:
            initial_demos = []
            for demo_data in INITIAL_DEMOS:
                demo = Demo(**demo_data)
                initial_demos.append(demo.dict())
            
            if initial_demos:
                await db.demos.insert_many(initial_demos)
        
        # Construir filtro
        filter_dict = {}
        if level:
            filter_dict["level"] = level
        
        demos = await db.demos.find(filter_dict).to_list(1000)
        return [Demo(**demo) for demo in demos]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener demos: {str(e)}")

@router.get("/demos/{demo_id}", response_model=Demo)
async def get_demo(demo_id: str):
    """Obtener una demo específica por ID"""
    try:
        demo = await db.demos.find_one({"id": demo_id})
        if not demo:
            raise HTTPException(status_code=404, detail="Demo no encontrada")
        return Demo(**demo)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener demo: {str(e)}")

@router.post("/scores", response_model=Score)
async def save_score(score_data: ScoreCreate):
    """Guardar puntuación del juego"""
    try:
        score = Score(**score_data.dict())
        await db.scores.insert_one(score.dict())
        return score
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar puntuación: {str(e)}")

@router.get("/scores/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = Query(10, description="Número de entradas a retornar")):
    """Obtener tabla de puntuaciones"""
    try:
        # Obtener top scores ordenados por puntuación descendente
        scores = await db.scores.find().sort("score", -1).limit(limit).to_list(limit)
        
        leaderboard = []
        for idx, score_doc in enumerate(scores, 1):
            entry = LeaderboardEntry(
                rank=idx,
                player_name=score_doc["player_name"],
                score=score_doc["score"],
                level=score_doc["level"],
                timestamp=score_doc["timestamp"]
            )
            leaderboard.append(entry)
        
        return leaderboard
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener leaderboard: {str(e)}")

@router.get("/stats", response_model=GameStats)
async def get_game_stats():
    """Obtener estadísticas generales del juego"""
    try:
        # Contar total de juegos
        total_games = await db.scores.count_documents({})
        
        if total_games == 0:
            return GameStats(
                total_games=0,
                average_score=0.0,
                highest_score=0,
                most_played_level=1
            )
        
        # Calcular estadísticas usando agregación
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "avg_score": {"$avg": "$score"},
                    "max_score": {"$max": "$score"},
                    "levels": {"$push": "$level"}
                }
            }
        ]
        
        result = await db.scores.aggregate(pipeline).to_list(1)
        stats_data = result[0] if result else {}
        
        # Encontrar el nivel más jugado
        level_counts = {}
        for level in stats_data.get("levels", []):
            level_counts[level] = level_counts.get(level, 0) + 1
        
        most_played_level = max(level_counts.keys(), key=level_counts.get) if level_counts else 1
        
        return GameStats(
            total_games=total_games,
            average_score=round(stats_data.get("avg_score", 0), 2),
            highest_score=stats_data.get("max_score", 0),
            most_played_level=most_played_level
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")

@router.delete("/demos/{demo_id}")
async def delete_demo(demo_id: str):
    """Eliminar una demo (para propósitos de administración)"""
    try:
        result = await db.demos.delete_one({"id": demo_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Demo no encontrada")
        return {"message": "Demo eliminada exitosamente"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar demo: {str(e)}")

@router.post("/demos", response_model=Demo)
async def create_demo(demo_data: DemoCreate):
    """Crear nueva demo (para propósitos de administración)"""
    try:
        demo = Demo(**demo_data.dict())
        await db.demos.insert_one(demo.dict())
        return demo
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear demo: {str(e)}")