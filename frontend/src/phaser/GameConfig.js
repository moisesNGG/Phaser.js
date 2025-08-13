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
  type: Phaser.AUTO, // Auto-detect WebGL or Canvas
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
    antialias: true,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'low-power'
  },
  callbacks: {
    postBoot: function(game) {
      if (game.canvas) {
        game.canvas.oncontextlost = function(event) {
          console.warn('WebGL context lost, attempting recovery');
          event.preventDefault();
        };
        game.canvas.oncontextrestored = function() {
          console.log('WebGL context restored');
        };
      }
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

  return {
    ...DEMO_CONFIG,
    parent: parentElementId,
    scene: SceneClass
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