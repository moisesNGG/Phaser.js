import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class CollisionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CollisionScene' });
    this.player = null;
    this.enemies = null;
    this.bullets = null;
    this.collectibles = null;
    this.score = 0;
    this.cursors = null;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadBasicAssets();
  }

  create() {
    // Habilitar física Arcade
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 30, 'Demo: Detección de Colisiones', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear jugador con física
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setScale(2);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    // Crear grupos de objetos
    this.enemies = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.collectibles = this.physics.add.group();
    this.obstacles = this.physics.add.group();

    // Configurar controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Crear enemigos iniciales
    this.createEnemies();
    this.createCollectibles();
    this.createObstacles();

    // Configurar colisiones
    this.setupCollisions();

    // UI
    this.scoreText = this.add.text(20, 20, 'Puntuación: 0', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    this.livesText = this.add.text(20, 45, 'Vidas: 3', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    this.lives = 3;

    // Instrucciones
    this.add.text(400, 570, 'Flechas: Mover | Espacio: Disparar | Recoge objetos verdes, evita rojos', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Temporizadores para spawns
    this.enemyTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.collectibleTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnCollectible,
      callbackScope: this,
      loop: true
    });
  }

  createEnemies() {
    // Crear enemigos iniciales en posiciones aleatorias
    for (let i = 0; i < 5; i++) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(100, 200);
    
    const enemy = this.enemies.create(x, y, 'enemy');
    enemy.setScale(1.5);
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocity(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(50, 150)
    );

    // Añadir efecto visual al enemigo
    enemy.setTint(0xff0000);
    
    // Rotación constante
    enemy.angularVelocity = Phaser.Math.Between(-200, 200);
  }

  createCollectibles() {
    // Crear objetos coleccionables
    for (let i = 0; i < 3; i++) {
      this.spawnCollectible();
    }
  }

  spawnCollectible() {
    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(150, 400);
    
    const collectible = this.collectibles.create(x, y, 'particle');
    collectible.setScale(4);
    collectible.setTint(0x00ff00);
    collectible.setBounce(0.8);
    collectible.setCollideWorldBounds(true);
    
    // Movimiento suave
    collectible.setVelocity(
      Phaser.Math.Between(-50, 50),
      Phaser.Math.Between(-50, 50)
    );

    // Efecto de pulso
    this.tweens.add({
      targets: collectible,
      scaleX: 6,
      scaleY: 6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createObstacles() {
    // Crear obstáculos estáticos
    const obstaclePositions = [
      { x: 200, y: 300 },
      { x: 600, y: 250 },
      { x: 400, y: 350 }
    ];

    obstaclePositions.forEach(pos => {
      const obstacle = this.obstacles.create(pos.x, pos.y, 'asteroid');
      obstacle.setScale(1.5);
      obstacle.setImmovable(true);
      obstacle.setTint(0x888888);
    });
  }

  setupCollisions() {
    // Jugador vs Enemigos
    this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);

    // Jugador vs Coleccionables
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);

    // Balas vs Enemigos
    this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);

    // Balas vs Obstáculos
    this.physics.add.collider(this.bullets, this.obstacles, this.bulletHitObstacle, null, this);

    // Jugador vs Obstáculos
    this.physics.add.collider(this.player, this.obstacles);

    // Enemigos vs Obstáculos
    this.physics.add.collider(this.enemies, this.obstacles);

    // Enemigos entre sí
    this.physics.add.collider(this.enemies, this.enemies);
  }

  playerHitEnemy(player, enemy) {
    // Efecto de daño al jugador
    this.createExplosion(player.x, player.y, 0xff4444);
    
    // Reducir vidas
    this.lives--;
    this.livesText.setText(`Vidas: ${this.lives}`);

    // Efecto de invulnerabilidad temporal
    player.setTint(0xff0000);
    player.setAlpha(0.5);

    this.time.delayedCall(1000, () => {
      player.clearTint();
      player.setAlpha(1);
    });

    // Eliminar enemigo
    enemy.destroy();

    // Game over check
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  collectItem(player, collectible) {
    // Incrementar puntuación
    this.score += 10;
    this.scoreText.setText(`Puntuación: ${this.score}`);

    // Efecto visual
    this.createExplosion(collectible.x, collectible.y, 0x00ff00);

    // Eliminar coleccionable
    collectible.destroy();

    // Sonido de colección (mock)
    console.log('¡Objeto recogido!');
  }

  bulletHitEnemy(bullet, enemy) {
    // Incrementar puntuación
    this.score += 5;
    this.scoreText.setText(`Puntuación: ${this.score}`);

    // Crear explosión
    this.createExplosion(enemy.x, enemy.y, 0xffaa00);

    // Eliminar bala y enemigo
    bullet.destroy();
    enemy.destroy();
  }

  bulletHitObstacle(bullet, obstacle) {
    // Crear chispas
    this.createSparks(bullet.x, bullet.y);
    bullet.destroy();
  }

  createExplosion(x, y, color = 0xffffff) {
    // Crear múltiples partículas para simular explosión
    for (let i = 0; i < 8; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(color);
      particle.fillCircle(0, 0, 3);
      particle.x = x;
      particle.y = y;

      const angle = (i / 8) * Math.PI * 2;
      const distance = Phaser.Math.Between(30, 60);

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  createSparks(x, y) {
    for (let i = 0; i < 4; i++) {
      const spark = this.add.graphics();
      spark.fillStyle(0xffff00);
      spark.fillCircle(0, 0, 2);
      spark.x = x;
      spark.y = y;

      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-20, 20),
        y: y + Phaser.Math.Between(-20, 20),
        alpha: 0,
        duration: 300,
        onComplete: () => spark.destroy()
      });
    }
  }

  shoot() {
    const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
    bullet.setScale(2);
    bullet.setVelocityY(-400);
    bullet.setTint(0x00ffff);

    // Auto-destruir balas fuera de pantalla
    this.time.delayedCall(2000, () => {
      if (bullet && bullet.active) {
        bullet.destroy();
      }
    });
  }

  gameOver() {
    // Pausar el juego
    this.physics.pause();
    this.enemyTimer.remove();
    this.collectibleTimer.remove();

    // Mostrar mensaje de game over
    const gameOverText = this.add.text(400, 300, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);

    this.add.text(400, 350, `Puntuación Final: ${this.score}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 400, 'Recarga la página para jugar de nuevo', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);
  }

  update() {
    if (this.lives <= 0) return;

    // Movimiento del jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }

    // Disparar
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shoot();
    }

    // Limpiar balas fuera de pantalla
    this.bullets.children.entries.forEach(bullet => {
      if (bullet.y < 0) {
        bullet.destroy();
      }
    });
  }
}

export default CollisionScene;