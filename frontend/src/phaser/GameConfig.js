import Phaser from 'phaser';

// Importar todas las escenas
import BasicSpritesScene from './scenes/BasicSpritesScene';
import BasicMovementScene from './scenes/BasicMovementScene';
import InputHandlingScene from './scenes/InputHandlingScene';
import AnimationScene from './scenes/AnimationScene';
import CollisionScene from './scenes/CollisionScene';
import AudioScene from './scenes/AudioScene';
import ParticleScene from './scenes/ParticleScene';
import AdvancedPhysicsScene from './scenes/AdvancedPhysicsScene';
import LightingScene from './scenes/LightingScene';
import SpaceShooterScene from './scenes/SpaceShooterScene';

// Configuración base para todas las demos
export const DEMO_CONFIG = {
  type: Phaser.CANVAS, // Force Canvas rendering to avoid WebGL conflicts
  width: 800,
  height: 600,
  parent: null, // Se establecerá dinámicamente
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    },
    matter: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  backgroundColor: '#000428',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 400,
      height: 300
    },
    max: {
      width: 1600,
      height: 1200
    }
  },
  render: {
    pixelArt: false,
    antialias: false, // Disable antialiasing for Canvas
    roundPixels: true, // Better performance on Canvas
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'low-power'
  },
  callbacks: {
    postBoot: function(game) {
      console.log(`Game booted with ${game.renderer.type === 1 ? 'Canvas' : 'WebGL'} renderer`);
    }
  }
};

// Configuración específica del juego principal (Space Shooter)
export const GAME_CONFIG = {
  ...DEMO_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: SpaceShooterScene
};

// Mapeo de escenas para las demos
export const SCENE_MAP = {
  'BasicSpritesScene': BasicSpritesScene,
  'BasicMovementScene': BasicMovementScene,
  'InputHandlingScene': InputHandlingScene,
  'AnimationScene': AnimationScene,
  'CollisionScene': CollisionScene,
  'AudioScene': AudioScene,
  'ParticleScene': ParticleScene,
  'AdvancedPhysicsScene': AdvancedPhysicsScene,
  'LightingScene': LightingScene,
  'SpaceShooterScene': SpaceShooterScene
};

// Función para crear configuración de demo específica
export const createDemoConfig = (sceneName, parentElementId) => {
  const SceneClass = SCENE_MAP[sceneName];
  
  if (!SceneClass) {
    console.error(`Scene ${sceneName} not found`);
    return null;
  }

  // Configuración específica según el tipo de demo
  let specificConfig = { ...DEMO_CONFIG };
  
  // Para demos avanzados que usan Matter.js, agregar configuración específica
  if (['AdvancedPhysicsScene', 'ParticleScene', 'LightingScene'].includes(sceneName)) {
    specificConfig.physics = {
      default: 'matter',
      matter: {
        debug: false,
        gravity: { y: 0.8 },
        setBounds: true
      },
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    };
  }
  
  return {
    ...specificConfig,
    parent: parentElementId,
    scene: SceneClass,
    callbacks: {
      ...specificConfig.callbacks,
      postBoot: function(game) {
        console.log(`Demo ${sceneName} loaded successfully with ${game.renderer.type === 1 ? 'Canvas' : 'WebGL'} renderer`);
        
        // Asegurar que Matter.js esté disponible para demos avanzados
        if (['AdvancedPhysicsScene'].includes(sceneName) && game.plugins) {
          const matterPlugin = game.plugins.get('Matter');
          if (matterPlugin) {
            console.log(`Matter.js plugin available for ${sceneName}`);
          } else {
            console.warn(`Matter.js plugin not available for ${sceneName}`);
          }
        }
      }
    }
  };
};

// Assets comunes que todas las escenas pueden usar
export const COMMON_ASSETS = {
  images: {
    player: '/assets/sprites/player.png',
    enemy: '/assets/sprites/enemy.png',
    bullet: '/assets/sprites/bullet.png',
    asteroid: '/assets/sprites/asteroid.png',
    particle: '/assets/effects/particle.png',
    background: '/assets/sprites/space-bg.jpg'
  },
  spritesheets: {
    playerSheet: {
      url: '/assets/sprites/player-sheet.png',
      config: { frameWidth: 32, frameHeight: 32 }
    },
    explosionSheet: {
      url: '/assets/effects/explosion-sheet.png',
      config: { frameWidth: 64, frameHeight: 64 }
    }
  },
  audio: {
    shoot: '/assets/sounds/shoot.wav',
    explosion: '/assets/sounds/explosion.wav',
    bgMusic: '/assets/music/space-theme.mp3',
    powerup: '/assets/sounds/powerup.wav'
  }
};

export default DEMO_CONFIG;