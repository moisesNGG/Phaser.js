import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class AdvancedPhysicsScene extends Phaser.Scene {
  constructor() {
    super({ 
      key: 'AdvancedPhysicsScene',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0.5 },
          debug: false
        }
      }
    });
    this.physicsObjects = [];
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Configurar mundo físico
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    // Fondo
    this.add.image(400, 300, 'starfield');

    // Título
    this.add.text(400, 30, 'Demo: Físicas Avanzadas (Matter.js)', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Crear diferentes tipos de cuerpos físicos
    this.createBasicBodies();
    this.createCompoundBodies();
    this.createConstraints();
    this.createSensors();

    // Controles de física
    this.setupPhysicsControls();

    // Input interactivo
    this.setupInteractivePhysics();

    // Información
    this.add.text(400, 560, 'Haz click para crear objetos | Arrastra para aplicar fuerzas | Teclas G/Space', {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  createBasicBodies() {
    // Crear diferentes formas con físicas
    
    // Rectángulos que caen
    for (let i = 0; i < 3; i++) {
      const box = this.matter.add.rectangle(200 + i * 100, 100, 40, 40, {
        restitution: 0.8,
        friction: 0.3,
        render: { fillStyle: `#${Math.floor(Math.random()*16777215).toString(16)}` }
      });
      
      // Agregar sprite visual
      const boxSprite = this.add.rectangle(0, 0, 40, 40, 0x66ccff);
      boxSprite.setStrokeStyle(2, 0xffffff);
      this.matter.add.gameObject(boxSprite, box);
      this.physicsObjects.push(boxSprite);
    }

    // Círculos con diferentes propiedades
    for (let i = 0; i < 3; i++) {
      const circle = this.matter.add.circle(500 + i * 60, 100, 20, {
        restitution: 0.9,
        frictionAir: 0.01,
        density: 0.001 + i * 0.001
      });
      
      const circleSprite = this.add.circle(0, 0, 20, 0xff6666);
      circleSprite.setStrokeStyle(2, 0xffffff);
      this.matter.add.gameObject(circleSprite, circle);
      this.physicsObjects.push(circleSprite);
    }

    // Crear plataformas estáticas
    const platforms = [
      { x: 150, y: 450, w: 200, h: 20 },
      { x: 650, y: 400, w: 200, h: 20 },
      { x: 400, y: 350, w: 150, h: 20 }
    ];

    platforms.forEach(platform => {
      const body = this.matter.add.rectangle(platform.x, platform.y, platform.w, platform.h, {
        isStatic: true
      });
      
      const sprite = this.add.rectangle(0, 0, platform.w, platform.h, 0x333333);
      sprite.setStrokeStyle(2, 0x666666);
      this.matter.add.gameObject(sprite, body);
    });
  }

  createCompoundBodies() {
    // Crear un cuerpo compuesto (forma compleja)
    const Bodies = Phaser.Physics.Matter.Matter.Bodies;
    const Body = Phaser.Physics.Matter.Matter.Body;
    
    // Crear una cruz compuesta
    const crossParts = [
      Bodies.rectangle(0, 0, 60, 20), // horizontal
      Bodies.rectangle(0, 0, 20, 60)  // vertical
    ];
    
    const crossBody = Body.create({
      parts: crossParts,
      restitution: 0.7,
      friction: 0.4
    });
    
    this.matter.world.add(crossBody);
    Body.setPosition(crossBody, { x: 100, y: 200 });
    
    // Sprite visual para la cruz
    const crossSprite = this.add.graphics();
    crossSprite.fillStyle(0x00ff99);
    crossSprite.fillRect(-30, -10, 60, 20); // horizontal
    crossSprite.fillRect(-10, -30, 20, 60); // vertical
    
    this.matter.add.gameObject(crossSprite, crossBody);
    this.physicsObjects.push(crossSprite);
  }

  createConstraints() {
    // Crear restricciones y joints
    
    // Péndulo
    const pendulumBob = this.matter.add.circle(200, 250, 15, {
      density: 0.01
    });
    
    const pendulumPin = this.matter.add.circle(200, 150, 5, {
      isStatic: true
    });
    
    const pendulumConstraint = this.matter.add.constraint(pendulumPin, pendulumBob, {
      length: 100,
      stiffness: 1,
      render: { visible: true, lineWidth: 2, strokeStyle: '#ffffff' }
    });

    // Sprites visuales
    const bobSprite = this.add.circle(0, 0, 15, 0xffaa00);
    const pinSprite = this.add.circle(0, 0, 5, 0x666666);
    
    this.matter.add.gameObject(bobSprite, pendulumBob);
    this.matter.add.gameObject(pinSprite, pendulumPin);

    // Crear una cadena de objetos conectados
    this.createChain();
  }

  createChain() {
    // Crear una cadena de círculos conectados
    const chainLength = 5;
    const chainBodies = [];
    const chainSprites = [];

    for (let i = 0; i < chainLength; i++) {
      const body = this.matter.add.circle(600 + i * 30, 150, 10, {
        density: 0.005
      });
      
      const sprite = this.add.circle(0, 0, 10, 0x9966ff);
      sprite.setStrokeStyle(2, 0xffffff);
      
      this.matter.add.gameObject(sprite, body);
      chainBodies.push(body);
      chainSprites.push(sprite);
    }

    // Fijar el primer eslabón
    const anchor = this.matter.add.circle(600, 150, 5, { isStatic: true });
    const anchorSprite = this.add.circle(0, 0, 5, 0x666666);
    this.matter.add.gameObject(anchorSprite, anchor);

    // Conectar la cadena
    this.matter.add.constraint(anchor, chainBodies[0], {
      length: 30,
      stiffness: 0.8
    });

    for (let i = 0; i < chainLength - 1; i++) {
      this.matter.add.constraint(chainBodies[i], chainBodies[i + 1], {
        length: 30,
        stiffness: 0.8
      });
    }
  }

  createSensors() {
    // Crear sensores (áreas que detectan colisiones sin respuesta física)
    const sensor = this.matter.add.rectangle(400, 500, 100, 20, {
      isSensor: true,
      isStatic: true
    });

    const sensorSprite = this.add.rectangle(0, 0, 100, 20, 0xff0000, 0.5);
    sensorSprite.setStrokeStyle(2, 0xff4444);
    this.matter.add.gameObject(sensorSprite, sensor);

    this.add.text(400, 530, 'SENSOR ZONE', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ff0000'
    }).setOrigin(0.5);

    // Detectar cuando algo entra en el sensor
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        if (bodyA === sensor || bodyB === sensor) {
          console.log('¡Objeto detectado en el sensor!');
          this.createSensorEffect(400, 500);
        }
      });
    });
  }

  createSensorEffect(x, y) {
    // Efecto visual cuando el sensor detecta algo
    const effect = this.add.circle(x, y, 50, 0xff0000, 0.3);
    
    this.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => effect.destroy()
    });
  }

  setupPhysicsControls() {
    // Panel de controles de física
    const controlPanel = this.add.rectangle(100, 350, 150, 120, 0x333333, 0.8);
    controlPanel.setStrokeStyle(2, 0x666666);

    this.add.text(100, 300, 'Controles', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón de gravedad
    this.gravityButton = this.add.rectangle(100, 330, 120, 25, 0x006600);
    this.gravityButton.setInteractive();
    this.gravityButtonText = this.add.text(100, 330, 'Gravedad: ON', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.gravityButton.on('pointerdown', this.toggleGravity, this);

    // Botón de reset
    const resetButton = this.add.rectangle(100, 360, 120, 25, 0x666600);
    resetButton.setInteractive();
    resetButton.on('pointerdown', this.resetPhysics, this);

    this.add.text(100, 360, 'Reset Scene', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón de debug
    this.debugButton = this.add.rectangle(100, 390, 120, 25, 0x660066);
    this.debugButton.setInteractive();
    this.debugButton.on('pointerdown', this.toggleDebug, this);

    this.add.text(100, 390, 'Debug: OFF', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Configurar teclas
    this.gKey = this.input.keyboard.addKey('G');
    this.spaceKey = this.input.keyboard.addKey('SPACE');
  }

  setupInteractivePhysics() {
    // Permitir arrastrar objetos
    this.input.setDraggable(this.physicsObjects);

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      // Aplicar fuerza hacia la posición del mouse
      const body = gameObject.body;
      if (body) {
        const force = {
          x: (dragX - body.position.x) * 0.001,
          y: (dragY - body.position.y) * 0.001
        };
        this.matter.applyForce(body, force);
      }
    });

    // Crear objetos al hacer click
    this.input.on('pointerdown', (pointer) => {
      if (pointer.x > 200) { // Evitar crear objetos en el panel de control
        this.createPhysicsObject(pointer.x, pointer.y);
      }
    });
  }

  createPhysicsObject(x, y) {
    // Crear un objeto físico aleatorio en la posición del click
    const objectTypes = ['box', 'circle', 'triangle'];
    const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    
    let body;
    let sprite;

    switch (type) {
      case 'box':
        body = this.matter.add.rectangle(x, y, 30, 30, {
          restitution: 0.7,
          friction: 0.3
        });
        sprite = this.add.rectangle(0, 0, 30, 30, Phaser.Math.Between(0x000000, 0xffffff));
        break;

      case 'circle':
        body = this.matter.add.circle(x, y, 15, {
          restitution: 0.8,
          friction: 0.2
        });
        sprite = this.add.circle(0, 0, 15, Phaser.Math.Between(0x000000, 0xffffff));
        break;

      case 'triangle':
        // Crear triángulo usando polígono
        body = this.matter.add.polygon(x, y, 3, 20, {
          restitution: 0.6,
          friction: 0.4
        });
        sprite = this.add.graphics();
        sprite.fillStyle(Phaser.Math.Between(0x000000, 0xffffff));
        sprite.fillTriangle(-20, 15, 20, 15, 0, -15);
        break;
    }

    sprite.setStrokeStyle(1, 0xffffff);
    this.matter.add.gameObject(sprite, body);
    this.physicsObjects.push(sprite);

    // Auto-eliminar después de un tiempo
    this.time.delayedCall(10000, () => {
      if (sprite && sprite.active) {
        sprite.destroy();
      }
    });
  }

  toggleGravity() {
    const currentGravity = this.matter.world.localWorld.gravity.y;
    
    if (currentGravity > 0) {
      this.matter.world.disableGravity();
      this.gravityButtonText.setText('Gravedad: OFF');
      this.gravityButton.setFillStyle(0x666600);
    } else {
      this.matter.world.setGravity(0, 0.5);
      this.gravityButtonText.setText('Gravedad: ON');
      this.gravityButton.setFillStyle(0x006600);
    }
  }

  resetPhysics() {
    // Limpiar todos los objetos físicos dinámicos
    this.physicsObjects.forEach(obj => {
      if (obj && obj.active) {
        obj.destroy();
      }
    });
    this.physicsObjects = [];

    // Recrear objetos iniciales
    this.createBasicBodies();
  }

  toggleDebug() {
    const currentDebug = this.matter.world.drawDebug;
    
    if (currentDebug) {
      this.matter.world.drawDebug = false;
      this.matter.world.debugGraphic.visible = false;
      this.debugButton.getByName
      this.add.text(100, 390, 'Debug: OFF', {
        fontSize: '10px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
    } else {
      this.matter.world.drawDebug = true;
      this.matter.world.debugGraphic.visible = true;
      this.add.text(100, 390, 'Debug: ON', {
        fontSize: '10px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
    }
  }

  update() {
    // Verificar input de teclado
    if (Phaser.Input.Keyboard.JustDown(this.gKey)) {
      this.toggleGravity();
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.resetPhysics();
    }

    // Limpiar objetos que salen de los límites
    this.physicsObjects = this.physicsObjects.filter(obj => {
      if (obj && obj.active && obj.y > 650) {
        obj.destroy();
        return false;
      }
      return obj && obj.active;
    });
  }
}

export default AdvancedPhysicsScene;