import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class ParticleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ParticleScene' });
    this.particleSystems = [];
    this.emitters = [];
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 30, 'Demo: Sistema de Partículas', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear diferentes sistemas de partículas
    this.createFireworks();
    this.createSmoke();
    this.createMagic();
    this.createWeatherEffects();

    // Controles interactivos
    this.setupInteractiveControls();

    // Instrucciones
    this.add.text(400, 560, 'Haz click para crear explosiones | Presiona teclas 1-4 para diferentes efectos', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Configurar input
    this.input.on('pointerdown', this.createExplosion, this);
    this.setupKeyboardControls();
  }

  createFireworks() {
    // Sistema de fuegos artificiales en la esquina superior izquierda
    this.add.text(150, 80, 'Fuegos Artificiales', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffaa00'
    }).setOrigin(0.5);

    const fireworksEmitter = this.add.particles(150, 120, 'advancedParticle', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 800,
      quantity: 1,
      frequency: 500,
      gravityY: -50,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Circle(0, 0, 20)
      }
    });

    // Cambiar colores dinámicamente
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        fireworksEmitter.setTint(randomColor);
      },
      loop: true
    });

    this.emitters.push(fireworksEmitter);
  }

  createSmoke() {
    // Sistema de humo en la esquina superior derecha
    this.add.text(650, 80, 'Efecto de Humo', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#888888'
    }).setOrigin(0.5);

    const smokeEmitter = this.add.particles(650, 120, 'particle', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.3, end: 1.5 },
      alpha: { start: 0.8, end: 0 },
      blendMode: 'MULTIPLY',
      lifespan: 3000,
      quantity: 2,
      frequency: 200,
      gravityY: -30,
      tint: 0x666666
    });

    this.emitters.push(smokeEmitter);
  }

  createMagic() {
    // Sistema de efectos mágicos en el centro
    this.add.text(400, 150, 'Efectos Mágicos', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#9966ff'
    }).setOrigin(0.5);

    const magicEmitter = this.add.particles(400, 200, 'advancedParticle', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.8, end: 0.1 },
      blendMode: 'ADD',
      lifespan: 1500,
      quantity: 3,
      frequency: 300,
      tint: 0x9966ff,
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Circle(0, 0, 30),
        quantity: 8
      }
    });

    // Crear un patrón orbital
    const orbitCenter = { x: 400, y: 200 };
    this.tweens.add({
      targets: orbitCenter,
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear',
      onUpdate: () => {
        const radius = 40;
        const angle = orbitCenter.rotation || 0;
        magicEmitter.setPosition(
          400 + Math.cos(angle) * radius,
          200 + Math.sin(angle) * radius
        );
      }
    });

    this.emitters.push(magicEmitter);
  }

  createWeatherEffects() {
    // Sistema de lluvia/nieve
    this.add.text(200, 300, 'Efectos Climáticos', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00aaff'
    }).setOrigin(0.5);

    this.rainEmitter = this.add.particles(400, 0, 'particle', {
      x: { min: 0, max: 800 },
      y: -10,
      speedY: { min: 200, max: 400 },
      speedX: { min: -20, max: 20 },
      scale: { min: 0.1, max: 0.3 },
      alpha: 0.7,
      lifespan: 3000,
      quantity: 3,
      frequency: 100,
      tint: 0x00aaff
    });

    this.rainEmitter.stop(); // Inicialmente apagado

    this.emitters.push(this.rainEmitter);
  }

  setupInteractiveControls() {
    // Panel de controles
    const controlPanel = this.add.rectangle(600, 400, 250, 150, 0x333333, 0.8);
    controlPanel.setStrokeStyle(2, 0x666666);

    this.add.text(600, 340, 'Controles', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botones de control
    const controls = [
      { name: '1: Fuegos', key: '1', action: () => this.toggleFireworks() },
      { name: '2: Humo', key: '2', action: () => this.toggleSmoke() },
      { name: '3: Magia', key: '3', action: () => this.toggleMagic() },
      { name: '4: Lluvia', key: '4', action: () => this.toggleRain() }
    ];

    controls.forEach((control, index) => {
      const button = this.add.rectangle(600, 370 + index * 25, 200, 20, 0x555555);
      button.setInteractive();
      
      const buttonText = this.add.text(600, 370 + index * 25, control.name, {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerdown', control.action);
      
      button.on('pointerover', () => {
        button.setFillStyle(0x777777);
      });
      
      button.on('pointerout', () => {
        button.setFillStyle(0x555555);
      });
    });
  }

  setupKeyboardControls() {
    // Configurar teclas numéricas
    this.key1 = this.input.keyboard.addKey('ONE');
    this.key2 = this.input.keyboard.addKey('TWO');
    this.key3 = this.input.keyboard.addKey('THREE');
    this.key4 = this.input.keyboard.addKey('FOUR');

    // Eventos de teclado
    this.input.keyboard.on('keydown-ONE', this.toggleFireworks, this);
    this.input.keyboard.on('keydown-TWO', this.toggleSmoke, this);
    this.input.keyboard.on('keydown-THREE', this.toggleMagic, this);
    this.input.keyboard.on('keydown-FOUR', this.toggleRain, this);
  }

  createExplosion(pointer) {
    // Crear explosión en el punto de click
    const explosionEmitter = this.add.particles(pointer.x, pointer.y, 'advancedParticle', {
      speed: { min: 100, max: 300 },
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 600,
      quantity: 20,
      tint: [0xff6600, 0xff0000, 0xffff00, 0xff3300]
    });

    // Auto-destruir después de la explosión
    this.time.delayedCall(1000, () => {
      explosionEmitter.destroy();
    });

    // Crear ondas de choque
    this.createShockwave(pointer.x, pointer.y);

    // Crear fragmentos
    this.createDebris(pointer.x, pointer.y);
  }

  createShockwave(x, y) {
    // Crear múltiples ondas de choque
    for (let i = 0; i < 3; i++) {
      const wave = this.add.graphics();
      wave.lineStyle(3 - i, 0xffffff, 0.8 - i * 0.2);
      wave.strokeCircle(x, y, 5);

      this.tweens.add({
        targets: wave,
        scaleX: 8 + i * 2,
        scaleY: 8 + i * 2,
        alpha: 0,
        duration: 800 + i * 200,
        ease: 'Power2',
        delay: i * 100,
        onComplete: () => {
          wave.destroy();
        }
      });
    }
  }

  createDebris(x, y) {
    // Crear fragmentos que vuelan en todas las direcciones
    for (let i = 0; i < 12; i++) {
      const debris = this.add.graphics();
      debris.fillStyle(Phaser.Math.Between(0x666666, 0xcccccc));
      const size = Phaser.Math.Between(2, 6);
      debris.fillRect(-size/2, -size/2, size, size);
      debris.x = x;
      debris.y = y;

      const angle = (i / 12) * Math.PI * 2;
      const distance = Phaser.Math.Between(50, 120);
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      this.tweens.add({
        targets: debris,
        x: targetX,
        y: targetY + 100, // Simular gravedad
        rotation: Math.random() * Math.PI * 4,
        alpha: 0,
        duration: Phaser.Math.Between(800, 1500),
        ease: 'Power2',
        onComplete: () => {
          debris.destroy();
        }
      });
    }
  }

  toggleFireworks() {
    const emitter = this.emitters[0];
    if (emitter.on) {
      emitter.stop();
      console.log('Fuegos artificiales: OFF');
    } else {
      emitter.start();
      console.log('Fuegos artificiales: ON');
    }
  }

  toggleSmoke() {
    const emitter = this.emitters[1];
    if (emitter.on) {
      emitter.stop();
      console.log('Humo: OFF');
    } else {
      emitter.start();
      console.log('Humo: ON');
    }
  }

  toggleMagic() {
    const emitter = this.emitters[2];
    if (emitter.on) {
      emitter.stop();
      console.log('Efectos mágicos: OFF');
    } else {
      emitter.start();
      console.log('Efectos mágicos: ON');
    }
  }

  toggleRain() {
    if (this.rainEmitter.on) {
      this.rainEmitter.stop();
      console.log('Lluvia: OFF');
    } else {
      this.rainEmitter.start();
      console.log('Lluvia: ON');
    }
  }

  // Crear sistema de partículas personalizado usando gráficos
  createCustomParticleSystem(x, y, config) {
    const particles = [];
    
    for (let i = 0; i < config.count; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(config.color || 0xffffff);
      
      if (config.shape === 'circle') {
        particle.fillCircle(0, 0, config.size || 2);
      } else {
        particle.fillRect(-config.size/2, -config.size/2, config.size, config.size);
      }

      particle.x = x + (Math.random() - 0.5) * (config.spread || 20);
      particle.y = y + (Math.random() - 0.5) * (config.spread || 20);

      const velocity = {
        x: (Math.random() - 0.5) * (config.speed || 100),
        y: (Math.random() - 0.5) * (config.speed || 100)
      };

      particles.push({ graphic: particle, velocity, life: config.lifespan || 1000 });
    }

    // Animar partículas personalizadas
    particles.forEach(p => {
      this.tweens.add({
        targets: p.graphic,
        x: p.graphic.x + p.velocity.x,
        y: p.graphic.y + p.velocity.y,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: p.life,
        ease: 'Power2',
        onComplete: () => {
          p.graphic.destroy();
        }
      });
    });
  }

  update() {
    // Los sistemas de partículas se actualizan automáticamente
    // Aquí podríamos agregar lógica adicional para efectos complejos
  }
}

export default ParticleScene;