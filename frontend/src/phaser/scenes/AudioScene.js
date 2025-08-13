import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class AudioScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AudioScene' });
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.bgMusic = null;
    this.sounds = {};
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadBasicAssets();
    
    // En un entorno real, cargaríamos archivos de audio
    // Por ahora creamos objetos de audio mock para la demostración
    this.createMockAudio();
  }

  createMockAudio() {
    // Simular la carga de archivos de audio
    // En una implementación real, usarías:
    // this.load.audio('bgMusic', 'assets/music/background.mp3');
    
    console.log('Creating mock audio objects for demo...');
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 30, 'Demo: Sistema de Audio', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear controles de audio visuales
    this.createAudioControls();
    
    // Crear efectos sonoros interactivos
    this.createSoundEffects();
    
    // Crear visualizador de audio
    this.createAudioVisualizer();

    // Información sobre el sistema de audio
    this.add.text(400, 500, 'Phaser soporta Web Audio API para efectos avanzados', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 525, 'Haz click en los botones para probar diferentes sonidos', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Inicializar sonidos mock
    this.initializeMockSounds();
  }

  initializeMockSounds() {
    // Crear objetos de sonido mock que simulan la funcionalidad real
    this.sounds = {
      bgMusic: {
        isPlaying: false,
        volume: this.musicVolume,
        play: () => {
          console.log('🎵 Playing background music...');
          this.sounds.bgMusic.isPlaying = true;
          this.updateMusicButton();
          this.startMusicVisualization();
        },
        pause: () => {
          console.log('⏸️ Pausing background music...');
          this.sounds.bgMusic.isPlaying = false;
          this.updateMusicButton();
          this.stopMusicVisualization();
        },
        setVolume: (vol) => {
          this.sounds.bgMusic.volume = vol;
          console.log(`🔊 Music volume: ${vol}`);
        }
      },
      shoot: {
        play: () => {
          console.log('💥 Pew! Laser sound');
          this.createSoundEffect('shoot', 0x00ffff);
        }
      },
      explosion: {
        play: () => {
          console.log('💥 BOOM! Explosion sound');
          this.createSoundEffect('explosion', 0xff4400);
        }
      },
      powerup: {
        play: () => {
          console.log('✨ Power-up collected!');
          this.createSoundEffect('powerup', 0x44ff00);
        }
      }
    };
  }

  createAudioControls() {
    // Panel de control de música
    const musicPanel = this.add.rectangle(200, 150, 300, 200, 0x333333, 0.8);
    musicPanel.setStrokeStyle(2, 0x666666);

    this.add.text(200, 80, 'Control de Música', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón Play/Pause música
    this.musicButton = this.add.rectangle(200, 120, 100, 30, 0x006600);
    this.musicButton.setInteractive();
    this.musicButtonText = this.add.text(200, 120, 'PLAY', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.musicButton.on('pointerdown', () => {
      if (this.sounds.bgMusic.isPlaying) {
        this.sounds.bgMusic.pause();
      } else {
        this.sounds.bgMusic.play();
      }
    });

    // Control de volumen de música
    this.add.text(200, 160, 'Volumen Música:', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.createVolumeSlider(200, 180, (value) => {
      this.musicVolume = value;
      this.sounds.bgMusic.setVolume(value);
    });

    // Control de volumen de efectos
    this.add.text(200, 210, 'Volumen SFX:', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.createVolumeSlider(200, 230, (value) => {
      this.sfxVolume = value;
      console.log(`🔊 SFX volume: ${value}`);
    });
  }

  createVolumeSlider(x, y, callback) {
    // Crear barra de volumen visual
    const sliderBg = this.add.rectangle(x, y, 100, 6, 0x444444);
    const sliderFill = this.add.rectangle(x - 25, y, 50, 6, 0x00aaff);
    const sliderHandle = this.add.circle(x, y, 8, 0xffffff);

    sliderHandle.setInteractive();
    
    this.input.setDraggable(sliderHandle);

    sliderHandle.on('drag', (pointer, dragX) => {
      const minX = x - 50;
      const maxX = x + 50;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      
      sliderHandle.x = clampedX;
      
      const fillWidth = (clampedX - minX);
      sliderFill.width = fillWidth;
      sliderFill.x = minX + fillWidth / 2;
      
      const volume = (clampedX - minX) / 100;
      callback(volume);
    });
  }

  createSoundEffects() {
    // Panel de efectos de sonido
    const sfxPanel = this.add.rectangle(600, 200, 300, 300, 0x333333, 0.8);
    sfxPanel.setStrokeStyle(2, 0x666666);

    this.add.text(600, 80, 'Efectos de Sonido', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botones de efectos de sonido
    const soundButtons = [
      { name: 'Disparo', key: 'shoot', color: 0x0066cc, y: 120 },
      { name: 'Explosión', key: 'explosion', color: 0xcc3300, y: 170 },
      { name: 'Power-up', key: 'powerup', color: 0x00cc66, y: 220 },
    ];

    soundButtons.forEach(btn => {
      const button = this.add.rectangle(600, btn.y, 120, 30, btn.color);
      button.setInteractive();
      
      const buttonText = this.add.text(600, btn.y, btn.name, {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.sounds[btn.key].play();
        
        // Efecto visual del botón
        this.tweens.add({
          targets: button,
          scaleX: 0.9,
          scaleY: 0.9,
          duration: 100,
          yoyo: true,
          ease: 'Power2'
        });
      });

      button.on('pointerover', () => {
        button.setFillStyle(Phaser.Display.Color.GetColor32(
          Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.IntegerToColor(btn.color),
            Phaser.Display.Color.IntegerToColor(0xffffff),
            10,
            2
          )
        ));
      });

      button.on('pointerout', () => {
        button.setFillStyle(btn.color);
      });
    });

    // Instrucciones de audio 3D
    this.add.text(600, 270, 'Audio 3D Espacial:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(600, 290, 'Haz click en cualquier lugar', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Audio espacial - sonidos basados en posición
    this.input.on('pointerdown', (pointer) => {
      this.play3DAudio(pointer.x, pointer.y);
    });
  }

  createAudioVisualizer() {
    // Crear visualizador de frecuencias mock
    this.visualizerBars = [];
    const barCount = 16;
    const barWidth = 300 / barCount;

    for (let i = 0; i < barCount; i++) {
      const bar = this.add.rectangle(
        250 + i * barWidth,
        400,
        barWidth - 2,
        10,
        0x00ff88
      );
      this.visualizerBars.push(bar);
    }

    this.add.text(400, 350, 'Visualizador de Audio', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#00ff88'
    }).setOrigin(0.5);

    this.add.text(400, 450, 'Simula análisis de frecuencias en tiempo real', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#888888'
    }).setOrigin(0.5);
  }

  startMusicVisualization() {
    // Animación del visualizador cuando la música está sonando
    this.musicVisualizerTween = this.time.addEvent({
      delay: 100,
      callback: this.updateVisualizer,
      callbackScope: this,
      loop: true
    });
  }

  stopMusicVisualization() {
    if (this.musicVisualizerTween) {
      this.musicVisualizerTween.remove();
    }
    
    // Resetear barras del visualizador
    this.visualizerBars.forEach(bar => {
      bar.scaleY = 0.1;
    });
  }

  updateVisualizer() {
    // Simular datos de frecuencia
    this.visualizerBars.forEach((bar, index) => {
      const height = Math.random() * 50 + 5;
      const targetScaleY = height / 10;
      
      this.tweens.add({
        targets: bar,
        scaleY: targetScaleY,
        duration: 100,
        ease: 'Power1'
      });
      
      // Cambiar color basado en la intensidad
      const intensity = height / 55;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        { r: 0, g: 255, b: 136 },
        { r: 255, g: 100, b: 0 },
        100,
        Math.floor(intensity * 100)
      );
      
      bar.setFillStyle(Phaser.Display.Color.GetColor32(color));
    });
  }

  updateMusicButton() {
    if (this.sounds.bgMusic.isPlaying) {
      this.musicButton.setFillStyle(0xcc3300);
      this.musicButtonText.setText('PAUSE');
    } else {
      this.musicButton.setFillStyle(0x006600);
      this.musicButtonText.setText('PLAY');
    }
  }

  play3DAudio(x, y) {
    // Simular audio 3D basado en la posición
    const centerX = 400;
    const centerY = 300;
    
    const distance = Phaser.Math.Distance.Between(x, y, centerX, centerY);
    const maxDistance = 300;
    const volume = 1 - Math.min(distance / maxDistance, 1);
    
    // Determinar pan (izquierda/derecha) basado en posición X
    const pan = (x - centerX) / centerX; // -1 (izquierda) a 1 (derecha)
    
    console.log(`🎵 3D Audio - Volume: ${volume.toFixed(2)}, Pan: ${pan.toFixed(2)}`);
    
    // Crear efecto visual para mostrar el audio espacial
    this.createSpatialAudioEffect(x, y, volume);
  }

  createSpatialAudioEffect(x, y, volume) {
    const circle = this.add.circle(x, y, 5, 0x00aaff, 0.8);
    const maxScale = volume * 10;
    
    this.tweens.add({
      targets: circle,
      scaleX: maxScale,
      scaleY: maxScale,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        circle.destroy();
      }
    });

    // Mostrar información del audio 3D
    const infoText = this.add.text(x, y - 30, `Vol: ${(volume * 100).toFixed(0)}%`, {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: infoText,
      y: infoText.y - 20,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        infoText.destroy();
      }
    });
  }

  createSoundEffect(soundType, color) {
    // Crear efecto visual para representar el sonido
    const effectX = Phaser.Math.Between(100, 700);
    const effectY = Phaser.Math.Between(150, 400);
    
    // Ondas de sonido visuales
    for (let i = 0; i < 3; i++) {
      const wave = this.add.graphics();
      wave.lineStyle(2, color, 0.8);
      wave.strokeCircle(effectX, effectY, 10 + i * 5);
      
      this.tweens.add({
        targets: wave,
        scaleX: 4 + i,
        scaleY: 4 + i,
        alpha: 0,
        duration: 600 + i * 200,
        ease: 'Power2',
        onComplete: () => {
          wave.destroy();
        }
      });
    }

    // Partículas de sonido
    for (let i = 0; i < 6; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(color);
      particle.fillCircle(0, 0, 3);
      particle.x = effectX;
      particle.y = effectY;

      const angle = (i / 6) * Math.PI * 2;
      const distance = 30;

      this.tweens.add({
        targets: particle,
        x: effectX + Math.cos(angle) * distance,
        y: effectY + Math.sin(angle) * distance,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy();
        }
      });
    }
  }

  update() {
    // El sistema de audio funciona principalmente a través de eventos
    // Aquí podríamos actualizar efectos de audio continuos si fuera necesario
  }
}

export default AudioScene;