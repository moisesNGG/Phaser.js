import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import Phaser from 'phaser';
import { createDemoConfig } from '../phaser/GameConfig';

const DemoSection = ({ title, description, demos, onPlay, activeDemo, color }) => {
  const [runningDemos, setRunningDemos] = useState({});
  const demoRefs = useRef({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      // Cleanup all running demos
      Object.keys(runningDemos).forEach(demoId => {
        if (runningDemos[demoId] && runningDemos[demoId].game) {
          try {
            runningDemos[demoId].game.destroy(true, false);
          } catch (error) {
            console.warn('Error destroying demo:', error);
          }
        }
      });
    };
  }, []);

  const getColorClasses = (color) => {
    const colors = {
      cyan: {
        gradient: "from-cyan-400 to-blue-400",
        button: "bg-cyan-600 hover:bg-cyan-700",
        border: "border-cyan-500/20",
        badge: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30"
      },
      purple: {
        gradient: "from-purple-400 to-pink-400",
        button: "bg-purple-600 hover:bg-purple-700",
        border: "border-purple-500/20",
        badge: "bg-purple-600/20 text-purple-400 border-purple-500/30"
      },
      pink: {
        gradient: "from-pink-400 to-red-400",
        button: "bg-pink-600 hover:bg-pink-700",
        border: "border-pink-500/20",
        badge: "bg-pink-600/20 text-pink-400 border-pink-500/30"
      }
    };
    return colors[color] || colors.cyan;
  };

  const handleDemoPlay = (demo) => {
    if (!mountedRef.current) return;
    
    const demoId = demo.id;
    const sceneName = getSceneNameFromDemo(demo);
    
    if (runningDemos[demoId]) {
      // Detener demo
      try {
        if (runningDemos[demoId].game) {
          runningDemos[demoId].game.destroy(true, false);
        }
      } catch (error) {
        console.warn('Error stopping demo:', error);
      }
      
      if (mountedRef.current) {
        setRunningDemos(prev => {
          const newState = { ...prev };
          delete newState[demoId];
          return newState;
        });
      }
    } else {
      // Iniciar demo
      const containerElement = demoRefs.current[demoId];
      if (containerElement && sceneName && mountedRef.current) {
        try {
          // Clear container
          containerElement.innerHTML = '';
          
          const config = createDemoConfig(sceneName, null);
          if (config) {
            config.parent = containerElement;
            config.width = Math.min(containerElement.clientWidth, 400);
            config.height = Math.min(containerElement.clientHeight, 300);
            
            // Enhanced error handling
            config.callbacks = {
              ...config.callbacks,
              postBoot: function(game) {
                console.log(`Demo ${demoId} loaded successfully`);
              }
            };
            
            const game = new Phaser.Game(config);
            
            if (mountedRef.current) {
              setRunningDemos(prev => ({
                ...prev,
                [demoId]: { game, sceneName }
              }));
            }
          }
        } catch (error) {
          console.error(`Error starting demo ${demoId}:`, error);
        }
      }
    }
    
    if (onPlay && mountedRef.current) {
      onPlay(demoId);
    }
  };

  const handleDemoReset = (demo) => {
    if (!mountedRef.current) return;
    
    const demoId = demo.id;
    if (runningDemos[demoId] && runningDemos[demoId].game) {
      try {
        const sceneName = runningDemos[demoId].sceneName;
        if (runningDemos[demoId].game.scene) {
          runningDemos[demoId].game.scene.restart(sceneName);
        }
      } catch (error) {
        console.warn('Error resetting demo:', error);
      }
    }
  };

  const getSceneNameFromDemo = (demo) => {
    // Mapear IDs de demo a nombres de escena
    const sceneMapping = {
      'sprite-basic': 'BasicSpritesScene',
      'movement-basic': 'BasicMovementScene', 
      'input-handling': 'InputHandlingScene',
      'animations': 'AnimationScene',
      'collisions': 'CollisionScene',
      'audio-system': 'AudioScene',
      'particle-system': 'ParticleScene',
      'advanced-physics': 'AdvancedPhysicsScene',
      'lighting-effects': 'LightingScene'
    };
    
    return sceneMapping[demo.id] || null;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${colorClasses.gradient} bg-clip-text text-transparent`}>
          {title}
        </h2>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo, index) => (
          <Card key={index} className={`bg-black/40 backdrop-blur-sm ${colorClasses.border} hover:bg-black/50 transition-all duration-300`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{demo.title}</span>
                <Badge variant="outline" className={colorClasses.badge}>
                  {demo.difficulty}
                </Badge>
              </CardTitle>
              <CardDescription>{demo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black/60 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <div 
                  ref={el => demoRefs.current[demo.id] = el}
                  className="w-full h-full"
                  style={{ display: runningDemos[demo.id] ? 'block' : 'none' }}
                />
                
                {!runningDemos[demo.id] && (
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses.gradient} rounded-full flex items-center justify-center mb-2 mx-auto opacity-60`}>
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <span className="text-gray-400 text-sm">{demo.preview}</span>
                  </div>
                )}
                
                {runningDemos[demo.id] && (
                  <button
                    onClick={() => handleDemoPlay(demo)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2 mb-4">
                {demo.technologies.map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className={colorClasses.button}
                  onClick={() => handleDemoPlay(demo)}
                >
                  {runningDemos[demo.id] ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Detener
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ejecutar
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => handleDemoReset(demo)}
                  disabled={!runningDemos[demo.id]}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DemoSection;