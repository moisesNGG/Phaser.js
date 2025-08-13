import { Gamepad2, Zap, Sparkles, Rocket, Play, Pause, RotateCcw, Volume2 } from "lucide-react";

export const mockData = {
  phaserVersion: "3.80.1",
  
  basicDemos: [
    {
      id: "sprite-basic",
      title: "Sprites Básicos",
      description: "Cargar y mostrar sprites estáticos en pantalla",
      difficulty: "Fácil",
      preview: "Sprite estático",
      technologies: ["Sprites", "Preload", "Create"],
      code: `
// Cargar sprite
this.load.image('player', 'assets/player.png');

// Mostrar sprite
this.add.image(400, 300, 'player');
      `
    },
    {
      id: "movement-basic",
      title: "Movimiento Simple",
      description: "Control básico de movimiento con teclas",
      difficulty: "Fácil",
      preview: "Movimiento con flechas",
      technologies: ["Input", "Update", "Physics"],
      code: `
// En create()
this.cursors = this.input.keyboard.createCursorKeys();

// En update()
if (this.cursors.left.isDown) {
    this.player.x -= 200 * this.game.loop.delta / 1000;
}
      `
    },
    {
      id: "input-handling",
      title: "Manejo de Entrada",
      description: "Capturar clicks del mouse y teclas del teclado",
      difficulty: "Fácil",
      preview: "Click & teclado",
      technologies: ["Mouse", "Keyboard", "Events"],
      code: `
// Mouse
this.input.on('pointerdown', (pointer) => {
    console.log('Click en:', pointer.x, pointer.y);
});

// Teclado
this.spaceKey = this.input.keyboard.addKey('SPACE');
      `
    }
  ],

  intermediateDemos: [
    {
      id: "animations",
      title: "Animaciones",
      description: "Crear y reproducir animaciones de sprites",
      difficulty: "Medio",
      preview: "Sprite animado",
      technologies: ["Animation", "Spritesheet", "Timeline"],
      code: `
// Crear animación
this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

// Reproducir animación
this.player.anims.play('walk');
      `
    },
    {
      id: "collisions",
      title: "Detección de Colisiones",
      description: "Implementar colisiones entre objetos",
      difficulty: "Medio",
      preview: "Objetos colisionando",
      technologies: ["Physics", "Overlap", "Collide"],
      code: `
// Configurar físicas
this.physics.add.sprite(x, y, 'sprite');

// Detectar colisión
this.physics.add.overlap(player, enemies, (player, enemy) => {
    enemy.destroy();
    this.score += 10;
});
      `
    },
    {
      id: "audio-system",
      title: "Sistema de Audio",
      description: "Reproducir efectos de sonido y música",
      difficulty: "Medio",
      preview: "Sonidos y música",
      technologies: ["Audio", "Sound", "Music"],
      code: `
// Cargar audio
this.load.audio('shoot', 'sounds/shoot.wav');
this.load.audio('music', 'music/background.mp3');

// Reproducir
this.sound.add('shoot').play();
this.bgMusic = this.sound.add('music', { loop: true });
      `
    }
  ],

  advancedDemos: [
    {
      id: "particle-system",
      title: "Sistema de Partículas",
      description: "Crear efectos visuales con partículas",
      difficulty: "Avanzado",
      preview: "Explosiones y efectos",
      technologies: ["Particles", "Emitters", "Effects"],
      code: `
// Crear emisor de partículas
this.explosion = this.add.particles(x, y, 'spark', {
    speed: { min: 100, max: 200 },
    lifespan: 600,
    quantity: 15
});

// Emitir en posición específica
this.explosion.explode(20, x, y);
      `
    },
    {
      id: "advanced-physics",
      title: "Físicas Avanzadas",
      description: "Gravedad, fuerzas y cuerpos físicos complejos",
      difficulty: "Avanzado",
      preview: "Física realista",
      technologies: ["Matter.js", "Gravity", "Forces"],
      code: `
// Configurar Matter.js
this.matter.world.setBounds(0, 0, 800, 600);

// Crear cuerpos físicos
const body = this.matter.add.rectangle(x, y, w, h);
this.matter.world.add([body]);
      `
    },
    {
      id: "lighting-effects",
      title: "Efectos de Iluminación",
      description: "Luces dinámicas y sombras en tiempo real",
      difficulty: "Avanzado",
      preview: "Luces y sombras",
      technologies: ["Lighting", "Shaders", "Pipeline"],
      code: `
// Habilitar pipeline de luces
this.lights.enable();
this.lights.setAmbientColor(0x404040);

// Crear luz
const light = this.lights.addLight(x, y, 200)
    .setColor(0xffffff)
    .setIntensity(1);
      `
    }
  ],

  features: [
    {
      icon: Gamepad2,
      title: "Renderizado Avanzado",
      description: "Sistema de renderizado WebGL optimizado con soporte para Canvas 2D como respaldo",
      color: "from-blue-500 to-cyan-500",
      examples: ["WebGL", "Canvas 2D", "Sprites", "Texturas", "Batching"],
      difficultyLevel: 2,
      difficultyColor: "from-green-500 to-yellow-500"
    },
    {
      icon: Zap,
      title: "Sistema de Físicas",
      description: "Integración completa con Arcade Physics y Matter.js para simulaciones realistas",
      color: "from-purple-500 to-pink-500",
      examples: ["Arcade Physics", "Matter.js", "Colisiones", "Gravedad", "Fuerzas"],
      difficultyLevel: 4,
      difficultyColor: "from-yellow-500 to-red-500"
    },
    {
      icon: Sparkles,
      title: "Efectos Visuales",
      description: "Partículas, iluminación, post-procesamiento y shaders personalizados",
      color: "from-pink-500 to-red-500",
      examples: ["Partículas", "Shaders", "Filtros", "Iluminación", "Post-FX"],
      difficultyLevel: 5,
      difficultyColor: "from-red-500 to-red-600"
    },
    {
      icon: Volume2,
      title: "Audio Inmersivo",
      description: "Sistema de audio 3D con soporte para múltiples formatos y efectos",
      color: "from-green-500 to-teal-500",
      examples: ["Web Audio API", "3D Audio", "Efectos", "Streaming", "Compresión"],
      difficultyLevel: 3,
      difficultyColor: "from-yellow-500 to-orange-500"
    },
    {
      icon: Play,
      title: "Animaciones Fluidas",
      description: "Timeline avanzado, tweening y sistema de animación por sprites",
      color: "from-orange-500 to-yellow-500",
      examples: ["Tweens", "Timeline", "Spritesheets", "Interpolación", "Easing"],
      difficultyLevel: 3,
      difficultyColor: "from-yellow-500 to-orange-500"
    },
    {
      icon: Rocket,
      title: "Optimización",
      description: "Object pooling, culling, y técnicas avanzadas de optimización",
      color: "from-indigo-500 to-purple-500",
      examples: ["Object Pooling", "Culling", "Batching", "Memory Management", "Performance"],
      difficultyLevel: 4,
      difficultyColor: "from-yellow-500 to-red-500"
    }
  ]
};