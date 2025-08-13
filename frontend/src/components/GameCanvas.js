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
  const gameContainerRef = useRef(null);

  useEffect(() => {
    if (isRunning && !gameInstance && gameContainerRef.current) {
      // Crear nueva instancia del juego
      const config = {
        ...GAME_CONFIG,
        parent: gameContainerRef.current,
      };
      
      const game = new Phaser.Game(config);
      setGameInstance(game);
      
      // Escuchar eventos del juego
      game.events.on('score-update', (newScore) => {
        setScore(newScore);
      });
      
      game.events.on('lives-update', (newLives) => {
        setLives(newLives);
      });
      
      game.events.on('level-update', (newLevel) => {
        setLevel(newLevel);
      });
    } else if (!isRunning && gameInstance) {
      // Pausar el juego si está corriendo
      gameInstance.scene.pause('SpaceShooterScene');
    } else if (isRunning && gameInstance) {
      // Reanudar el juego
      gameInstance.scene.resume('SpaceShooterScene');
    }
    
    return () => {
      if (gameInstance && !isRunning) {
        // No destruir completamente, solo pausar
      }
    };
  }, [isRunning, gameInstance]);

  const handleReset = () => {
    if (gameInstance) {
      gameInstance.scene.restart('SpaceShooterScene');
    }
    setScore(0);
    setLives(3);
    setLevel(1);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (gameInstance) {
      if (soundEnabled) {
        gameInstance.sound.mute = true;
      } else {
        gameInstance.sound.mute = false;
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
        <canvas 
          ref={ref}
          className="w-full h-full"
          style={{ display: isRunning ? 'block' : 'none' }}
        />
        
        {!isRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-full w-20 h-20 flex items-center justify-center mb-4 animate-pulse">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Space Defender</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Usa las flechas para moverte, espacio para disparar. 
              Derrota enemigos y esquiva asteroides para sobrevivir.
            </p>
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
        {isRunning && (
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