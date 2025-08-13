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
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 50, 'Demo: Animaciones', {
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
    const animatedPlayer = this.add.sprite(200, 200, 'detailedPlayer');
    animatedPlayer.setScale(3);
    animatedPlayer.play('player-idle');
    this.animatedSprites.push(animatedPlayer);

    // Múltiples sprites rotando
    for (let i = 0; i < 5; i++) {
      const x = 150 + i * 100;
      const y = 350;
      const sprite = this.add.sprite(x, y, 'enemy');
      sprite.setScale(2);
      sprite.play('spin');
      this.animatedSprites.push(sprite);
    }

    // Animación con tweens (interpolación)
    const tweenSprite = this.add.image(600, 200, 'asteroid');
    tweenSprite.setScale(2);
    
    this.tweens.add({
      targets: tweenSprite,
      y: 400,
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
    const pulseSprite = this.add.image(600, 350, 'bullet');
    pulseSprite.setScale(3);
    
    this.tweens.add({
      targets: pulseSprite,
      scaleX: 5,
      scaleY: 5,
      duration: 1000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });

    // Etiquetas explicativas
    this.add.text(200, 260, 'Animación por frames', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);

    this.add.text(400, 410, 'Rotación con diferentes sprites', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ff00ff'
    }).setOrigin(0.5);

    this.add.text(600, 260, 'Tween de movimiento', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffff00'
    }).setOrigin(0.5);

    this.add.text(600, 410, 'Tween de escala', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#00ffff'
    }).setOrigin(0.5);

    // Información
    this.add.text(400, 500, 'Las animaciones pueden ser por frames o usando tweens (interpolación)', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 525, 'Los tweens permiten animar cualquier propiedad: posición, rotación, escala, alpha, etc.', {
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