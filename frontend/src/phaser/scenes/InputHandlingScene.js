import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class InputHandlingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InputHandlingScene' });
    this.clickCount = 0;
    this.keyPresses = 0;
    this.clickEffects = [];
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadBasicAssets();
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 50, 'Demo: Manejo de Entrada', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Configurar input del mouse
    this.input.on('pointerdown', this.handlePointerDown, this);
    this.input.on('pointermove', this.handlePointerMove, this);

    // Configurar teclas específicas
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Eventos de teclado
    this.input.keyboard.on('keydown', this.handleKeyDown, this);

    // Textos informativos
    this.clickText = this.add.text(20, 20, 'Clicks: 0', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    this.keyText = this.add.text(20, 45, 'Teclas presionadas: 0', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    this.positionText = this.add.text(20, 70, 'Mouse: (0, 0)', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    });

    // Instrucciones
    this.add.text(400, 450, 'Haz click en cualquier lugar para crear efectos', {
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 475, 'Presiona cualquier tecla para registrar la entrada', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    this.add.text(400, 500, 'Teclas especiales: ESPACIO, ENTER, ESC', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Área interactiva visual
    const interactiveArea = this.add.rectangle(400, 300, 600, 200, 0x0066cc, 0.1);
    interactiveArea.setStrokeStyle(2, 0x0099ff);

    this.add.text(400, 200, 'Área Interactiva', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#0099ff'
    }).setOrigin(0.5);

    // Mostrar teclas presionadas recientemente
    this.recentKeys = this.add.text(400, 550, 'Última tecla: ninguna', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffff00'
    }).setOrigin(0.5);
  }

  handlePointerDown(pointer) {
    this.clickCount++;
    this.clickText.setText(`Clicks: ${this.clickCount}`);

    // Crear efecto visual en el punto de click
    this.createClickEffect(pointer.x, pointer.y);

    // Crear partícula que se mueve hacia arriba
    const particle = this.add.image(pointer.x, pointer.y, 'particle');
    particle.setScale(3);
    particle.setTint(Phaser.Math.Between(0x0000ff, 0xffffff));

    this.tweens.add({
      targets: particle,
      y: particle.y - 100,
      alpha: 0,
      scale: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        particle.destroy();
      }
    });
  }

  handlePointerMove(pointer) {
    this.positionText.setText(`Mouse: (${Math.round(pointer.x)}, ${Math.round(pointer.y)})`);
  }

  handleKeyDown(event) {
    this.keyPresses++;
    this.keyText.setText(`Teclas presionadas: ${this.keyPresses}`);
    
    const keyName = event.key.toUpperCase();
    this.recentKeys.setText(`Última tecla: ${keyName} (${event.keyCode})`);

    // Efectos especiales para teclas específicas
    switch (event.keyCode) {
      case Phaser.Input.Keyboard.KeyCodes.SPACE:
        this.createSpecialEffect('ESPACIO', 0x00ff00);
        break;
      case Phaser.Input.Keyboard.KeyCodes.ENTER:
        this.createSpecialEffect('ENTER', 0x0000ff);
        break;
      case Phaser.Input.Keyboard.KeyCodes.ESC:
        this.createSpecialEffect('ESC', 0xff0000);
        break;
      default:
        this.createKeyEffect(keyName);
    }
  }

  createClickEffect(x, y) {
    // Crear círculo que se expande
    const circle = this.add.graphics();
    circle.lineStyle(3, 0x00ff00);
    circle.strokeCircle(x, y, 10);

    this.tweens.add({
      targets: circle,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        circle.destroy();
      }
    });
  }

  createSpecialEffect(keyName, color) {
    const text = this.add.text(400, 300, keyName, {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: `#${color.toString(16).padStart(6, '0')}`
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 800,
      ease: 'Back.easeOut',
      onComplete: () => {
        text.destroy();
      }
    });
  }

  createKeyEffect(keyName) {
    const text = this.add.text(
      Phaser.Math.Between(100, 700),
      Phaser.Math.Between(150, 350),
      keyName,
      {
        fontSize: '20px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: text.y - 50,
      alpha: 0,
      duration: 1200,
      ease: 'Power1',
      onComplete: () => {
        text.destroy();
      }
    });
  }

  update() {
    // Verificar teclas que se mantienen presionadas
    if (this.spaceKey.isDown) {
      // Podríamos agregar efectos continuos aquí
    }
  }
}

export default InputHandlingScene;