import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class AudioScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AudioScene' });
    this.sounds = {};
    this.music = null;
    this.soundButtons = [];
    this.musicPlaying = false;
    this.masterVolume = 0.5;
  }

  preload() {
  this.assetLoader = new AssetLoader(this);
  this.assetLoader.loadAdvancedAssets();

  // Cargar sonidos reales
  this.load.audio('shoot', 'assets/sounds/shoot.mp3');
  this.load.audio('explosion', 'assets/sounds/explosion.mp3');
  this.load.audio('powerup', 'assets/sounds/powerup.mp3');
  // Si tienes un sonido de ambiente real, ponlo aquí. Si no, usa shoot como placeholder.
  this.load.audio('ambient', 'assets/sounds/shoot.mp3');
  this.load.audio('bgMusic', 'assets/music/space-theme.mp3');
  }

  create() {
    // Fondo y dimensiones dinámicas
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;
    this.add.image(w / 2, h / 2, 'starfield').setDisplaySize(w, h);

    // Título
    this.add.text(w / 2, 50, 'Demo: Sistema de Audio', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5, 0);

    // Inicializar sonidos (mock objects con efectos visuales)
    this.initializeSounds();

    // Crear visualizador de audio
    this.createAudioVisualizer();

    // Crear controles de audio
    this.createAudioControls();

    // Información
    this.add.text(w / 2, h * 0.92, 'Haz clic en los botones para reproducir diferentes efectos de sonido', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.96, 'En una implementación real, aquí se cargarían archivos de audio WAV/MP3', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Crear efectos visuales para simular audio
    this.createVisualEffects();
  }

  initializeSounds() {
    // Simular diferentes tipos de sonidos con objetos mock
    this.sounds = {
      shoot: { 
        volume: 0.3, 
        color: 0x00ff00, 
        name: 'Disparo',
        frequency: 800 
      },
      explosion: { 
        volume: 0.7, 
        color: 0xff0000, 
        name: 'Explosión',
        frequency: 200 
      },
      powerup: { 
        volume: 0.5, 
        color: 0xffff00, 
        name: 'Power-up',
        frequency: 1200 
      },
      ambient: { 
        volume: 0.2, 
        color: 0x0066ff, 
        name: 'Ambiente',
        frequency: 400 
      }
    };

    this.music = {
      volume: 0.3,
      color: 0xff00ff,
      name: 'Música de fondo',
      isPlaying: false
    };
  }

  createAudioVisualizer() {
    // Crear un visualizador de audio simulado
    this.visualizer = this.add.graphics();
    this.visualizerBars = [];
    
    for (let i = 0; i < 32; i++) {
      this.visualizerBars.push({
        x: 200 + i * 12,
        y: 300,
        height: 0,
        targetHeight: 0
      });
    }

    // Título del visualizador
    this.add.text(400, 260, 'Visualizador de Audio', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createAudioControls() {
    const w = this.sys.game.scale.width;
    const h = this.sys.game.scale.height;
    const buttonY = h * 0.7;
    const buttonSpacing = w / 5;
    let buttonIndex = 0;

    // Botones para cada efecto de sonido
    Object.entries(this.sounds).forEach(([key, sound]) => {
      const x = w * (0.2 + 0.2 * buttonIndex);
      // Botón
      const button = this.add.rectangle(x, buttonY, w * 0.13, h * 0.07, sound.color, 0.7)
        .setInteractive()
        .on('pointerdown', () => this.playSound(key))
        .on('pointerover', () => button.setAlpha(0.9))
        .on('pointerout', () => button.setAlpha(0.7));

      // Texto del botón
      this.add.text(x, buttonY, sound.name, {
        fontSize: Math.round(h * 0.025) + 'px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      buttonIndex++;
    });

    // Botón de música
    this.musicButton = this.add.rectangle(w / 2, buttonY + h * 0.1, w * 0.22, h * 0.07, this.music.color, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.toggleMusic())
      .on('pointerover', () => this.musicButton.setAlpha(0.9))
      .on('pointerout', () => this.musicButton.setAlpha(0.7));

    this.musicButtonText = this.add.text(w / 2, buttonY + h * 0.1, 'Reproducir Música', {
      fontSize: Math.round(h * 0.03) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Control de volumen
    this.add.text(w / 2, buttonY + h * 0.18, 'Volumen Master:', {
      fontSize: Math.round(h * 0.025) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.volumeBar = this.add.rectangle(w / 2, buttonY + h * 0.22, w * 0.3, h * 0.03, 0x333333)
      .setInteractive()
      .on('pointerdown', (pointer) => this.setVolume(pointer));

    this.volumeIndicator = this.add.rectangle(w * 0.35, buttonY + h * 0.22, w * 0.15, h * 0.03, 0x00ff00);

    this.volumeText = this.add.text(w / 2, buttonY + h * 0.26, `${Math.round(this.masterVolume * 100)}%`, {
      fontSize: Math.round(h * 0.02) + 'px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  playSound(soundKey) {
    const sound = this.sounds[soundKey];
    if (!sound) return;

    // Asegura que el sonido está cargado y disponible
    if (!this.sound.get(soundKey)) {
      // Si no está en el cache, lo agrega
      this.sound.add(soundKey);
    }
    // Reproducir sonido real, permitiendo múltiples instancias
    this.sound.play(soundKey, { volume: sound.volume * this.masterVolume, allowMultiple: true });

    // Efecto visual
    this.createSoundEffect(sound);
    // Actualizar visualizador
    this.updateVisualizer(sound.frequency);
  }

  toggleMusic() {
    this.musicPlaying = !this.musicPlaying;
    if (this.musicPlaying) {
      this.musicButtonText.setText('Detener Música');
      this.startMusicVisualization();
      if (!this.bgMusic) {
        this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: this.music.volume * this.masterVolume });
      }
      this.bgMusic.play();
    } else {
      this.musicButtonText.setText('Reproducir Música');
      this.stopMusicVisualization();
      if (this.bgMusic) this.bgMusic.stop();
    }
  }

  createSoundEffect(sound) {
    // Crear efecto visual que representa el sonido
    const effectSprite = this.add.image(400, 200, 'particle');
    effectSprite.setScale(0.05);
    effectSprite.setTint(sound.color);
    effectSprite.setAlpha(0.8);

    this.tweens.add({
      targets: effectSprite,
      scaleX: 20,
      scaleY: 20,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => effectSprite.destroy()
    });

    // Texto del nombre del sonido
    const soundText = this.add.text(400, 200, sound.name, {
      fontSize: '20px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: soundText,
      y: 150,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => soundText.destroy()
    });
  }

  updateVisualizer(frequency) {
    // Simular barras del visualizador basadas en la frecuencia
    this.visualizerBars.forEach((bar, index) => {
      const amplitude = Math.sin((frequency + index * 50) * 0.01) * 50 + 50;
      bar.targetHeight = amplitude * this.masterVolume;
    });
  }

  startMusicVisualization() {
    this.musicVisualizationTimer = this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.musicPlaying) {
          // Crear patrón de visualización continua para música
          const baseFreq = 300 + Math.sin(this.time.now * 0.005) * 200;
          this.updateVisualizer(baseFreq);
        }
      },
      loop: true
    });
  }

  stopMusicVisualization() {
    if (this.musicVisualizationTimer) {
      this.musicVisualizationTimer.remove();
    }
    
    // Resetear visualizador
    this.visualizerBars.forEach(bar => {
      bar.targetHeight = 0;
    });
  }

  setVolume(pointer) {
  const w = this.sys.game.scale.width;
  const barX = w / 2 - (w * 0.3) / 2;
  const localX = pointer.x - barX;
  this.masterVolume = Phaser.Math.Clamp(localX / (w * 0.3), 0, 1);

  // Actualizar indicador visual
  this.volumeIndicator.width = this.masterVolume * (w * 0.3);
  this.volumeText.setText(`${Math.round(this.masterVolume * 100)}%`);

  // Actualizar volumen global
  this.sound.volume = this.masterVolume;
  if (this.bgMusic) this.bgMusic.setVolume(this.music.volume * this.masterVolume);
  }

  createVisualEffects() {
    // Crear ondas de sonido visuales de fondo
    this.soundWaves = this.add.graphics();
  }

  update() {
    // Actualizar visualizador de audio
    this.visualizer.clear();
    this.visualizer.fillStyle(0x00ff00, 0.8);

    this.visualizerBars.forEach(bar => {
      // Interpolar suavemente hacia la altura objetivo
      bar.height = Phaser.Math.Linear(bar.height, bar.targetHeight, 0.1);
      
      if (bar.height > 1) {
        this.visualizer.fillRect(bar.x - 4, bar.y - bar.height, 8, bar.height);
      }
    });

    // Dibujar ondas de sonido si la música está reproduciéndose
    if (this.musicPlaying) {
      this.soundWaves.clear();
      this.soundWaves.lineStyle(2, 0xff00ff, 0.3);
      
      for (let i = 0; i < 3; i++) {
        const radius = 50 + i * 30 + Math.sin(this.time.now * 0.005 + i) * 10;
        this.soundWaves.strokeCircle(400, 200, radius);
      }
    } else {
      this.soundWaves.clear();
    }
  }
}

export default AudioScene;