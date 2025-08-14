import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';

class AdvancedPhysicsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AdvancedPhysicsScene' });
    this.physicsObjects = [];
    this.mouseConstraint = null;
    this.gravityEnabled = true;
  }

  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAdvancedAssets();
  }

  create() {
    // Verificar si Matter.js está disponible
    if (!this.matter || !this.matter.world) {
      console.error('Matter.js physics not available. Falling back to basic demo.');
      this.createFallbackDemo();
      return;
    }

    try {
      // Configurar Matter.js physics
      this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
      this.matter.world.engine.world.gravity.y = 0.8;

      // Fondo
      this.add.image(400, 300, 'starfield');

      // Título
      this.add.text(400, 50, 'Demo: Físicas Avanzadas (Matter.js)', {
        fontSize: '24px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      // Crear objetos físicos
      this.createPhysicsObjects();
      
      // Crear plataformas estáticas
      this.createPlatforms();
      
      // Configurar interacción con mouse
      this.setupMouseInteraction();
      
      // Crear controles
      this.createControls();

      // Instrucciones
      this.add.text(400, 570, 'Arrastra objetos con el mouse • Usa los controles para cambiar la física', {
        fontSize: '14px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      // Mostrar información de físicas
      this.physicsInfo = this.add.text(20, 20, '', {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      });

      this.updatePhysicsInfo();
    } catch (error) {
      console.error('Error creating Matter.js demo:', error);
      this.createFallbackDemo();
    }
  }

  createFallbackDemo() {
    // Demo alternativo cuando Matter.js no está disponible
    this.add.image(400, 300, 'starfield');
    
    this.add.text(400, 50, 'Demo: Físicas Avanzadas (Simulación)', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 300, 'Demo de físicas avanzadas\n(Matter.js no disponible)', {
      fontSize: '18px',
      fontFamily: 'Arial',
      fill: '#ff6666',
      align: 'center'
    }).setOrigin(0.5);

    // Crear una simulación básica con sprites simples
    this.createBasicPhysicsSimulation();
  }

  createBasicPhysicsSimulation() {
    // Simulación básica con sprites que caen
    this.simulatedObjects = [];
    
    for (let i = 0; i < 5; i++) {
      const obj = this.add.image(150 + i * 100, 100, 'bullet');
      obj.setScale(3);
      obj.setTint(Phaser.Math.Between(0x0000ff, 0x00ffff));
      this.simulatedObjects.push({
        sprite: obj,
        velocityY: 0,
        bounceY: 0.8
      });
    }

    this.add.text(400, 450, 'Simulación básica de físicas - los objetos caen por gravedad', {
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);
  }

  createPhysicsObjects() {
    // Crear diferentes tipos de objetos físicos

    // Pelotas que rebotan
    for (let i = 0; i < 5; i++) {
      const x = 150 + i * 100;
      const y = 100;
      const ball = this.matter.add.image(x, y, 'bullet', null, {
        shape: 'circle',
        restitution: 0.9,
        friction: 0.01,
        frictionAir: 0.01
      });
      ball.setScale(3);
      ball.setTint(Phaser.Math.Between(0x0000ff, 0x00ffff));
      this.physicsObjects.push(ball);
    }

    // Cubos que caen
    for (let i = 0; i < 3; i++) {
      const x = 200 + i * 150;
      const y = 150;
      const box = this.matter.add.image(x, y, 'enemy', null, {
        shape: 'rectangle',
        restitution: 0.3,
        friction: 0.7
      });
      box.setScale(2);
      box.setTint(Phaser.Math.Between(0xff0000, 0xff9999));
      this.physicsObjects.push(box);
    }

    // Objetos triangulares (usando el sprite del jugador)
    for (let i = 0; i < 3; i++) {
      const x = 250 + i * 100;
      const y = 80;
      const triangle = this.matter.add.image(x, y, 'player', null, {
        shape: {
          type: 'polygon',
          sides: 3
        },
        restitution: 0.6,
        friction: 0.3
      });
      triangle.setScale(1.5);
      triangle.setTint(Phaser.Math.Between(0x00ff00, 0x99ff99));
      this.physicsObjects.push(triangle);
    }

    // Crear una cadena de objetos conectados
    this.createChain();
  }

  createChain() {
    const chainObjects = [];
    const chainLength = 6;
    
    for (let i = 0; i < chainLength; i++) {
      const x = 600;
      const y = 150 + i * 30;
      const link = this.matter.add.image(x, y, 'particle', null, {
        shape: 'circle',
        restitution: 0.3,
        friction: 0.1
      });
      link.setScale(4);
      link.setTint(0xcccccc);
      chainObjects.push(link);
      this.physicsObjects.push(link);
    }

    // Conectar los eslabones con constraints
    for (let i = 0; i < chainLength - 1; i++) {
      this.matter.add.constraint(chainObjects[i], chainObjects[i + 1], 30, 0.9);
    }

    // Anclar el primer eslabón
    const anchor = this.matter.add.image(600, 120, 'particle', null, { isStatic: true });
    anchor.setScale(6);
    anchor.setTint(0x666666);
    this.matter.add.constraint(anchor, chainObjects[0], 30, 0.9);
  }

  createPlatforms() {
    // Plataformas estáticas
    const platforms = [
      { x: 200, y: 450, width: 200, height: 20 },
      { x: 600, y: 400, width: 150, height: 20 },
      { x: 100, y: 350, width: 100, height: 20 },
      { x: 700, y: 300, width: 120, height: 20 }
    ];

    platforms.forEach(platform => {
      const rect = this.matter.add.rectangle(platform.x, platform.y, platform.width, platform.height, {
        isStatic: true,
        render: { fillStyle: 0x666666 }
      });
      
      // Crear representación visual
      const graphics = this.add.graphics();
      graphics.fillStyle(0x666666);
      graphics.fillRect(
        platform.x - platform.width / 2, 
        platform.y - platform.height / 2, 
        platform.width, 
        platform.height
      );
    });
  }

  setupMouseInteraction() {
    // Configurar mouse constraint para arrastrar objetos
    this.matter.add.mouseSpring({
      length: 0.01,
      stiffness: 0.1
    });

    // Mostrar línea visual cuando se arrastra
    this.input.on('pointerdown', (pointer) => {
      const bodies = this.matter.world.localWorld.bodies;
      const mousePosition = { x: pointer.x, y: pointer.y };
      
      // Encontrar el cuerpo más cercano al mouse
      let closestBody = null;
      let closestDistance = Infinity;
      
      bodies.forEach(body => {
        if (!body.isStatic) {
          const distance = Phaser.Math.Distance.Between(
            mousePosition.x, mousePosition.y,
            body.position.x, body.position.y
          );
          if (distance < closestDistance && distance < 50) { // Radio de detección
            closestDistance = distance;
            closestBody = body;
          }
        }
      });

      if (closestBody) {
        // Crear indicador visual de arrastrar
        this.dragIndicator = this.add.graphics();
        this.draggedBody = closestBody;
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (this.dragIndicator && this.draggedBody) {
        // Dibujar línea desde el objeto hasta el mouse
        this.dragIndicator.clear();
        this.dragIndicator.lineStyle(2, 0xffffff, 0.7);
        this.dragIndicator.lineBetween(
          this.draggedBody.position.x, this.draggedBody.position.y,
          pointer.x, pointer.y
        );
      }
    });

    this.input.on('pointerup', () => {
      if (this.dragIndicator) {
        this.dragIndicator.destroy();
        this.dragIndicator = null;
        this.draggedBody = null;
      }
    });
  }

  createControls() {
    const controlsY = 80;
    
    // Botón de gravedad
    this.gravityButton = this.add.rectangle(100, controlsY, 120, 30, 0x006600, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.toggleGravity())
      .on('pointerover', () => this.gravityButton.setAlpha(0.9))
      .on('pointerout', () => this.gravityButton.setAlpha(0.7));

    this.gravityButtonText = this.add.text(100, controlsY, 'Desactivar Gravedad', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón para agregar objetos
    this.addObjectButton = this.add.rectangle(250, controlsY, 120, 30, 0x660000, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.addRandomObject())
      .on('pointerover', () => this.addObjectButton.setAlpha(0.9))
      .on('pointerout', () => this.addObjectButton.setAlpha(0.7));

    this.add.text(250, controlsY, 'Agregar Objeto', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón de explosión
    this.explosionButton = this.add.rectangle(400, controlsY, 120, 30, 0x666600, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.createExplosion())
      .on('pointerover', () => this.explosionButton.setAlpha(0.9))
      .on('pointerout', () => this.explosionButton.setAlpha(0.7));

    this.add.text(400, controlsY, 'Explosión', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón de reset
    this.resetButton = this.add.rectangle(550, controlsY, 120, 30, 0x000066, 0.7)
      .setInteractive()
      .on('pointerdown', () => this.resetScene())
      .on('pointerover', () => this.resetButton.setAlpha(0.9))
      .on('pointerout', () => this.resetButton.setAlpha(0.7));

    this.add.text(550, controlsY, 'Reiniciar', {
      fontSize: '10px',
      fontFamily: 'Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  toggleGravity() {
    this.gravityEnabled = !this.gravityEnabled;
    this.matter.world.engine.world.gravity.y = this.gravityEnabled ? 0.8 : 0;
    
    this.gravityButtonText.setText(
      this.gravityEnabled ? 'Desactivar Gravedad' : 'Activar Gravedad'
    );
    
    this.updatePhysicsInfo();
  }

  addRandomObject() {
    const x = Phaser.Math.Between(100, 700);
    const y = 50;
    const objType = Phaser.Math.Between(0, 2);
    let newObject;

    switch (objType) {
      case 0: // Pelota
        newObject = this.matter.add.image(x, y, 'bullet', null, {
          shape: 'circle',
          restitution: 0.9,
          friction: 0.01
        });
        newObject.setScale(3);
        newObject.setTint(Phaser.Math.Between(0x0000ff, 0x00ffff));
        break;
      case 1: // Cubo
        newObject = this.matter.add.image(x, y, 'enemy', null, {
          shape: 'rectangle',
          restitution: 0.3,
          friction: 0.7
        });
        newObject.setScale(2);
        newObject.setTint(Phaser.Math.Between(0xff0000, 0xff9999));
        break;
      case 2: // Triángulo
        newObject = this.matter.add.image(x, y, 'player', null, {
          shape: { type: 'polygon', sides: 3 },
          restitution: 0.6,
          friction: 0.3
        });
        newObject.setScale(1.5);
        newObject.setTint(Phaser.Math.Between(0x00ff00, 0x99ff99));
        break;
    }

    this.physicsObjects.push(newObject);
    this.updatePhysicsInfo();
  }

  createExplosion() {
    const centerX = 400;
    const centerY = 300;
    const explosionForce = 0.02;

    // Aplicar fuerza a todos los objetos físicos
    this.physicsObjects.forEach(obj => {
      if (obj.body && !obj.body.isStatic) {
        const distance = Phaser.Math.Distance.Between(
          centerX, centerY,
          obj.body.position.x, obj.body.position.y
        );
        
        if (distance < 200) {
          const angle = Phaser.Math.Angle.Between(
            centerX, centerY,
            obj.body.position.x, obj.body.position.y
          );
          
          const force = explosionForce * (200 - distance) / 200;
          const forceX = Math.cos(angle) * force;
          const forceY = Math.sin(angle) * force;
          
          this.matter.applyForce(obj, { x: forceX, y: forceY });
        }
      }
    });

    // Efecto visual de explosión
    const explosion = this.add.graphics();
    explosion.fillStyle(0xffff00, 0.8);
    explosion.fillCircle(centerX, centerY, 50);

    this.tweens.add({
      targets: explosion,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => explosion.destroy()
    });

    // Shake de cámara
    this.cameras.main.shake(300, 0.02);
  }

  resetScene() {
    // Eliminar todos los objetos físicos dinámicos
    this.physicsObjects.forEach(obj => {
      if (obj.body && !obj.body.isStatic) {
        obj.destroy();
      }
    });
    
    this.physicsObjects = [];
    
    // Recrear objetos
    this.createPhysicsObjects();
    this.updatePhysicsInfo();
  }

  updatePhysicsInfo() {
    const objectCount = this.physicsObjects.filter(obj => !obj.body?.isStatic).length;
    const gravityStatus = this.gravityEnabled ? 'Activada' : 'Desactivada';
    
    this.physicsInfo.setText([
      `Objetos físicos: ${objectCount}`,
      `Gravedad: ${gravityStatus}`,
      `Motor: Matter.js`,
      `FPS: ${Math.round(this.game.loop.actualFps)}`
    ]);
  }

  update() {
    // Si tenemos Matter.js disponible
    if (this.matter && this.matter.world && this.physicsInfo) {
      this.updatePhysicsInfo();
      
      // Limpiar objetos que hayan caído muy abajo (optimización)
      this.physicsObjects = this.physicsObjects.filter(obj => {
        if (obj.body && obj.body.position.y > 700) {
          obj.destroy();
          return false;
        }
        return true;
      });
    } 
    // Si estamos usando simulación básica
    else if (this.simulatedObjects) {
      this.updateBasicSimulation();
    }
  }

  updateBasicSimulation() {
    // Actualizar simulación básica de física
    this.simulatedObjects.forEach(obj => {
      // Aplicar gravedad
      obj.velocityY += 0.5;
      
      // Actualizar posición
      obj.sprite.y += obj.velocityY;
      
      // Detectar colisión con el suelo
      if (obj.sprite.y > 500) {
        obj.sprite.y = 500;
        obj.velocityY *= -obj.bounceY;
        
        // Reducir velocidad gradualmente
        if (Math.abs(obj.velocityY) < 1) {
          obj.velocityY = 0;
        }
      }
      
      // Mantener objetos en pantalla horizontalmente
      if (obj.sprite.x < 0 || obj.sprite.x > 800) {
        obj.sprite.x = Phaser.Math.Clamp(obj.sprite.x, 0, 800);
      }
    });
  }
}

export default AdvancedPhysicsScene;