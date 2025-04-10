from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user  # Now this works since it's defined in auth.py
from database import prediction_collection
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field
from bson import ObjectId

router = APIRouter()

# Pydantic model for a prediction (adjust fields as needed)
class Prediction(BaseModel):
    id: str = Field(alias="_id")
    engine_rpm: float
    lub_oil_pressure: float
    fuel_pressure: float
    coolant_pressure: float
    lub_oil_temp: float
    coolant_temp: float
    result: str
    timestamp: datetime

    class Config:
        validate_by_name = True  # Update this to the new key

@router.get("/history", response_model=List[Prediction])
async def get_history(current_user: dict = Depends(get_current_user)):
    try:
        cursor = prediction_collection.find({"owner": current_user["_id"]}).sort("timestamp", -1)
        predictions = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["timestamp"] = doc["timestamp"].isoformat()  # Convert datetime to ISO 8601 string
            predictions.append(doc)
        return predictions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve history"
        )