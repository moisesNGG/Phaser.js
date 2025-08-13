import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class AnimationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AnimationScene' });
    this.animatedSprites = [];
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
    
    // Crear una textura de spritesheet simulada para animación
    this.createAnimatedSpritesheet();
  }

  createAnimatedSpritesheet() {
    const frames = [];
    const colors = [0x00ff00, 0x44ff44, 0x88ff88, 0xccffcc];
    
    for (let i = 0; i < 4; i++) {
      const graphics = this.add.graphics();
      graphics.fillStyle(colors[i]);
      graphics.fillTriangle(16, 0, 0, 32, 32, 32);
      
      // Agregar efectos para cada frame
      graphics.fillStyle(0xffffff);
      for (let j = 0; j < i + 1; j++) {
        graphics.fillCircle(8 + j * 4, 20, 1);
      }
      
      graphics.generateTexture(`playerFrame${i}`, 32, 32);
      frames.push({ key: `playerFrame${i}` });
      graphics.destroy();
    }

    // Crear animación usando los frames generados
    this.anims.create({
      key: 'playerIdle',
      frames: frames.map((frame, index) => ({ key: frame.key })),
      frameRate: 4,
      repeat: -1
    });

    // Crear animación de pulso para enemigos
    const enemyFrames = [];
    const enemyColors = [0xff0000, 0xff4444, 0xff8888, 0xff4444];
    
    for (let i = 0; i < 4; i++) {
      const graphics = this.add.graphics();
      graphics.fillStyle(enemyColors[i]);
      graphics.fillRect(0, 0, 24, 24);
      graphics.generateTexture(`enemyFrame${i}`, 24, 24);
      enemyFrames.push({ key: `enemyFrame${i}` });
      graphics.destroy();
    }

    this.anims.create({
      key: 'enemyPulse',
      frames: enemyFrames.map((frame, index) => ({ key: frame.key })),
      frameRate: 6,
      repeat: -1
    });
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 50, 'Demo: Sistema de Animaciones', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear sprites animados
    this.createAnimatedPlayer();
    this.createAnimatedEnemies();
    this.createTweenAnimations();
    this.createTimeline();

    // Instrucciones
    this.add.text(400, 520, 'Las animaciones combinan frames de sprites y tweens', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 545, 'Haz click para crear más animaciones', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Configurar input para animaciones interactivas
    this.input.on('pointerdown', this.createClickAnimation, this);
  }

  createAnimatedPlayer() {
    // Jugador con animación de frames
    this.player = this.add.sprite(200, 200, 'playerFrame0');
    this.player.setScale(2);
    this.player.play('playerIdle');

    this.add.text(200, 250, 'Frame Animation', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);

    // Movimiento circular usando tween
    this.tweens.add({
      targets: this.player,
      x: 300,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createAnimatedEnemies() {
    // Crear varios enemigos con animaciones
    for (let i = 0; i < 3; i++) {
      const enemy = this.add.sprite(500 + i * 80, 200, 'enemyFrame0');
      enemy.setScale(1.5);
      enemy.play('enemyPulse');
      
      // Cada enemigo tiene un patrón de movimiento diferente
      this.tweens.add({
        targets: enemy,
        y: 200 + Math.sin(i) * 50,
        duration: 1500 + i * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.animatedSprites.push(enemy);
    }

    this.add.text(580, 250, 'Sprite Animations', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);
  }

  createTweenAnimations() {
    // Crear círculos animados con tweens
    for (let i = 0; i < 5; i++) {
      const circle = this.add.graphics();
      circle.fillStyle(Phaser.Math.Between(0x0066cc, 0x00ffff));
      circle.fillCircle(0, 0, 8);
      
      circle.x = 150 + i * 100;
      circle.y = 350;

      // Animación compleja con múltiples propiedades
      this.tweens.add({
        targets: circle,
        scaleX: 2,
        scaleY: 2,
        alpha: 0.3,
        rotation: Math.PI * 2,
        duration: 2000 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Back.easeInOut',
        delay: i * 200
      });
    }

    this.add.text(400, 400, 'Tween Animations (Scale, Alpha, Rotation)', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00ffff'
    }).setOrigin(0.5);
  }

  createTimeline() {
    // Crear una timeline más compleja
    const star = this.add.graphics();
    star.fillStyle(0xffff00);
    star.fillStar(0, 0, 5, 10, 20);
    star.x = 100;
    star.y = 450;

    // Timeline con múltiples animaciones secuenciales
    const timeline = this.tweens.createTimeline({
      repeat: -1
    });

    timeline.add({
      targets: star,
      x: 700,
      duration: 3000,
      ease: 'Power2'
    });

    timeline.add({
      targets: star,
      y: 150,
      scaleX: 2,
      scaleY: 2,
      duration: 1500,
      ease: 'Bounce.easeOut'
    });

    timeline.add({
      targets: star,
      x: 100,
      rotation: Math.PI * 4,
      duration: 2000,
      ease: 'Power2'
    });

    timeline.add({
      targets: star,
      y: 450,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      duration: 1500,
      ease: 'Back.easeIn'
    });

    timeline.play();

    this.add.text(400, 480, 'Timeline Animation (Secuencial)', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffff00'
    }).setOrigin(0.5);
  }

  createClickAnimation(pointer) {
    // Crear animación en el punto de click
    const burst = this.add.graphics();
    burst.x = pointer.x;
    burst.y = pointer.y;

    // Crear múltiples partículas
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50;
      
      const particle = this.add.graphics();
      particle.fillStyle(Phaser.Math.Between(0xff6600, 0xffff00));
      particle.fillCircle(0, 0, 4);
      particle.x = pointer.x;
      particle.y = pointer.y;

      this.tweens.add({
        targets: particle,
        x: pointer.x + Math.cos(angle) * distance,
        y: pointer.y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy();
        }
      });
    }

    // Efecto de onda expansiva
    const wave = this.add.graphics();
    wave.lineStyle(3, 0xffffff, 0.8);
    wave.strokeCircle(pointer.x, pointer.y, 5);

    this.tweens.add({
      targets: wave,
      scaleX: 10,
      scaleY: 10,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        wave.destroy();
      }
    });
  }

  update() {
    // Las animaciones se manejan automáticamente por el motor de Phaser
    // Aquí podríamos agregar lógica para cambiar animaciones basada en condiciones
  }
}

export default AnimationScene;