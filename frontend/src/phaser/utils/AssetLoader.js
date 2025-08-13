// Utilidad para cargar assets de manera consistente en todas las escenas
import { COMMON_ASSETS } from '../GameConfig';

export class AssetLoader {
  constructor(scene) {
    this.scene = scene;
  }

  // Cargar assets básicos (sprites simples)
  loadBasicAssets() {
    // Crear sprites básicos usando canvas cuando no hay imágenes disponibles
    this.createBasicSprites();
    
    // Cargar audio si está disponible
    this.loadAudio();
  }

  // Crear sprites básicos usando gráficos generados
  createBasicSprites() {
    // Crear sprite del jugador
    this.scene.add.graphics()
      .fillStyle(0x00ff00)
      .fillTriangle(16, 0, 0, 32, 32, 32)
      .generateTexture('player', 32, 32);

    // Crear sprite de enemigo
    this.scene.add.graphics()
      .fillStyle(0xff0000)
      .fillRect(0, 0, 24, 24)
      .generateTexture('enemy', 24, 24);

    // Crear sprite de bala
    this.scene.add.graphics()
      .fillStyle(0xffff00)
      .fillCircle(4, 4, 4)
      .generateTexture('bullet', 8, 8);

    // Crear sprite de asteroide
    this.scene.add.graphics()
      .fillStyle(0x8B4513)
      .fillCircle(20, 20, 20)
      .generateTexture('asteroid', 40, 40);

    // Crear partícula para efectos
    this.scene.add.graphics()
      .fillStyle(0xffffff)
      .fillCircle(2, 2, 2)
      .generateTexture('particle', 4, 4);

    // Crear fondo de estrellas
    this.createStarField();
  }

  // Crear campo de estrellas animado
  createStarField() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff);
    
    // Generar estrellas aleatorias
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      const size = Math.random() * 2 + 0.5;
      graphics.fillCircle(x, y, size);
    }
    
    graphics.generateTexture('starfield', 800, 600);
    graphics.destroy();
  }

  // Cargar audio con fallbacks silenciosos
  loadAudio() {
    // En una implementación real, aquí cargaríamos archivos de audio
    // Por ahora creamos objetos de sonido falsos para evitar errores
    this.scene.load.on('complete', () => {
      // Crear objetos de sonido mock si no se cargaron archivos reales
      if (!this.scene.cache.audio.exists('shoot')) {
        this.scene.sound.add('shoot', { volume: 0 }); // Sonido silencioso
      }
      if (!this.scene.cache.audio.exists('explosion')) {
        this.scene.sound.add('explosion', { volume: 0 });
      }
      if (!this.scene.cache.audio.exists('bgMusic')) {
        this.scene.sound.add('bgMusic', { volume: 0, loop: true });
      }
    });
  }

  // Cargar assets avanzados para demos más complejas
  loadAdvancedAssets() {
    this.loadBasicAssets();
    
    // Crear texturas más complejas para demos avanzadas
    this.createAdvancedTextures();
  }

  createAdvancedTextures() {
    // Crear textura para partículas más complejas
    const particleGraphics = this.scene.add.graphics();
    const gradient = particleGraphics.createLinearGradient(0, 0, 8, 8);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#ffff00');
    gradient.addColorStop(1, '#ff0000');
    
    particleGraphics.fillGradientStyle(gradient);
    particleGraphics.fillCircle(4, 4, 4);
    particleGraphics.generateTexture('advancedParticle', 8, 8);
    particleGraphics.destroy();

    // Crear sprite del jugador con más detalles
    this.scene.add.graphics()
      .fillStyle(0x00ff00)
      .fillTriangle(16, 0, 0, 32, 32, 32)
      .fillStyle(0x0000ff)
      .fillRect(12, 28, 8, 4)
      .generateTexture('detailedPlayer', 32, 32);
  }

  // Función de utilidad para cargar spritesheets
  loadSpritesheet(key, url, frameConfig) {
    if (this.scene.textures.exists(key)) return;
    
    try {
      this.scene.load.spritesheet(key, url, frameConfig);
    } catch (error) {
      console.warn(`Could not load spritesheet ${key}, creating fallback`);
      this.createFallbackSpritesheet(key, frameConfig);
    }
  }

  createFallbackSpritesheet(key, frameConfig) {
    // Crear un spritesheet básico si no se puede cargar el archivo
    const { frameWidth, frameHeight } = frameConfig;
    const frames = 4; // Número de frames por defecto
    
    const graphics = this.scene.add.graphics();
    
    for (let i = 0; i < frames; i++) {
      const color = 0x00ff00 + (i * 0x001100); // Variación de color por frame
      graphics.clear();
      graphics.fillStyle(color);
      graphics.fillTriangle(frameWidth/2, 0, 0, frameHeight, frameWidth, frameHeight);
      graphics.generateTexture(`${key}_frame_${i}`, frameWidth, frameHeight);
    }
    
    graphics.destroy();
  }
}

export default AssetLoader;