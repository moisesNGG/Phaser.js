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
  }

  create() {
    // Fondo y dimensiones dinámicas
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;
    this.add.image(w / 2, h / 2, 'starfield').setDisplaySize(w, h);

    // Título
    this.add.text(w / 2, h * 0.13, 'Demo: Animaciones', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear animación para el jugador
    this.anims.create({
      key: 'player-idle',
      frames: [
        { key: 'detailedPlayer' },
        { key: 'player' },
        { key: 'detailedPlayer' },
        { key: 'player' }
      ],
      frameRate: 4,
      repeat: -1
    });

    // Crear animación de rotación
    this.anims.create({
      key: 'spin',
      frames: [
        { key: 'enemy' },
        { key: 'bullet' },
        { key: 'asteroid' },
        { key: 'particle' }
      ],
      frameRate: 6,
      repeat: -1
    });

      // Sprite animado principal
    // Sprite animado principal
    const animatedPlayer = this.add.sprite(w * 0.2, h * 0.35, 'detailedPlayer');
    animatedPlayer.setScale(0.05);
    animatedPlayer.play('player-idle');
    this.animatedSprites.push(animatedPlayer);

    // Múltiples sprites rotando
    for (let i = 0; i < 5; i++) {
      const x = w * (0.12 + 0.18 * i);
      const y = h * 0.65;
      const sprite = this.add.sprite(x, y, 'enemy');
      sprite.setScale(0.05);
      sprite.play('spin');
      this.animatedSprites.push(sprite);
    }

    // Animación con tweens (interpolación)
    const tweenSprite = this.add.image(w * 0.8, h * 0.35, 'asteroid');
    tweenSprite.setScale(0.12);
    this.tweens.add({
      targets: tweenSprite,
      y: h * 0.65,
      duration: 2000,
      ease: 'Bounce.easeOut',
      yoyo: true,
      repeat: -1
    });
    this.tweens.add({
      targets: tweenSprite,
      rotation: Math.PI * 2,
      duration: 3000,
      repeat: -1
    });

    // Animación de escala pulsante
    const pulseSprite = this.add.image(w * 0.8, h * 0.65, 'bullet');
    pulseSprite.setScale(0.12);
    this.tweens.add({
      targets: pulseSprite,
      scaleX: 0.2,
      scaleY: 0.2,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Etiquetas explicativas
    this.add.text(w * 0.2, h * 0.48, 'Animación por frames', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);

    this.add.text(w * 0.5, h * 0.80, 'Rotación con diferentes sprites', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ff00ff'
    }).setOrigin(0.5);

    this.add.text(w * 0.8, h * 0.48, 'Tween de movimiento', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffff00'
    }).setOrigin(0.5);

    this.add.text(w * 0.8, h * 0.80, 'Tween de escala', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00ffff'
    }).setOrigin(0.5);

    // Información
    this.add.text(w / 2, h * 0.92, 'Las animaciones pueden ser por frames o usando tweens (interpolación)', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.96, 'Los tweens permiten animar cualquier propiedad: posición, rotación, escala, alpha, etc.', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Animación del título
    this.tweens.add({
      targets: this.children.getByName('title') || this.add.text(400, 50, 'Demo: Animaciones', {
        fontSize: '24px',
        fontFamily: 'Arial',
        fill: '#ffffff',
        name: 'title'
      }).setOrigin(0.5),
      alpha: 0.5,
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  update() {
    // En esta demo, las animaciones se manejan automáticamente
    // Podríamos agregar lógica adicional aquí si fuera necesario
  }
}

export default AnimationScene;