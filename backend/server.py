from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import routes
from routes import router as api_routes

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Set database for routes module
routes.set_database(db)

# Create the main app without a prefix
app = FastAPI(title="Phaser.js Demo API", description="Backend API for Phaser.js demonstration")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Phaser.js Demo API is running!", "version": "1.0.0"}

# Include all the demo and score routes
api_router.include_router(api_routes)

# Include the router in the main app
app.include_router(api_router)

# Serve static files (game assets)
app.mount("/static", StaticFiles(directory=str(ROOT_DIR.parent / "frontend" / "public")), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Phaser.js Demo API server...")
    logger.info(f"Connected to MongoDB: {mongo_url}")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down Phaser.js Demo API server...")
    client.close()