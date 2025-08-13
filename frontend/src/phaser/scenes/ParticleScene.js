import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class ParticleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ParticleScene' });
    this.emitters = [];
    this.mouseEmitter = null;
    this.explosionEmitter = null;
    this.trailEmitter = null;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 50, 'Demo: Sistema de Partículas', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear diferentes tipos de emisores de partículas
    this.createFireworksEmitter();
    this.createSmokeEmitter();
    this.createMouseTrailEmitter();
    this.createExplosionEmitter();
    this.createRainEmitter();

    // Configurar interactividad
    this.setupInteractivity();

    // Crear controles
    this.createControls();

    // Instrucciones
    this.add.text(400, 500, 'Mueve el mouse para crear efectos de partículas • Haz clic para explosiones', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 525, 'Las partículas son ideales para fuego, humo, explosiones y efectos mágicos', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);
  }

  createFireworksEmitter() {
    // Emisor de fuegos artificiales
    this.fireworksEmitter = this.add.particles(150, 200, 'advancedParticle', {
      speed: { min: 100, max: 200 },
      scale: { start: 1, end: 0 },
      tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff],
      lifespan: 1000,
      frequency: 100,
      quantity: 5,
      blendMode: 'ADD',
      emitZone: { 
        type: 'edge', 
        source: new Phaser.Geom.Circle(0, 0, 20),
        quantity: 5
      }
    });

    // Etiqueta
    this.add.text(150, 250, 'Fuegos Artificiales', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createSmokeEmitter() {
    // Emisor de humo
    this.smokeEmitter = this.add.particles(400, 400, 'particle', {
      speed: { min: 20, max: 60 },
      scale: { start: 0.5, end: 2 },
      tint: [0x666666, 0x999999, 0xaaaaaa],
      alpha: { start: 0.8, end: 0 },
      lifespan: 2000,
      frequency: 50,
      quantity: 2,
      y: { min: 400, max: 420 },
      gravityY: -50
    });

    // Etiqueta
    this.add.text(400, 450, 'Humo', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createMouseTrailEmitter() {
    // Emisor que sigue al mouse
    this.mouseEmitter = this.add.particles(0, 0, 'advancedParticle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.8, end: 0 },
      tint: 0x00ffff,
      lifespan: 300,
      quantity: 3,
      blendMode: 'ADD',
      follow: null // Se configurará dinámicamente
    });
    this.mouseEmitter.stop();
  }

  createExplosionEmitter() {
    // Emisor para explosiones
    this.explosionEmitter = this.add.particles(0, 0, 'advancedParticle', {
      speed: { min: 200, max: 400 },
      scale: { start: 1.5, end: 0 },
      tint: [0xff6600, 0xff0000, 0xffff00],
      lifespan: 800,
      quantity: 20,
      blendMode: 'ADD'
    });
    this.explosionEmitter.stop();

    // Emisor secundario para chispas
    this.sparkEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.3, end: 0 },
      tint: 0xffffff,
      lifespan: 1200,
      quantity: 15,
      gravityY: 200
    });
    this.sparkEmitter.stop();
  }

  createRainEmitter() {
    // Emisor de lluvia
    this.rainEmitter = this.add.particles(400, -50, 'particle', {
      speed: { min: 200, max: 300 },
      scale: { start: 0.2, end: 0.1 },
      tint: 0x87CEEB,
      alpha: 0.6,
      lifespan: 2000,
      frequency: 20,
      quantity: 3,
      x: { min: 0, max: 800 },
      angle: { min: 85, max: 95 },
      gravityY: 100
    });

    // Etiqueta
    this.add.text(650, 120, 'Lluvia', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  setupInteractivity() {
    // Seguir al mouse con partículas
    this.input.on('pointermove', (pointer) => {
      // Activar emisor de rastro del mouse
      if (!this.mouseEmitter.on) {
        this.mouseEmitter.start();
      }
      this.mouseEmitter.setPosition(pointer.x, pointer.y);
    });

    // Crear explosión al hacer clic
    this.input.on('pointerdown', (pointer) => {
      this.createExplosion(pointer.x, pointer.y);
    });

    // Detener rastro del mouse cuando sale de la pantalla
    this.input.on('pointerout', () => {
      this.mouseEmitter.stop();
    });
  }

  createExplosion(x, y) {
    // Explosión principal
    this.explosionEmitter.setPosition(x, y);
    this.explosionEmitter.explode(20);

    // Chispas
    this.sparkEmitter.setPosition(x, y);
    this.sparkEmitter.explode(15);

    // Efecto de onda expansiva
    const shockwave = this.add.graphics();
    shockwave.lineStyle(3, 0xffffff, 1);
    shockwave.strokeCircle(x, y, 10);

    this.tweens.add({
      targets: shockwave,
      scaleX: 5,
      scaleY: 5,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => shockwave.destroy()
    });

    // Shake de cámara
    this.cameras.main.shake(200, 0.02);
  }

  createControls() {
    const controlsY = 100;
    
    // Botón para cambiar modo de lluvia
    this.rainButton = this.add.rectangle(650, controlsY, 120, 30, 0x0066cc, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.toggleRain())
      .on('pointerover', () => this.rainButton.setAlpha(0.9))
      .on('pointerout', () => this.rainButton.setAlpha(0.7));

    this.rainButtonText = this.add.text(650, controlsY, 'Detener Lluvia', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón para cambiar fuegos artificiales
    this.fireworksButton = this.add.rectangle(150, controlsY, 120, 30, 0xcc0066, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.toggleFireworks())
      .on('pointerover', () => this.fireworksButton.setAlpha(0.9))
      .on('pointerout', () => this.fireworksButton.setAlpha(0.7));

    this.fireworksButtonText = this.add.text(150, controlsY, 'Detener F.A.', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón para crear efecto mágico
    this.magicButton = this.add.rectangle(400, controlsY, 120, 30, 0x9900cc, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.createMagicEffect())
      .on('pointerover', () => this.magicButton.setAlpha(0.9))
      .on('pointerout', () => this.magicButton.setAlpha(0.7));

    this.add.text(400, controlsY, 'Efecto Mágico', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  toggleRain() {
    if (this.rainEmitter.on) {
      this.rainEmitter.stop();
      this.rainButtonText.setText('Iniciar Lluvia');
    } else {
      this.rainEmitter.start();
      this.rainButtonText.setText('Detener Lluvia');
    }
  }

  toggleFireworks() {
    if (this.fireworksEmitter.on) {
      this.fireworksEmitter.stop();
      this.fireworksButtonText.setText('Iniciar F.A.');
    } else {
      this.fireworksEmitter.start();
      this.fireworksButtonText.setText('Detener F.A.');
    }
  }

  createMagicEffect() {
    // Crear múltiples emisores temporales para efecto mágico
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = 400 + Math.cos(angle) * 100;
      const y = 300 + Math.sin(angle) * 100;

      const magicEmitter = this.add.particles(x, y, 'advancedParticle', {
        speed: { min: 50, max: 150 },
        scale: { start: 1, end: 0 },
        tint: [0xff00ff, 0x00ffff, 0xffff00],
        lifespan: 1500,
        quantity: 10,
        blendMode: 'ADD',
        emitZone: { 
          type: 'edge', 
          source: new Phaser.Geom.Circle(0, 0, 30),
          quantity: 10
        }
      });

      magicEmitter.explode(10);

      // Eliminar el emisor después de un tiempo
      this.time.delayedCall(2000, () => {
        magicEmitter.destroy();
      });
    }

    // Crear texto mágico
    const magicText = this.add.text(400, 300, '✨ MAGIA ✨', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ff00ff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: magicText,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      rotation: Math.PI * 2,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => magicText.destroy()
    });
  }

  update() {
    // Las partículas se actualizan automáticamente
    // Aquí podríamos agregar lógica adicional si fuera necesario
    
    // Ejemplo: hacer que los fuegos artificiales cambien de posición ocasionalmente
    if (Math.random() < 0.005) { // 0.5% de probabilidad cada frame
      this.fireworksEmitter.setPosition(
        Phaser.Math.Between(100, 200),
        Phaser.Math.Between(150, 250)
      );
    }
  }
}

export default ParticleScene;