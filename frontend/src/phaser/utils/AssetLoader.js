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
    // Check if textures already exist to avoid conflicts
    if (this.scene.textures.exists('player')) return;

    try {
      // Crear sprite del jugador (nave triangular mejorada)
      const playerGraphics = this.scene.add.graphics();
      playerGraphics.fillStyle(0x00ff00);
      playerGraphics.fillTriangle(16, 0, 0, 28, 32, 28);
      playerGraphics.fillStyle(0x0080ff);
      playerGraphics.fillRect(12, 24, 8, 8);
      playerGraphics.fillStyle(0xffffff);
      playerGraphics.fillCircle(16, 16, 3);
      playerGraphics.generateTexture('player', 32, 32);
      playerGraphics.destroy();

      // Crear sprite de enemigo (nave roja)
      const enemyGraphics = this.scene.add.graphics();
      enemyGraphics.fillStyle(0xff0000);
      enemyGraphics.fillRect(0, 0, 24, 24);
      enemyGraphics.fillStyle(0xff6666);
      enemyGraphics.fillRect(4, 4, 16, 16);
      enemyGraphics.fillStyle(0x660000);
      enemyGraphics.fillCircle(12, 12, 4);
      enemyGraphics.generateTexture('enemy', 24, 24);
      enemyGraphics.destroy();

      // Crear sprite de bala (proyectil brillante)
      const bulletGraphics = this.scene.add.graphics();
      bulletGraphics.fillStyle(0xffff00);
      bulletGraphics.fillCircle(4, 4, 4);
      bulletGraphics.fillStyle(0xffffff);
      bulletGraphics.fillCircle(4, 4, 2);
      bulletGraphics.generateTexture('bullet', 8, 8);
      bulletGraphics.destroy();

      // Crear sprite de asteroide (roca detallada)
      const asteroidGraphics = this.scene.add.graphics();
      asteroidGraphics.fillStyle(0x8B4513);
      asteroidGraphics.fillCircle(20, 20, 18);
      asteroidGraphics.fillStyle(0x654321);
      asteroidGraphics.fillCircle(15, 15, 6);
      asteroidGraphics.fillCircle(25, 25, 8);
      asteroidGraphics.fillStyle(0x5D4037);
      asteroidGraphics.fillCircle(22, 12, 4);
      asteroidGraphics.generateTexture('asteroid', 40, 40);
      asteroidGraphics.destroy();

      // Crear partícula mejorada (con brillo)
      const particleGraphics = this.scene.add.graphics();
      particleGraphics.fillStyle(0xffffff);
      particleGraphics.fillCircle(2, 2, 2);
      particleGraphics.fillStyle(0xffff00);
      particleGraphics.fillCircle(2, 2, 1);
      particleGraphics.generateTexture('particle', 4, 4);
      particleGraphics.destroy();

      // Crear fondo de estrellas mejorado
      this.createStarField();
    } catch (error) {
      console.error('Error creating basic sprites:', error);
      // Create minimal fallback textures
      this.createFallbackTextures();
    }
  }

  // Crear campo de estrellas animado mejorado
  createStarField() {
    if (this.scene.textures.exists('starfield')) return;

    try {
      const graphics = this.scene.add.graphics();
      
      // Fondo degradado
      graphics.fillGradientStyle(0x000428, 0x004e92, 0x000428, 0x004e92, 0.8);
      graphics.fillRect(0, 0, 800, 600);
      
      graphics.fillStyle(0xffffff);
      
      // Generar estrellas de diferentes tamaños
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const size = Math.random() * 1.5 + 0.5;
        graphics.fillCircle(x, y, size);
      }
      
      // Estrellas más brillantes
      graphics.fillStyle(0xffffaa);
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 600;
        const size = Math.random() * 2 + 1;
        graphics.fillCircle(x, y, size);
      }
      
      graphics.generateTexture('starfield', 800, 600);
      graphics.destroy();
    } catch (error) {
      console.error('Error creating starfield:', error);
      // Create simple fallback
      this.createSimpleBackground();
    }
  }

  // Simple fallback background
  createSimpleBackground() {
    if (this.scene.textures.exists('starfield')) return;
    
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x000428);
    graphics.fillRect(0, 0, 800, 600);
    graphics.generateTexture('starfield', 800, 600);
    graphics.destroy();
  }

  // Fallback textures for critical failures
  createFallbackTextures() {
    const textures = ['player', 'enemy', 'bullet', 'asteroid', 'particle'];
    
    textures.forEach(textureName => {
      if (!this.scene.textures.exists(textureName)) {
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 16, 16);
        graphics.generateTexture(textureName, 16, 16);
        graphics.destroy();
      }
    });
  }

  // Cargar audio con fallbacks silenciosos
  loadAudio() {
    try {
      // Create silent audio objects immediately to avoid cache errors
      const audioContext = this.scene.sound.context;
      
      // Create minimal audio buffers for each sound
      const createSilentAudio = (key, duration = 0.1) => {
        if (!this.scene.sound.get(key)) {
          // Create a simple silent audio buffer
          const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * duration), audioContext.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = 0; // Silent
          }
          
          // Add to Phaser's audio cache with minimal config
          this.scene.sound.add(key, { 
            volume: 0,
            loop: key === 'bgMusic' 
          });
        }
      };

      // Pre-create all required audio keys
      const audioKeys = ['shoot', 'explosion', 'bgMusic', 'powerup'];
      audioKeys.forEach(key => {
        try {
          createSilentAudio(key);
        } catch (error) {
          console.warn(`Could not create audio for ${key}:`, error);
        }
      });

    } catch (error) {
      console.warn('Audio system not available, using silent fallback:', error);
      // Fallback: create dummy audio manager
      this.createDummyAudio();
    }
  }

  // Create dummy audio objects for environments without audio support
  createDummyAudio() {
    const dummySound = {
      play: () => {},
      stop: () => {},
      pause: () => {},
      resume: () => {},
      setVolume: () => {},
      setLoop: () => {}
    };

    const audioKeys = ['shoot', 'explosion', 'bgMusic', 'powerup'];
    audioKeys.forEach(key => {
      if (!this.scene.sound.get(key)) {
        this.scene.sound.add(key, dummySound);
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
    // Check if advanced textures already exist
    if (this.scene.textures.exists('advancedParticle')) return;

    try {
      // Crear textura para partículas más complejas con gradiente
      const particleGraphics = this.scene.add.graphics();
      
      // Simulación de gradiente radial
      particleGraphics.fillStyle(0xffffff, 1);
      particleGraphics.fillCircle(4, 4, 4);
      particleGraphics.fillStyle(0xffff00, 0.8);
      particleGraphics.fillCircle(4, 4, 3);
      particleGraphics.fillStyle(0xff0000, 0.6);
      particleGraphics.fillCircle(4, 4, 2);
      
      particleGraphics.generateTexture('advancedParticle', 8, 8);
      particleGraphics.destroy();

      // Crear sprite del jugador con más detalles para demos avanzadas
      if (!this.scene.textures.exists('detailedPlayer')) {
        const detailedPlayerGraphics = this.scene.add.graphics();
        
        // Cuerpo de la nave
        detailedPlayerGraphics.fillStyle(0x00ff00);
        detailedPlayerGraphics.fillTriangle(16, 0, 4, 24, 28, 24);
        
        // Cabina
        detailedPlayerGraphics.fillStyle(0x0066ff);
        detailedPlayerGraphics.fillRect(12, 18, 8, 6);
        
        // Motores
        detailedPlayerGraphics.fillStyle(0xff6600);
        detailedPlayerGraphics.fillRect(8, 24, 4, 8);
        detailedPlayerGraphics.fillRect(20, 24, 4, 8);
        
        // Luces
        detailedPlayerGraphics.fillStyle(0xffffff);
        detailedPlayerGraphics.fillCircle(12, 20, 1);
        detailedPlayerGraphics.fillCircle(20, 20, 1);
        
        detailedPlayerGraphics.generateTexture('detailedPlayer', 32, 32);
        detailedPlayerGraphics.destroy();
      }
      
      // Crear texturas adicionales para efectos avanzados
      this.createEffectTextures();
    } catch (error) {
      console.error('Error creating advanced textures:', error);
      // Use basic textures as fallback
      this.createFallbackTextures();
    }
  }

  createEffectTextures() {
    try {
      // Textura de chispa para efectos de explosión
      if (!this.scene.textures.exists('spark')) {
        const sparkGraphics = this.scene.add.graphics();
        sparkGraphics.fillStyle(0xffffff);
        sparkGraphics.fillRect(0, 1, 4, 1);
        sparkGraphics.fillRect(1, 0, 1, 4);
        sparkGraphics.generateTexture('spark', 4, 4);
        sparkGraphics.destroy();
      }
      
      // Textura de humo
      if (!this.scene.textures.exists('smoke')) {
        const smokeGraphics = this.scene.add.graphics();
        smokeGraphics.fillStyle(0x666666, 0.6);
        smokeGraphics.fillCircle(8, 8, 8);
        smokeGraphics.fillStyle(0x999999, 0.4);
        smokeGraphics.fillCircle(8, 8, 6);
        smokeGraphics.generateTexture('smoke', 16, 16);
        smokeGraphics.destroy();
      }
    } catch (error) {
      console.error('Error creating effect textures:', error);
    }
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