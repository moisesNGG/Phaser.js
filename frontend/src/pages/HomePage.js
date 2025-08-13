import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Play, Pause, RotateCcw, Gamepad2, Zap, Sparkles, Rocket } from "lucide-react";
import { mockData } from "../data/mock";
import GameCanvas from "../components/GameCanvas";
import DemoSection from "../components/DemoSection";
import FeatureCard from "../components/FeatureCard";

const HomePage = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("basico");
  const [completedSections, setCompletedSections] = useState({
    basico: false,
    intermedio: false,
    avanzado: false,
    juego: false
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    // Calcular progreso basado en secciones completadas
    const completed = Object.values(completedSections).filter(Boolean).length;
    setProgress((completed / 4) * 100);
  }, [completedSections]);

  const handleDemoPlay = (demoId) => {
    setActiveDemo(demoId);
    // El componente DemoSection maneja la ejecución real
  };

  const handleGameToggle = () => {
    setGameRunning(!gameRunning);
    if (!gameRunning) {
      setCompletedSections(prev => ({ ...prev, juego: true }));
    }
  };

  const markSectionCompleted = (section) => {
    setCompletedSections(prev => ({ ...prev, [section]: true }));
  };

  const handleStartDemo = () => {
    setActiveTab("basico");
    // Scroll to demo section
    document.querySelector('[data-state="active"]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewFinalGame = () => {
    setActiveTab("juego");
    // Scroll to game section
    document.querySelector('[data-state="active"]')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium">Phaser.js Demo Showcase</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Explorando Phaser.js
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Una demostración completa de las capacidades de Phaser.js, desde conceptos básicos 
            hasta implementaciones avanzadas, culminando en un juego espacial interactivo.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Play className="w-5 h-5 mr-2" />
              Comenzar Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
              <Rocket className="w-5 h-5 mr-2" />
              Ver Juego Final
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progreso de la demostración</span>
            <span className="text-cyan-400">
              {Object.values(completedSections).filter(Boolean).length} de 4 secciones completadas
            </span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>
      </div>

      {/* Demo Sections */}
      <div className="container mx-auto px-6 py-16">
        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="basico" className="data-[state=active]:bg-cyan-600">
              Básico
            </TabsTrigger>
            <TabsTrigger value="intermedio" className="data-[state=active]:bg-purple-600">
              Intermedio
            </TabsTrigger>
            <TabsTrigger value="avanzado" className="data-[state=active]:bg-pink-600">
              Avanzado
            </TabsTrigger>
            <TabsTrigger value="juego" className="data-[state=active]:bg-orange-600">
              Juego Final
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="mt-8">
            <DemoSection 
              title="Conceptos Básicos"
              description="Fundamentos de Phaser.js: sprites, movimiento y entrada del usuario"
              demos={mockData.basicDemos}
              onPlay={handleDemoPlay}
              activeDemo={activeDemo}
              color="cyan"
              onComplete={() => markSectionCompleted('basico')}
            />
          </TabsContent>

          <TabsContent value="intermedio" className="mt-8">
            <DemoSection 
              title="Características Intermedias"
              description="Animaciones, colisiones, sonido y efectos visuales"
              demos={mockData.intermediateDemos}
              onPlay={handleDemoPlay}
              activeDemo={activeDemo}
              color="purple"
              onComplete={() => markSectionCompleted('intermedio')}
            />
          </TabsContent>

          <TabsContent value="avanzado" className="mt-8">
            <DemoSection 
              title="Funcionalidades Avanzadas"
              description="Sistemas de partículas, físicas avanzadas y post-procesamiento"
              demos={mockData.advancedDemos}
              onPlay={handleDemoPlay}
              activeDemo={activeDemo}
              color="pink"
              onComplete={() => markSectionCompleted('avanzado')}
            />
          </TabsContent>

          <TabsContent value="juego" className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Space Shooter - Juego Final
              </h2>
              <p className="text-gray-400 mb-6">
                Un juego completo que integra todas las características demostradas
              </p>
            </div>

            <Card className="bg-black/40 backdrop-blur-sm border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Rocket className="w-6 h-6" />
                  Space Defender
                </CardTitle>
                <CardDescription>
                  Controla tu nave espacial, esquiva asteroides y derrota enemigos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameCanvas 
                  ref={canvasRef}
                  isRunning={gameRunning}
                  onToggle={handleGameToggle}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Overview */}
      <div className="bg-black/20 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Características de Phaser.js Demostradas
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {mockData.features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Demostración creada con Phaser.js {mockData.phaserVersion} • 
            <span className="text-cyan-400 ml-2">Presentación Técnica 2025</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;