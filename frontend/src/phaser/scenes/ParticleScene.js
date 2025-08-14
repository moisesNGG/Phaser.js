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
    // Fondo y dimensiones dinámicas
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;
    this.add.image(w / 2, h / 2, 'starfield').setDisplaySize(w, h);

    // Título
    this.add.text(w / 2, h * 0.07, 'Demo: Sistema de Partículas', {
      fontSize: Math.round(h * 0.045) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5, 0);

    // Crear diferentes tipos de emisores de partículas
    this.createFireworksEmitter(w, h);
    this.createSmokeEmitter(w, h);
    this.createMouseTrailEmitter(w, h);
    this.createExplosionEmitter(w, h);
    this.createRainEmitter(w, h);

    // Configurar interactividad
    this.setupInteractivity();

    // Crear controles
    this.createControls(w, h);

    // Instrucciones
    this.add.text(w / 2, h * 0.92, 'Mueve el mouse para crear efectos de partículas • Haz clic para explosiones', {
      fontSize: Math.round(h * 0.025) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.96, 'Las partículas son ideales para fuego, humo, explosiones y efectos mágicos', {
      fontSize: Math.round(h * 0.02) + 'px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);
  }

  createFireworksEmitter() {
    // Emisor de fuegos artificiales
    const x = arguments[0] ? arguments[0] * 0.18 : 150;
    const y = arguments[1] ? arguments[1] * 0.32 : 200;
    const h = arguments[1] || 600;
    this.fireworksEmitter = this.add.particles(x, y, 'advancedParticle', {
      speed: { min: h * 0.16, max: h * 0.33 },
      scale: { start: h * 0.0017, end: 0 },
      tint: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff],
      lifespan: 1000,
      frequency: 100,
      quantity: 5,
      blendMode: 'ADD',
      emitZone: { 
        type: 'edge', 
        source: new Phaser.Geom.Circle(0, 0, h * 0.033),
        quantity: 5
      }
    });

    // Etiqueta
    this.add.text(x, y + h * 0.08, 'Fuegos Artificiales', {
      fontSize: Math.round(h * 0.023) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createSmokeEmitter() {
    const w = arguments[0] || 800;
    const h = arguments[1] || 600;
    this.smokeEmitter = this.add.particles(w * 0.5, h * 0.67, 'particle', {
      speed: { min: h * 0.033, max: h * 0.1 },
      scale: { start: h * 0.001, end: h * 0.0033 },
      tint: [0x666666, 0x999999, 0xaaaaaa],
      alpha: { start: 0.8, end: 0 },
      lifespan: 2000,
      frequency: 50,
      quantity: 2,
      y: { min: h * 0.67, max: h * 0.7 },
      gravityY: -h * 0.083
    });

    // Etiqueta
    this.add.text(w * 0.5, h * 0.75, 'Humo', {
      fontSize: Math.round(h * 0.023) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createMouseTrailEmitter() {
    const h = arguments[1] || 600;
    // Emisor que sigue al mouse
    this.mouseEmitter = this.add.particles(0, 0, 'advancedParticle', {
      speed: { min: h * 0.083, max: h * 0.167 },
      scale: { start: h * 0.0013, end: 0 },
      tint: 0x00ffff,
      lifespan: 300,
      quantity: 3,
      blendMode: 'ADD',
      follow: null // Se configurará dinámicamente
    });
    this.mouseEmitter.stop();
  }

  createExplosionEmitter() {
    const h = arguments[1] || 600;
    // Emisor para explosiones
    this.explosionEmitter = this.add.particles(0, 0, 'advancedParticle', {
      speed: { min: h * 0.33, max: h * 0.67 },
      scale: { start: h * 0.0025, end: 0 },
      tint: [0xff6600, 0xff0000, 0xffff00],
      lifespan: 800,
      quantity: 20,
      blendMode: 'ADD'
    });
    this.explosionEmitter.stop();

    // Emisor secundario para chispas
    this.sparkEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: h * 0.17, max: h * 0.5 },
      scale: { start: h * 0.0005, end: 0 },
      tint: 0xffffff,
      lifespan: 1200,
      quantity: 15,
      gravityY: h * 0.33
    });
    this.sparkEmitter.stop();
  }

  createRainEmitter() {
    const w = arguments[0] || 800;
    const h = arguments[1] || 600;
    // Emisor de lluvia
    this.rainEmitter = this.add.particles(w * 0.5, -h * 0.08, 'particle', {
      speed: { min: h * 0.33, max: h * 0.5 },
      scale: { start: h * 0.00033, end: h * 0.00017 },
      tint: 0x87CEEB,
      alpha: 0.6,
      lifespan: 2000,
      frequency: 20,
      quantity: 3,
      x: { min: 0, max: w },
      angle: { min: 85, max: 95 },
      gravityY: h * 0.17
    });

    // Etiqueta
    this.add.text(w * 0.81, h * 0.2, 'Lluvia', {
      fontSize: Math.round(h * 0.023) + 'px',
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
    const w = arguments[0] || 800;
    const h = arguments[1] || 600;
    const controlsY = h * 0.16;

    // Botón para cambiar modo de lluvia
    this.rainButton = this.add.rectangle(w * 0.81, controlsY, w * 0.15, h * 0.05, 0x0066cc, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.toggleRain())
      .on('pointerover', () => this.rainButton.setAlpha(0.9))
      .on('pointerout', () => this.rainButton.setAlpha(0.7));

    this.rainButtonText = this.add.text(w * 0.81, controlsY, 'Detener Lluvia', {
      fontSize: Math.round(h * 0.02) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón para cambiar fuegos artificiales
    this.fireworksButton = this.add.rectangle(w * 0.18, controlsY, w * 0.15, h * 0.05, 0xcc0066, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.toggleFireworks())
      .on('pointerover', () => this.fireworksButton.setAlpha(0.9))
      .on('pointerout', () => this.fireworksButton.setAlpha(0.7));

    this.fireworksButtonText = this.add.text(w * 0.18, controlsY, 'Detener F.A.', {
      fontSize: Math.round(h * 0.02) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón para crear efecto mágico
    this.magicButton = this.add.rectangle(w * 0.5, controlsY, w * 0.18, h * 0.05, 0x9900cc, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.createMagicEffect(w, h))
      .on('pointerover', () => this.magicButton.setAlpha(0.9))
      .on('pointerout', () => this.magicButton.setAlpha(0.7));

    this.add.text(w * 0.5, controlsY, 'Efecto Mágico', {
      fontSize: Math.round(h * 0.02) + 'px',
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
    const w = arguments[0] || 800;
    const h = arguments[1] || 600;
    // Crear múltiples emisores temporales para efecto mágico
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const x = w * 0.5 + Math.cos(angle) * w * 0.13;
      const y = h * 0.5 + Math.sin(angle) * h * 0.13;

      const magicEmitter = this.add.particles(x, y, 'advancedParticle', {
        speed: { min: h * 0.083, max: h * 0.25 },
        scale: { start: h * 0.0017, end: 0 },
        tint: [0xff00ff, 0x00ffff, 0xffff00],
        lifespan: 1500,
        quantity: 10,
        blendMode: 'ADD',
        emitZone: { 
          type: 'edge', 
          source: new Phaser.Geom.Circle(0, 0, h * 0.05),
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
    const magicText = this.add.text(w * 0.5, h * 0.5, '✨ MAGIA ✨', {
      fontSize: Math.round(h * 0.053) + 'px',
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