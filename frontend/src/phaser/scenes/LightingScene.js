import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class LightingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LightingScene' });
    this.lights = [];
    this.lightingEnabled = true;
    this.ambientLight = 0.2;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Habilitar sistema de iluminación
    this.lights.enable();
    this.lights.setAmbientColor(0x404040);

    // Fondo oscuro para mostrar mejor los efectos de luz
    this.add.image(400, 300, 'starfield').setAlpha(0.3);

    // Título
    this.add.text(400, 30, 'Demo: Sistema de Iluminación', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear objetos que serán iluminados
    this.createLitObjects();
    
    // Crear diferentes tipos de luces
    this.createStaticLights();
    this.createDynamicLights();
    this.createInteractiveLights();

    // Controles de iluminación
    this.setupLightingControls();

    // Configurar interacción
    this.setupInteraction();

    // Instrucciones
    this.add.text(400, 560, 'Mueve el mouse para controlar luz | Click para crear luces | Teclas 1-4 para efectos', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createLitObjects() {
    // Crear objetos que recibirán iluminación
    
    // Plataformas iluminadas
    for (let i = 0; i < 4; i++) {
      const platform = this.add.rectangle(150 + i * 150, 450, 100, 20, 0x666666);
      platform.setPipeline('Light2D'); // Habilitar iluminación en este objeto
      platform.setStrokeStyle(2, 0x888888);
    }

    // Círculos con diferentes materiales
    const materials = [
      { color: 0xff4444, pos: { x: 200, y: 200 } },
      { color: 0x44ff44, pos: { x: 400, y: 200 } },
      { color: 0x4444ff, pos: { x: 600, y: 200 } },
    ];

    materials.forEach((mat, index) => {
      const circle = this.add.circle(mat.pos.x, mat.pos.y, 40, mat.color);
      circle.setPipeline('Light2D');
      circle.setStrokeStyle(3, 0xffffff);
      
      // Etiquetas
      this.add.text(mat.pos.x, mat.pos.y + 70, `Material ${index + 1}`, {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#cccccc'
      }).setOrigin(0.5);
    });

    // Crear sprites con normales para iluminación avanzada
    this.createNormalMappedSprites();
  }

  createNormalMappedSprites() {
    // Simular sprites con normal mapping usando gráficos
    for (let i = 0; i < 3; i++) {
      const x = 250 + i * 100;
      const y = 350;

      // Sprite base
      const sprite = this.add.graphics();
      sprite.fillGradientStyle(0x666666, 0x666666, 0x333333, 0x333333);
      sprite.fillRect(-25, -25, 50, 50);
      sprite.x = x;
      sprite.y = y;
      sprite.setPipeline('Light2D');

      // Simular efecto de normal mapping con efectos adicionales
      const highlight = this.add.graphics();
      highlight.fillStyle(0xffffff, 0.3);
      highlight.fillEllipse(0, 0, 20, 20);
      highlight.x = x - 5;
      highlight.y = y - 5;
      highlight.setPipeline('Light2D');
    }
  }

  createStaticLights() {
    // Luz principal estática
    const mainLight = this.lights.addLight(400, 100, 200)
      .setColor(0xffffff)
      .setIntensity(1.0);

    this.lights.push(mainLight);

    // Luces de colores en las esquinas
    const cornerLights = [
      { x: 100, y: 100, color: 0xff0000, intensity: 0.8 },
      { x: 700, y: 100, color: 0x00ff00, intensity: 0.8 },
      { x: 100, y: 500, color: 0x0000ff, intensity: 0.8 },
      { x: 700, y: 500, color: 0xffff00, intensity: 0.8 }
    ];

    cornerLights.forEach(lightConfig => {
      const light = this.lights.addLight(lightConfig.x, lightConfig.y, 150)
        .setColor(lightConfig.color)
        .setIntensity(lightConfig.intensity);
      
      this.lights.push(light);
      
      // Indicador visual de la luz
      this.add.circle(lightConfig.x, lightConfig.y, 5, lightConfig.color, 0.8);
    });
  }

  createDynamicLights() {
    // Luz que se mueve en círculo
    this.orbitingLight = this.lights.addLight(400, 300, 120)
      .setColor(0xff00ff)
      .setIntensity(1.2);

    // Animación orbital
    this.orbitAngle = 0;
    this.orbitRadius = 80;
    this.orbitCenter = { x: 400, y: 300 };

    // Luz pulsante
    this.pulsingLight = this.lights.addLight(600, 350, 100)
      .setColor(0x00ffff)
      .setIntensity(0.5);

    // Animación de pulso
    this.tweens.add({
      targets: this.pulsingLight,
      intensity: 1.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Luz que sigue el patrón sinusoidal
    this.waveLight = this.lights.addLight(200, 400, 80)
      .setColor(0xffa500)
      .setIntensity(0.8);

    this.waveTime = 0;

    this.lights.push(this.orbitingLight, this.pulsingLight, this.waveLight);
  }

  createInteractiveLights() {
    // Luz que sigue el mouse
    this.mouseLight = this.lights.addLight(0, 0, 150)
      .setColor(0xffffff)
      .setIntensity(1.0);

    this.lights.push(this.mouseLight);

    // Configurar seguimiento del mouse
    this.input.on('pointermove', (pointer) => {
      this.mouseLight.x = pointer.x;
      this.mouseLight.y = pointer.y;
    });

    // Crear luces al hacer click
    this.input.on('pointerdown', (pointer) => {
      this.createClickLight(pointer.x, pointer.y);
    });
  }

  createClickLight(x, y) {
    // Crear luz temporal en la posición del click
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const clickLight = this.lights.addLight(x, y, 100)
      .setColor(randomColor)
      .setIntensity(1.5);

    // Efecto de aparición
    this.tweens.add({
      targets: clickLight,
      intensity: 0,
      radius: 200,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => {
        this.lights.removeLight(clickLight);
      }
    });

    // Efecto visual de creación
    this.createLightCreationEffect(x, y, randomColor);
  }

  createLightCreationEffect(x, y, color) {
    // Crear efecto visual cuando se crea una luz
    const flash = this.add.circle(x, y, 10, color, 0.8);
    
    this.tweens.add({
      targets: flash,
      scaleX: 5,
      scaleY: 5,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => flash.destroy()
    });

    // Partículas de luz
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 3, color);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50;

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  setupLightingControls() {
    // Panel de controles
    const controlPanel = this.add.rectangle(100, 120, 150, 200, 0x000000, 0.8);
    controlPanel.setStrokeStyle(2, 0x333333);

    this.add.text(100, 40, 'Controles', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón on/off iluminación
    this.lightingButton = this.add.rectangle(100, 70, 120, 25, 0x006600);
    this.lightingButton.setInteractive();
    this.lightingButtonText = this.add.text(100, 70, 'Luces: ON', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.lightingButton.on('pointerdown', this.toggleLighting, this);

    // Control de luz ambiente
    this.add.text(100, 100, 'Luz Ambiente:', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.createAmbientSlider();

    // Botones de efectos especiales
    const effectButtons = [
      { name: '1: Fogata', y: 150, effect: () => this.createFireEffect() },
      { name: '2: Rayo', y: 175, effect: () => this.createLightningEffect() },
      { name: '3: Disco', y: 200, effect: () => this.createDiscoEffect() },
      { name: '4: Aurora', y: 225, effect: () => this.createAuroraEffect() }
    ];

    effectButtons.forEach(btn => {
      const button = this.add.rectangle(100, btn.y, 120, 20, 0x444444);
      button.setInteractive();
      button.on('pointerdown', btn.effect);
      
      this.add.text(100, btn.y, btn.name, {
        fontSize: '9px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerover', () => button.setFillStyle(0x666666));
      button.on('pointerout', () => button.setFillStyle(0x444444));
    });

    // Configurar teclas
    this.key1 = this.input.keyboard.addKey('ONE');
    this.key2 = this.input.keyboard.addKey('TWO');
    this.key3 = this.input.keyboard.addKey('THREE');
    this.key4 = this.input.keyboard.addKey('FOUR');
  }

  createAmbientSlider() {
    // Crear control deslizante para luz ambiente
    const sliderBg = this.add.rectangle(100, 120, 100, 6, 0x333333);
    const sliderFill = this.add.rectangle(70, 120, 20, 6, 0x666666);
    const sliderHandle = this.add.circle(80, 120, 6, 0xffffff);

    sliderHandle.setInteractive();
    this.input.setDraggable(sliderHandle);

    sliderHandle.on('drag', (pointer, dragX) => {
      const minX = 50;
      const maxX = 150;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      
      sliderHandle.x = clampedX;
      sliderFill.width = (clampedX - minX);
      sliderFill.x = minX + sliderFill.width / 2;
      
      this.ambientLight = (clampedX - minX) / 100;
      this.lights.setAmbientColor(Math.floor(this.ambientLight * 255) * 0x010101);
    });
  }

  setupInteraction() {
    // Configurar eventos de teclado para efectos especiales
    this.input.keyboard.on('keydown-ONE', this.createFireEffect, this);
    this.input.keyboard.on('keydown-TWO', this.createLightningEffect, this);
    this.input.keyboard.on('keydown-THREE', this.createDiscoEffect, this);
    this.input.keyboard.on('keydown-FOUR', this.createAuroraEffect, this);
  }

  createFireEffect() {
    // Simular efecto de fuego con múltiples luces parpadeantes
    const fireX = 400;
    const fireY = 400;
    
    console.log('🔥 Efecto de fuego activado');

    for (let i = 0; i < 5; i++) {
      const fireLight = this.lights.addLight(
        fireX + (Math.random() - 0.5) * 20,
        fireY + (Math.random() - 0.5) * 20,
        60 + Math.random() * 40
      ).setColor(0xff4400).setIntensity(0.8);

      // Animación de parpadeo
      this.tweens.add({
        targets: fireLight,
        intensity: 0.2,
        duration: 100 + Math.random() * 200,
        yoyo: true,
        repeat: 10,
        ease: 'Power1',
        onComplete: () => {
          this.lights.removeLight(fireLight);
        }
      });
    }
  }

  createLightningEffect() {
    // Efecto de rayo con luz intensa y breve
    console.log('⚡ Efecto de rayo activado');

    const lightningLight = this.lights.addLight(400, 300, 400)
      .setColor(0xaaaaff)
      .setIntensity(3.0);

    // Flash rápido
    this.tweens.add({
      targets: lightningLight,
      intensity: 0,
      duration: 200,
      ease: 'Power4',
      onComplete: () => {
        this.lights.removeLight(lightningLight);
      }
    });

    // Efecto visual de rayo
    const lightning = this.add.graphics();
    lightning.lineStyle(3, 0xffffff);
    lightning.lineBetween(Math.random() * 800, 0, Math.random() * 800, 600);
    
    this.tweens.add({
      targets: lightning,
      alpha: 0,
      duration: 300,
      onComplete: () => lightning.destroy()
    });
  }

  createDiscoEffect() {
    // Efecto de luces de discoteca
    console.log('🕺 Efecto disco activado');

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    
    for (let i = 0; i < 6; i++) {
      const discoLight = this.lights.addLight(
        Math.random() * 800,
        Math.random() * 600,
        80
      ).setColor(colors[i]).setIntensity(1.5);

      // Rotación y cambio de intensidad
      this.tweens.add({
        targets: discoLight,
        intensity: 0.3,
        duration: 300,
        yoyo: true,
        repeat: 8,
        ease: 'Power1',
        onComplete: () => {
          this.lights.removeLight(discoLight);
        }
      });
    }
  }

  createAuroraEffect() {
    // Efecto de aurora boreal
    console.log('🌌 Efecto aurora activado');

    const auroraColors = [0x00ff88, 0x0088ff, 0x8800ff];
    
    for (let i = 0; i < 3; i++) {
      const auroraLight = this.lights.addLight(
        200 + i * 200,
        100,
        150
      ).setColor(auroraColors[i]).setIntensity(0.8);

      // Movimiento ondulante
      this.tweens.add({
        targets: auroraLight,
        y: 200,
        intensity: 0.3,
        duration: 2000 + i * 500,
        yoyo: true,
        repeat: 3,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.lights.removeLight(auroraLight);
        }
      });
    }
  }

  toggleLighting() {
    if (this.lightingEnabled) {
      this.lights.disable();
      this.lightingEnabled = false;
      this.lightingButton.setFillStyle(0x660000);
      this.lightingButtonText.setText('Luces: OFF');
    } else {
      this.lights.enable();
      this.lightingEnabled = true;
      this.lightingButton.setFillStyle(0x006600);
      this.lightingButtonText.setText('Luces: ON');
    }
  }

  update() {
    // Actualizar luz orbital
    this.orbitAngle += 0.02;
    const orbitX = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
    const orbitY = this.orbitCenter.y + Math.sin(this.orbitAngle) * this.orbitRadius;
    this.orbitingLight.setPosition(orbitX, orbitY);

    // Actualizar luz ondulatoria
    this.waveTime += 0.05;
    const waveY = 400 + Math.sin(this.waveTime) * 50;
    this.waveLight.setPosition(200, waveY);

    // Verificar teclas para efectos especiales
    if (Phaser.Input.Keyboard.JustDown(this.key1)) {
      this.createFireEffect();
    }
    if (Phaser.Input.Keyboard.JustDown(this.key2)) {
      this.createLightningEffect();
    }
    if (Phaser.Input.Keyboard.JustDown(this.key3)) {
      this.createDiscoEffect();
    }
    if (Phaser.Input.Keyboard.JustDown(this.key4)) {
      this.createAuroraEffect();
    }
  }
}

export default LightingScene;