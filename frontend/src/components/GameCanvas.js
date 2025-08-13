import React, { forwardRef, useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Phaser from 'phaser';
import { GAME_CONFIG } from '../phaser/GameConfig';

const GameCanvas = forwardRef(({ isRunning, onToggle }, ref) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameInstance, setGameInstance] = useState(null);
  const [gameReady, setGameReady] = useState(false);
  const gameContainerRef = useRef(null);
  const mountedRef = useRef(true);

  // Cleanup function to properly destroy Phaser game
  const cleanupGame = () => {
    if (gameInstance) {
      try {
        // Remove event listeners
        gameInstance.events.off('score-update');
        gameInstance.events.off('lives-update');
        gameInstance.events.off('level-update');
        
        // Destroy the game instance
        gameInstance.destroy(true, false);
      } catch (error) {
        console.warn('Error destroying game:', error);
      }
      setGameInstance(null);
      setGameReady(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      cleanupGame();
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (isRunning && !gameInstance && gameContainerRef.current) {
      try {
        // Clear any existing canvas
        if (gameContainerRef.current) {
          gameContainerRef.current.innerHTML = '';
        }

        // Enhanced game configuration with better error handling
        const config = {
          ...GAME_CONFIG,
          parent: gameContainerRef.current,
          type: Phaser.AUTO, // Let Phaser decide WebGL vs Canvas
          failIfMajorPerformanceCaveat: false,
          powerPreference: 'low-power',
          callbacks: {
            postBoot: function(game) {
              if (mountedRef.current) {
                setGameReady(true);
              }
            }
          },
          canvas: null, // Let Phaser create its own canvas
          context: null, // Let Phaser create its own context
        };
        
        const game = new Phaser.Game(config);
        
        if (mountedRef.current) {
          setGameInstance(game);
          
          // Setup event listeners with error handling
          const handleScoreUpdate = (newScore) => {
            if (mountedRef.current) {
              setScore(newScore);
            }
          };
          
          const handleLivesUpdate = (newLives) => {
            if (mountedRef.current) {
              setLives(newLives);
            }
          };
          
          const handleLevelUpdate = (newLevel) => {
            if (mountedRef.current) {
              setLevel(newLevel);
            }
          };
          
          game.events.on('score-update', handleScoreUpdate);
          game.events.on('lives-update', handleLivesUpdate);
          game.events.on('level-update', handleLevelUpdate);
        }
      } catch (error) {
        console.error('Error creating Phaser game:', error);
        setGameReady(false);
      }
    } else if (!isRunning && gameInstance && gameReady) {
      // Pause the game scene
      try {
        if (gameInstance.scene && gameInstance.scene.scenes.length > 0) {
          gameInstance.scene.pause('SpaceShooterScene');
        }
      } catch (error) {
        console.warn('Error pausing game:', error);
      }
    } else if (isRunning && gameInstance && gameReady) {
      // Resume the game scene
      try {
        if (gameInstance.scene && gameInstance.scene.scenes.length > 0) {
          gameInstance.scene.resume('SpaceShooterScene');
        }
      } catch (error) {
        console.warn('Error resuming game:', error);
      }
    }
  }, [isRunning, gameInstance, gameReady]);

  const handleReset = () => {
    if (gameInstance && gameReady) {
      try {
        if (gameInstance.scene && gameInstance.scene.scenes.length > 0) {
          gameInstance.scene.restart('SpaceShooterScene');
        }
      } catch (error) {
        console.warn('Error restarting game:', error);
      }
    }
    setScore(0);
    setLives(3);
    setLevel(1);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (gameInstance && gameReady) {
      try {
        if (soundEnabled) {
          gameInstance.sound.mute = true;
        } else {
          gameInstance.sound.mute = false;
        }
      } catch (error) {
        console.warn('Error toggling sound:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Game Stats */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="outline" className="bg-orange-600/20 text-orange-400 border-orange-500/30">
            Puntuación: {score.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-500/30">
            Vidas: {lives}
          </Badge>
          <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/30">
            Nivel: {level}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={toggleSound}
          className="border-white/20 hover:bg-white/10"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Game Canvas Area */}
      <div className="aspect-video bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg relative overflow-hidden border border-white/10">
        <div 
          ref={gameContainerRef}
          className="w-full h-full"
          style={{ display: (isRunning && gameReady) ? 'block' : 'none' }}
        />
        
        {(!isRunning || !gameReady) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-full w-20 h-20 flex items-center justify-center mb-4 animate-pulse">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Space Defender</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Usa las flechas para moverte, espacio para disparar. 
              Derrota enemigos y esquiva asteroides para sobrevivir.
            </p>
            {!gameReady && isRunning && (
              <div className="text-cyan-400 text-sm animate-pulse">
                Cargando juego...
              </div>
            )}
            <div className="flex gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <span className="w-6 h-4 bg-white/20 rounded text-center text-xs">←→</span>
                <span>Mover</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-8 h-4 bg-white/20 rounded text-center text-xs">SPC</span>
                <span>Disparar</span>
              </div>
            </div>
          </div>
        )}

        {/* Game Effects Overlay */}
        {isRunning && gameReady && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Simulated particle effects */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute top-20 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-16 left-12 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="flex justify-center gap-4">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          onClick={onToggle}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pausar Juego
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Iniciar Juego
            </>
          )}
        </Button>
        <Button 
          size="lg"
          variant="outline"
          onClick={handleReset}
          className="border-white/20 hover:bg-white/10"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reiniciar
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-400 space-y-1">
        <p><strong>Objetivo:</strong> Destruye naves enemigas y esquiva asteroides</p>
        <p><strong>Controles:</strong> Flechas para mover • Espacio para disparar • P para pausar</p>
      </div>
    </div>
  );
});

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;