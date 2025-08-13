import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class BasicSpritesScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BasicSpritesScene' });
    this.assetLoader = null;
  }

  preload() {
    // Mostrar indicador de carga
    this.load.on('progress', (progress) => {
      console.log('Loading progress:', progress);
    });

    // Inicializar el cargador de assets
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadBasicAssets();
  }

  create() {
    // Fondo de estrellas
    this.add.image(400, 300, 'starfield');

    // Texto de título
    this.add.text(400, 50, 'Demo: Sprites Básicos', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Mostrar diferentes sprites
    const playerSprite = this.add.image(200, 200, 'player');
    playerSprite.setScale(2);

    const enemySprite = this.add.image(400, 200, 'enemy');
    enemySprite.setScale(2);

    const bulletSprite = this.add.image(600, 200, 'bullet');
    bulletSprite.setScale(3);

    // Agregar etiquetas para cada sprite
    this.add.text(200, 250, 'Jugador', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);

    this.add.text(400, 250, 'Enemigo', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);

    this.add.text(600, 250, 'Bala', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // Información sobre la implementación
    this.add.text(400, 350, 'Los sprites son las imágenes básicas del juego', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 380, 'Se cargan en preload() y se muestran con add.image()', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Efecto de rotación suave en los sprites
    this.tweens.add({
      targets: [playerSprite, enemySprite, bulletSprite],
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    });

    // Instrucciones
    this.add.text(400, 550, 'Los sprites rotan automáticamente para demostrar transformaciones', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#888888'
    }).setOrigin(0.5);
  }

  update() {
    // En esta demo básica no necesitamos lógica de update
  }
}

export default BasicSpritesScene;