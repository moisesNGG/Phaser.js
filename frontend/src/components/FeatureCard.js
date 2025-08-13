import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const FeatureCard = ({ feature }) => {
  const IconComponent = feature.icon;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          {feature.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">{feature.description}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Ejemplos:</h4>
            <div className="flex flex-wrap gap-1">
              {feature.examples.map((example, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {example}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Dificultad:</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${feature.difficultyColor}`}
                  style={{ width: `${feature.difficultyLevel * 20}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400">{feature.difficultyLevel}/5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;