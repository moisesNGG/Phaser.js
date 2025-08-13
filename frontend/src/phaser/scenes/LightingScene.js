import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class LightingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LightingScene' });
    this.lights = [];
    this.lightObjects = [];
    this.ambientLight = 0.2;
    this.player = null;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Habilitar sistema de luces (simulado con gráficos)
    this.createDarkBackground();
    
    // Título
    this.titleText = this.add.text(400, 50, 'Demo: Efectos de Iluminación', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear objetos que serán iluminados
    this.createIlluminatedObjects();
    
    // Crear diferentes tipos de luces
    this.createLights();
    
    // Crear jugador que puede moverse
    this.createPlayer();
    
    // Configurar controles
    this.setupControls();
    
    // Crear interfaz de control
    this.createLightingControls();

    // Instrucciones
    this.add.text(400, 570, 'Mueve con WASD/Flechas • Usa los controles para cambiar la iluminación', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Iniciar sistema de renderizado de luces
    this.setupLightingSystem();
  }

  createDarkBackground() {
    // Crear fondo oscuro
    this.darkLayer = this.add.graphics();
    this.darkLayer.fillStyle(0x000000, 0.9);
    this.darkLayer.fillRect(0, 0, 800, 600);
    
    // Crear capa de luz que se mezclará
    this.lightLayer = this.add.graphics();
    this.lightLayer.setBlendMode(Phaser.BlendModes.ADD);
  }

  createIlluminatedObjects() {
    // Crear objetos que reaccionarán a la luz
    this.illuminatedObjects = [];

    // Paredes y obstáculos
    const walls = [
      { x: 200, y: 200, width: 20, height: 100 },
      { x: 600, y: 300, width: 100, height: 20 },
      { x: 100, y: 400, width: 80, height: 20 },
      { x: 500, y: 150, width: 20, height: 80 }
    ];

    walls.forEach(wall => {
      const wallObject = this.add.rectangle(wall.x, wall.y, wall.width, wall.height, 0x666666);
      this.illuminatedObjects.push(wallObject);
    });

    // Objetos decorativos
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(150, 450);
      const obj = this.add.image(x, y, ['enemy', 'asteroid', 'bullet'][i % 3]);
      obj.setScale(2);
      obj.setTint(0x333333); // Inicialmente oscuros
      this.illuminatedObjects.push(obj);
    }
  }

  createLights() {
    this.lightSources = [];

    // Luz principal estática
    this.addLight(150, 150, 150, 0xffffff, 1.0, 'static');
    
    // Luz de color rojo
    this.addLight(650, 150, 120, 0xff0000, 0.8, 'static');
    
    // Luz azul parpadeante
    this.addLight(150, 450, 100, 0x0066ff, 0.6, 'flicker');
    
    // Luz verde que se mueve
    this.addLight(650, 450, 80, 0x00ff00, 0.7, 'moving');
    
    // Luz que sigue al mouse
    this.mouseLight = this.addLight(400, 300, 100, 0xffff00, 0.5, 'mouse');
  }

  addLight(x, y, radius, color, intensity, type) {
    const light = {
      x: x,
      y: y,
      radius: radius,
      color: color,
      intensity: intensity,
      type: type,
      originalIntensity: intensity,
      angle: 0,
      enabled: true
    };

    this.lightSources.push(light);
    return light;
  }

  createPlayer() {
    this.player = this.add.image(400, 300, 'detailedPlayer');
    this.player.setScale(2);
    this.player.setTint(0x333333); // Inicialmente oscuro
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    // Seguir mouse con luz amarilla
    this.input.on('pointermove', (pointer) => {
      if (this.mouseLight) {
        this.mouseLight.x = pointer.x;
        this.mouseLight.y = pointer.y;
      }
    });
  }

  createLightingControls() {
    const controlsY = 100;
    const buttonWidth = 100;
    const buttonHeight = 25;
    
    // Control de luz ambiente
    this.add.text(50, controlsY - 30, 'Luz Ambiente:', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    this.ambientSlider = this.add.rectangle(50, controlsY, 100, 10, 0x666666)
      .setInteractive()
      .on('pointerdown', (pointer) => this.setAmbientLight(pointer));

    this.ambientIndicator = this.add.rectangle(50 + this.ambientLight * 100, controlsY, 10, 10, 0xffffff);

    // Botones para controlar luces individuales
    const lightButtons = [
      { name: 'Luz Principal', index: 0, x: 200, color: 0xffffff },
      { name: 'Luz Roja', index: 1, x: 310, color: 0xff0000 },
      { name: 'Luz Azul', index: 2, x: 420, color: 0x0066ff },
      { name: 'Luz Verde', index: 3, x: 530, color: 0x00ff00 },
      { name: 'Luz Mouse', index: 4, x: 640, color: 0xffff00 }
    ];

    lightButtons.forEach(btn => {
      const button = this.add.rectangle(btn.x, controlsY, buttonWidth, buttonHeight, btn.color, 0.7)
        .setInteractive()
        .on('pointerdown', () => this.toggleLight(btn.index))
        .on('pointerover', () => button.setAlpha(0.9))
        .on('pointerout', () => button.setAlpha(0.7));

      this.add.text(btn.x, controlsY, btn.name, {
        fontSize: '8px',
        fontFamily: 'Arial',
        fill: '#000000'
      }).setOrigin(0.5);
    });

    // Información de iluminación
    this.lightingInfo = this.add.text(20, 20, '', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });
  }

  setupLightingSystem() {
    // Este método configura el sistema de renderizado de luces simulado
    this.lightingMask = this.add.graphics();
    this.lightingMask.setVisible(false);
  }

  setAmbientLight(pointer) {
    const localX = pointer.x - 50;
    this.ambientLight = Phaser.Math.Clamp(localX / 100, 0, 1);
    this.ambientIndicator.x = 50 + this.ambientLight * 100;
  }

  toggleLight(index) {
    if (this.lightSources[index]) {
      this.lightSources[index].enabled = !this.lightSources[index].enabled;
    }
  }

  updateLights() {
    // Actualizar comportamientos de luces especiales
    this.lightSources.forEach((light, index) => {
      switch (light.type) {
        case 'flicker':
          // Luz parpadeante
          light.intensity = light.originalIntensity * (0.5 + Math.random() * 0.5);
          break;
          
        case 'moving':
          // Luz que se mueve en círculo
          light.angle += 0.02;
          light.x = 650 + Math.cos(light.angle) * 50;
          light.y = 450 + Math.sin(light.angle) * 50;
          break;
      }
    });
  }

  renderLighting() {
    // Limpiar capa de luz
    this.lightLayer.clear();
    
    // Aplicar luz ambiente
    this.lightLayer.fillStyle(0xffffff, this.ambientLight * 0.1);
    this.lightLayer.fillRect(0, 0, 800, 600);
    
    // Renderizar cada fuente de luz
    this.lightSources.forEach(light => {
      if (!light.enabled) return;
      
      // Crear gradiente radial simulado
      const gradient = this.createLightGradient(light);
      this.lightLayer.fillStyle(light.color, light.intensity * 0.3);
      this.lightLayer.fillCircle(light.x, light.y, light.radius);
      
      // Círculo interno más brillante
      this.lightLayer.fillStyle(light.color, light.intensity * 0.6);
      this.lightLayer.fillCircle(light.x, light.y, light.radius * 0.5);
      
      // Núcleo de la luz
      this.lightLayer.fillStyle(0xffffff, light.intensity);
      this.lightLayer.fillCircle(light.x, light.y, light.radius * 0.2);
    });
    
    // Aplicar iluminación a objetos
    this.applyLightingToObjects();
  }

  createLightGradient(light) {
    // Simular gradiente radial (en una implementación real usaríamos shaders)
    return null; // Placeholder para gradiente
  }

  applyLightingToObjects() {
    // Calcular iluminación para cada objeto
    this.illuminatedObjects.forEach(obj => {
      let totalIllumination = this.ambientLight;
      let averageColor = { r: 255, g: 255, b: 255 };
      let lightCount = 0;
      
      this.lightSources.forEach(light => {
        if (!light.enabled) return;
        
        const distance = Phaser.Math.Distance.Between(
          obj.x, obj.y, light.x, light.y
        );
        
        if (distance < light.radius) {
          const lightStrength = (1 - distance / light.radius) * light.intensity;
          totalIllumination += lightStrength;
          lightCount++;
          
          // Mezclar colores de luz
          const r = (light.color >> 16) & 0xff;
          const g = (light.color >> 8) & 0xff;
          const b = light.color & 0xff;
          
          averageColor.r = (averageColor.r + r) / 2;
          averageColor.g = (averageColor.g + g) / 2;
          averageColor.b = (averageColor.b + b) / 2;
        }
      });
      
      // Aplicar iluminación al objeto
      totalIllumination = Math.min(totalIllumination, 1);
      const finalColor = Phaser.Display.Color.GetColor(
        Math.floor(averageColor.r * totalIllumination),
        Math.floor(averageColor.g * totalIllumination),
        Math.floor(averageColor.b * totalIllumination)
      );
      
      obj.setTint(finalColor);
    });
    
    // Aplicar al jugador también
    let playerIllumination = this.ambientLight;
    this.lightSources.forEach(light => {
      if (!light.enabled) return;
      
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, light.x, light.y
      );
      
      if (distance < light.radius) {
        const lightStrength = (1 - distance / light.radius) * light.intensity;
        playerIllumination += lightStrength;
      }
    });
    
    playerIllumination = Math.min(playerIllumination, 1);
    const playerColor = Phaser.Display.Color.GetColor(
      Math.floor(255 * playerIllumination),
      Math.floor(255 * playerIllumination),
      Math.floor(255 * playerIllumination)
    );
    this.player.setTint(playerColor);
  }

  updatePlayer() {
    const speed = 150;
    let moved = false;
    
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.x -= speed * this.game.loop.delta / 1000;
      moved = true;
    }
    if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.x += speed * this.game.loop.delta / 1000;
      moved = true;
    }
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.y -= speed * this.game.loop.delta / 1000;
      moved = true;
    }
    if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.y += speed * this.game.loop.delta / 1000;
      moved = true;
    }
    
    // Mantener jugador en pantalla
    this.player.x = Phaser.Math.Clamp(this.player.x, 20, 780);
    this.player.y = Phaser.Math.Clamp(this.player.y, 20, 580);
  }

  updateLightingInfo() {
    const activeLights = this.lightSources.filter(light => light.enabled).length;
    
    this.lightingInfo.setText([
      `Luces activas: ${activeLights}/${this.lightSources.length}`,
      `Luz ambiente: ${Math.round(this.ambientLight * 100)}%`,
      `Sistema: Lighting simulado`,
      `Objetos iluminados: ${this.illuminatedObjects.length + 1}`
    ]);
  }

  update() {
    this.updatePlayer();
    this.updateLights();
    this.renderLighting();
    this.updateLightingInfo();
  }
}

export default LightingScene;