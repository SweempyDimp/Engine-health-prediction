from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["engine_health_db"]  # Name your database as desired

# Create collections as needed
user_collection = database.get_collection("users")
prediction_collection = database.get_collection("predictions")
