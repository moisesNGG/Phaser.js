from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Demo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    level: str  # "basic", "intermediate", "advanced"
    code_example: str
    technologies: List[str]
    difficulty: str
    preview: str
    scene_name: str  # Nombre de la escena de Phaser.js

class DemoCreate(BaseModel):
    title: str
    description: str
    level: str
    code_example: str
    technologies: List[str]
    difficulty: str
    preview: str
    scene_name: str

class Score(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    score: int
    level: int
    lives_remaining: int
    time_played: int  # en segundos
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ScoreCreate(BaseModel):
    player_name: str
    score: int
    level: int
    lives_remaining: int
    time_played: int

class LeaderboardEntry(BaseModel):
    rank: int
    player_name: str
    score: int
    level: int
    timestamp: datetime

class GameStats(BaseModel):
    total_games: int
    average_score: float
    highest_score: int
    most_played_level: int