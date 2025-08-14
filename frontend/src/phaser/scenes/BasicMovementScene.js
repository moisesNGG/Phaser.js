import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class BasicMovementScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BasicMovementScene' });
    this.player = null;
    this.cursors = null;
    this.speed = 200;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadBasicAssets();
  }

  create() {
    // Obtener tamaño dinámico
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;

    // Fondo
    this.add.image(w / 2, h / 2, 'starfield').setDisplaySize(w, h);

    // Título
    this.add.text(w / 2, h * 0.08, 'Demo: Movimiento Básico', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear jugador
    this.player = this.add.image(w / 2, h / 2, 'player');
    this.player.setScale(0.05);

    // Configurar controles
    this.cursors = this.input.keyboard.createCursorKeys();
    // Controles adicionales (WASD)
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Instrucciones
    this.add.text(w / 2, h * 0.92, 'Usa las flechas o WASD para mover la nave', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.96, 'El movimiento se calcula en tiempo real usando update()', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Mostrar coordenadas del jugador
    this.positionText = this.add.text(20, 20, '', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    // Crear límites visuales
    this.createBounds(w, h);
  }

  createBounds() {
    // Usar proporciones para los límites
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;
    const marginX = w * 0.07;
    const marginY = h * 0.18;
    const areaW = w - marginX * 2;
    const areaH = h - marginY * 2;
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(marginX, marginY, areaW, areaH);
    this.add.text(w / 2, marginY - 15, 'Área de movimiento', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);
  }

  update() {
    if (!this.player || !this.cursors) return;

    let velocityX = 0;
    let velocityY = 0;

    // Movimiento horizontal
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -this.speed;
    }
    else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = this.speed;
    }

    // Movimiento vertical
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -this.speed;
    }
    else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = this.speed;
    }

    // Aplicar movimiento basado en delta time
    const deltaTime = this.game.loop.delta / 1000; // Convertir a segundos
    this.player.x += velocityX * deltaTime;
    this.player.y += velocityY * deltaTime;

  // Mantener el jugador dentro de los límites dinámicos
  const w = this.sys.game.scale.width;
  const h = this.sys.game.scale.height;
  const marginX = w * 0.07;
  const marginY = h * 0.18;
  const areaW = w - marginX * 2;
  const areaH = h - marginY * 2;
  this.player.x = Phaser.Math.Clamp(this.player.x, marginX, marginX + areaW);
  this.player.y = Phaser.Math.Clamp(this.player.y, marginY, marginY + areaH);

    // Actualizar información de posición
    this.positionText.setText(`Posición: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`);

    // Rotación basada en la dirección del movimiento
    if (velocityX !== 0 || velocityY !== 0) {
      const angle = Math.atan2(velocityY, velocityX);
      this.player.rotation = angle + Math.PI / 2; // Ajustar para que apunte hacia arriba por defecto
    }
  }
}

export default BasicMovementScene;