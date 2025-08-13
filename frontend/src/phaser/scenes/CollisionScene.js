import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class CollisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CollisionScene' });
    this.player = null;
    this.movingObjects = null;
    this.staticObjects = null;
    this.cursors = null;
    this.collisionCount = 0;
    this.collisionText = null;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 50, 'Demo: Detección de Colisiones', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear jugador controlable
    this.player = this.physics.add.sprite(400, 500, 'detailedPlayer');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);
    this.player.setBounce(0.2);

    // Crear grupos de objetos
    this.movingObjects = this.physics.add.group();
    this.staticObjects = this.physics.add.group();

    // Crear objetos estáticos
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 120;
      const y = 200;
      const staticObj = this.staticObjects.create(x, y, 'asteroid');
      staticObj.setImmovable(true);
      staticObj.setScale(1.5);
      staticObj.setTint(0x00ff00);
    }

    // Crear objetos que se mueven
    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(300, 400);
      const movingObj = this.movingObjects.create(x, y, 'enemy');
      movingObj.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      );
      movingObj.setBounce(1);
      movingObj.setCollideWorldBounds(true);
      movingObj.setScale(1.5);
      movingObj.setTint(0xff6600);
    }

    // Configurar controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Configurar colisiones
    this.setupCollisions();

    // UI
    this.collisionText = this.add.text(20, 20, 'Colisiones: 0', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    // Instrucciones
    this.add.text(400, 450, 'Usa las flechas o WASD para mover la nave', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 475, 'Verde: Objetos estáticos • Naranja: Objetos móviles', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Crear límites visuales para demostrar colisiones con bordes
    this.createBounds();

    // Partículas para efectos de colisión
    this.collisionParticles = this.add.particles(0, 0, 'particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 2, end: 0 },
      lifespan: 300,
      blendMode: 'ADD'
    });
    this.collisionParticles.stop();
  }

  setupCollisions() {
    // Jugador vs objetos estáticos
    this.physics.add.collider(this.player, this.staticObjects, (player, staticObj) => {
      this.handleCollision(player, staticObj, 'estático');
    });

    // Jugador vs objetos móviles
    this.physics.add.collider(this.player, this.movingObjects, (player, movingObj) => {
      this.handleCollision(player, movingObj, 'móvil');
    });

    // Objetos móviles vs objetos estáticos
    this.physics.add.collider(this.movingObjects, this.staticObjects);

    // Objetos móviles entre sí
    this.physics.add.collider(this.movingObjects, this.movingObjects);

    // Overlap detection (no física, solo detección)
    this.physics.add.overlap(this.player, this.movingObjects, (player, movingObj) => {
      // Crear efecto visual sin afectar la física
      this.createOverlapEffect(movingObj.x, movingObj.y);
    });
  }

  handleCollision(player, object, type) {
    this.collisionCount++;
    this.collisionText.setText(`Colisiones: ${this.collisionCount}`);

    // Efecto visual de colisión
    this.collisionParticles.setTint(type === 'estático' ? 0x00ff00 : 0xff6600);
    this.collisionParticles.explode(10, object.x, object.y);

    // Efecto de destello en el objeto
    object.setTint(0xffffff);
    this.time.delayedCall(100, () => {
      object.setTint(type === 'estático' ? 0x00ff00 : 0xff6600);
    });

    // Efecto de vibración en la cámara
    this.cameras.main.shake(100, 0.01);
  }

  createOverlapEffect(x, y) {
    // Crear círculo que se expande para mostrar overlap
    const circle = this.add.graphics();
    circle.lineStyle(2, 0xffff00, 0.8);
    circle.strokeCircle(x, y, 20);

    this.tweens.add({
      targets: circle,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => circle.destroy()
    });
  }

  createBounds() {
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0x0099ff);
    graphics.strokeRect(2, 2, 796, 596);
    
    this.add.text(400, 85, 'Límites del mundo (WorldBounds)', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#0099ff'
    }).setOrigin(0.5);
  }

  update() {
    if (!this.player || !this.cursors) return;

    // Movimiento del jugador
    const speed = 200;
    
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }

    // Rotación basada en velocidad
    if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
      this.player.rotation = Math.atan2(this.player.body.velocity.y, this.player.body.velocity.x) + Math.PI / 2;
    }
  }
}

export default CollisionScene;