import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class SpaceShooterScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SpaceShooterScene' });
    
    // Game objects
    this.player = null;
    this.enemies = null;
    this.bullets = null;
    this.asteroids = null;
    this.particles = null;
    
    // Controls
    this.cursors = null;
    this.spaceKey = null;
    this.wasd = null;
    
    // Game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.canShoot = true;
    this.shootCooldown = 200;
    
    // Spawn timers
    this.enemySpawnTimer = 0;
    this.asteroidSpawnTimer = 0;
    
    // UI elements
    this.scoreText = null;
    this.livesText = null;
    this.levelText = null;
    this.gameOverText = null;
    
    // Sounds
    this.shootSound = null;
    this.explosionSound = null;
    this.backgroundMusic = null;
    
    // Game settings
    this.playerSpeed = 300;
    this.bulletSpeed = 500;
    this.enemySpeed = 100;
    this.asteroidSpeed = 80;
  }

  preload() {
    // Load assets
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
    
    // Initialize audio with safe fallbacks
    this.initAudio();
  }

  initAudio() {
    // Create safe audio objects that won't cause errors
    try {
      this.shootSound = { 
        play: () => {}, 
        setVolume: () => {},
        stop: () => {} 
      };
      this.explosionSound = { 
        play: () => {}, 
        setVolume: () => {},
        stop: () => {} 
      };
      this.backgroundMusic = { 
        play: () => {}, 
        stop: () => {},
        setVolume: () => {},
        setLoop: () => {} 
      };
      
      console.log('Audio initialized with safe fallbacks');
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  create() {
    // Create starfield background
    this.add.image(400, 300, 'starfield');
    
    // Create player
    this.player = this.physics.add.sprite(400, 500, 'detailedPlayer');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);
    
    // Create groups
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 20
    });
    
    this.enemies = this.physics.add.group();
    this.asteroids = this.physics.add.group();
    
    // Create particle system for explosions
    this.particles = this.add.particles(0, 0, 'advancedParticle', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      lifespan: 600,
      blendMode: 'ADD'
    });
    this.particles.stop();
    
    // Setup physics
    this.setupCollisions();
    
    // Setup controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    // Create UI
    this.createUI();
    
    // Start background music
    if (this.backgroundMusic) {
      this.backgroundMusic.play();
    }
    
    // Initialize spawn timers
    this.resetSpawnTimers();
  }

  setupCollisions() {
    // Player bullets vs enemies
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      this.hitEnemy(bullet, enemy);
    });
    
    // Player bullets vs asteroids
    this.physics.add.overlap(this.bullets, this.asteroids, (bullet, asteroid) => {
      this.hitAsteroid(bullet, asteroid);
    });
    
    // Player vs enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.playerHit(enemy);
    });
    
    // Player vs asteroids
    this.physics.add.overlap(this.player, this.asteroids, (player, asteroid) => {
      this.playerHit(asteroid);
    });
  }

  createUI() {
    // Create UI background
    const uiBackground = this.add.graphics();
    uiBackground.fillStyle(0x000000, 0.7);
    uiBackground.fillRect(0, 0, 800, 50);
    
    // Score
    this.scoreText = this.add.text(20, 15, `Puntuación: ${this.score}`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });
    
    // Lives
    this.livesText = this.add.text(250, 15, `Vidas: ${this.lives}`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    });
    
    // Level
    this.levelText = this.add.text(400, 15, `Nivel: ${this.level}`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    });
    
    // Instructions
    this.add.text(580, 15, 'WASD/Flechas: Mover | Espacio: Disparar', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    });
  }

  update(time, delta) {
    if (this.gameOver) return;
    
    // Player movement
    this.handlePlayerMovement();
    
    // Shooting
    this.handleShooting();
    
    // Spawn enemies and asteroids
    this.handleSpawning(time);
    
    // Clean up off-screen objects
    this.cleanupObjects();
    
    // Update UI
    this.updateUI();
    
    // Check level progression
    this.checkLevelProgression();
  }

  handlePlayerMovement() {
    let velocityX = 0;
    let velocityY = 0;
    
    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -this.playerSpeed;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = this.playerSpeed;
    }
    
    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -this.playerSpeed;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = this.playerSpeed;
    }
    
    this.player.setVelocity(velocityX, velocityY);
  }

  handleShooting() {
    if (this.spaceKey.isDown && this.canShoot) {
      this.shootBullet();
      this.canShoot = false;
      
      this.time.delayedCall(this.shootCooldown, () => {
        this.canShoot = true;
      });
    }
  }

  shootBullet() {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setPosition(this.player.x, this.player.y - 20);
      bullet.setVelocity(0, -this.bulletSpeed);
      bullet.setScale(2);
      
      // Play shoot sound
      if (this.shootSound) {
        this.shootSound.play();
      }
    }
  }

  handleSpawning(time) {
    // Spawn enemies
    if (time > this.enemySpawnTimer) {
      this.spawnEnemy();
      this.enemySpawnTimer = time + Phaser.Math.Between(1000, 2000) / this.level;
    }
    
    // Spawn asteroids
    if (time > this.asteroidSpawnTimer) {
      this.spawnAsteroid();
      this.asteroidSpawnTimer = time + Phaser.Math.Between(2000, 4000);
    }
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(50, 750);
    const enemy = this.enemies.create(x, -50, 'enemy');
    enemy.setVelocity(
      Phaser.Math.Between(-50, 50), 
      this.enemySpeed + (this.level * 20)
    );
    enemy.setScale(1.5);
    enemy.setTint(Phaser.Math.Between(0xff0000, 0xff9999));
  }

  spawnAsteroid() {
    const x = Phaser.Math.Between(50, 750);
    const asteroid = this.asteroids.create(x, -50, 'asteroid');
    asteroid.setVelocity(
      Phaser.Math.Between(-30, 30), 
      this.asteroidSpeed + (this.level * 10)
    );
    asteroid.setScale(Phaser.Math.FloatBetween(0.8, 1.5));
    asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));
    asteroid.setTint(Phaser.Math.Between(0x8B4513, 0xD2691E));
  }

  hitEnemy(bullet, enemy) {
    // Create explosion effect
    this.createExplosion(enemy.x, enemy.y, 0xff0000);
    
    // Remove objects
    bullet.setActive(false);
    bullet.setVisible(false);
    enemy.destroy();
    
    // Update score
    this.score += 100 * this.level;
    
    // Emit score update event (for external UI)
    this.game.events.emit('score-update', this.score);
    
    // Play explosion sound
    if (this.explosionSound) {
      this.explosionSound.play();
    }
  }

  hitAsteroid(bullet, asteroid) {
    // Create explosion effect
    this.createExplosion(asteroid.x, asteroid.y, 0x8B4513);
    
    // Remove objects
    bullet.setActive(false);
    bullet.setVisible(false);
    asteroid.destroy();
    
    // Update score
    this.score += 50 * this.level;
    
    // Emit score update event (for external UI)
    this.game.events.emit('score-update', this.score);
    
    // Play explosion sound
    if (this.explosionSound) {
      this.explosionSound.play();
    }
  }

  playerHit(enemy) {
    // Create explosion effect
    this.createExplosion(this.player.x, this.player.y, 0xffffff);
    
    // Remove enemy
    enemy.destroy();
    
    // Reduce lives
    this.lives--;
    
    // Emit lives update event (for external UI)
    this.game.events.emit('lives-update', this.lives);
    
    // Player invincibility
    this.player.setTint(0xff0000);
    this.time.delayedCall(1000, () => {
      this.player.clearTint();
    });
    
    // Check game over
    if (this.lives <= 0) {
      this.gameOver = true;
      this.endGame();
    }
    
    // Play explosion sound
    if (this.explosionSound) {
      this.explosionSound.play();
    }
  }

  createExplosion(x, y, color) {
    this.particles.setTint(color);
    this.particles.explode(15, x, y);
  }

  cleanupObjects() {
    // Clean up bullets
    this.bullets.children.entries.forEach(bullet => {
      if (bullet.y < -50) {
        bullet.setActive(false);
        bullet.setVisible(false);
      }
    });
    
    // Clean up enemies
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.y > 650) {
        enemy.destroy();
      }
    });
    
    // Clean up asteroids
    this.asteroids.children.entries.forEach(asteroid => {
      if (asteroid.y > 650) {
        asteroid.destroy();
      }
    });
  }

  updateUI() {
    this.scoreText.setText(`Puntuación: ${this.score}`);
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.levelText.setText(`Nivel: ${this.level}`);
  }

  checkLevelProgression() {
    const newLevel = Math.floor(this.score / 1000) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.lives++; // Bonus life each level
      
      // Emit level update event (for external UI)
      this.game.events.emit('level-update', this.level);
      this.game.events.emit('lives-update', this.lives);
      
      // Show level up message
      const levelUpText = this.add.text(400, 300, `¡NIVEL ${this.level}!`, {
        fontSize: '48px',
        fontFamily: 'Arial',
        fill: '#00ff00'
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: levelUpText,
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        duration: 2000,
        ease: 'Power2',
        onComplete: () => levelUpText.destroy()
      });
    }
  }

  resetSpawnTimers() {
    this.enemySpawnTimer = this.time.now + 2000;
    this.asteroidSpawnTimer = this.time.now + 3000;
  }

  endGame() {
    // Stop background music
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
    
    // Create game over screen
    const gameOverBg = this.add.graphics();
    gameOverBg.fillStyle(0x000000, 0.8);
    gameOverBg.fillRect(0, 0, 800, 600);
    
    this.gameOverText = this.add.text(400, 250, '¡JUEGO TERMINADO!', {
      fontSize: '48px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);
    
    this.add.text(400, 320, `Puntuación Final: ${this.score}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(400, 360, `Nivel Alcanzado: ${this.level}`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    this.add.text(400, 420, 'Presiona R para reiniciar', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#00ff00'
    }).setOrigin(0.5);
    
    // Setup restart
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.rKey.on('down', () => {
      this.restartGame();
    });
  }

  restartGame() {
    // Reset game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.canShoot = true;
    
    // Clear all objects
    this.bullets.clear(true, true);
    this.enemies.clear(true, true);
    this.asteroids.clear(true, true);
    
    // Reset player position
    this.player.setPosition(400, 500);
    this.player.clearTint();
    
    // Reset timers
    this.resetSpawnTimers();
    
    // Restart background music
    if (this.backgroundMusic) {
      this.backgroundMusic.play();
    }
    
    // Restart scene
    this.scene.restart();
  }
}

export default SpaceShooterScene;