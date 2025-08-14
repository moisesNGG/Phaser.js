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
    // Obtener tamaño dinámico
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;

    // Fondo de estrellas
    this.add.image(w / 2, h / 2, 'starfield').setDisplaySize(w, h);

    // Texto de título
    this.add.text(w / 2, h * 0.13, 'Demo: Sprites Básicos', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Mostrar diferentes sprites con tamaño reducido y centrados
    const playerSprite = this.add.image(w * 0.3, h * 0.45, 'player');
    playerSprite.setScale(0.05);

    const enemySprite = this.add.image(w * 0.5, h * 0.45, 'enemy');
    enemySprite.setScale(0.05);

    const bulletSprite = this.add.image(w * 0.7, h * 0.45, 'bullet');
    bulletSprite.setScale(0.05);

    // Agregar etiquetas para cada sprite
    this.add.text(w * 0.3, h * 0.60, 'Jugador', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);

    this.add.text(w * 0.5, h * 0.60, 'Enemigo', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);

    this.add.text(w * 0.7, h * 0.60, 'Bala', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // Información sobre la implementación
    this.add.text(w / 2, h * 0.75, 'Los sprites son las imágenes básicas del juego', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.80, 'Se cargan en preload() y se muestran con add.image()', {
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
    this.add.text(w / 2, h * 0.96, 'Los sprites rotan automáticamente para demostrar transformaciones', {
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