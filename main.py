# main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from jose import JWTError, jwt
import joblib
import pandas as pd
import numpy as np
from pydantic import BaseModel

# Import our MongoDB collections from database.py
from database import user_collection, prediction_collection

# Import auth functions and constants
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ALGORITHM,
)

app = FastAPI()

# Configure CORS (adjust origins as necessary)
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your ML model and CSV data for historical data
try:
    model = joblib.load("model_classifier.pkl")
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

try:
    data = pd.read_csv("engine_data.csv")
except Exception as e:
    raise RuntimeError(f"Failed to load CSV data: {e}")

# ---------------------------
# Pydantic Models
# ---------------------------
class UserCreate(BaseModel):
    username: str
    password: str

class PredictionIn(BaseModel):
    engine_rpm: float
    lub_oil_pressure: float
    fuel_pressure: float
    coolant_pressure: float
    lub_oil_temp: float
    coolant_temp: float
    result: str = None  # Optional, can be set by prediction endpoint
    timestamp: datetime = None  # Optional, default to current time if needed

# ---------------------------
# Authentication Endpoints
# ---------------------------
@app.post("/register")
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = get_password_hash(user.password)
    user_dict = {
        "username": user.username,
        "hashed_password": hashed_pw,
        "created_at": datetime.utcnow(),
    }
    new_user = await user_collection.insert_one(user_dict)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return {"msg": "User registered successfully", "user": {"id": str(created_user["_id"]), "username": created_user["username"]}}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
         status_code=status.HTTP_401_UNAUTHORIZED,
         detail="Could not validate credentials",
         headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
         raise credentials_exception
    user = await user_collection.find_one({"username": username})
    if user is None:
         raise credentials_exception
    return user

# ---------------------------
# Main Application Endpoints (Non-database predictions and CSV historical data)
# ---------------------------
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Engine Health Prediction API! Use /predict for inference or /historical-data for CSV data."}

@app.get("/historical-data")
async def get_historical_data():
    return data.to_dict(orient="records")

@app.post("/predict")
async def predict(features: list[float]):
    if len(features) != 6:
        raise HTTPException(status_code=400, detail="Expected 6 features.")
    try:
        input_features = np.array(features).reshape(1, -1)
        prediction = int(model.predict(input_features)[0])
        prediction_proba = model.predict_proba(input_features)[0].tolist()
        risk_status = "At risk – check maintenance" if prediction == 1 else "Working properly"
        return {
            "predicted_class": prediction,
            "risk_status": risk_status,
            "prediction_proba": prediction_proba,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------
# MongoDB Prediction Endpoints
# ---------------------------

@app.post("/predict")
async def predict(features: list[float]):
    if len(features) != 6:
        raise HTTPException(status_code=400, detail="Expected 6 features.")
    try:
        input_features = np.array(features).reshape(1, -1)
        prediction = int(model.predict(input_features)[0])
        prediction_proba = model.predict_proba(input_features)[0].tolist()
        risk_status = "At risk – check maintenance" if prediction == 1 else "Working properly"
        return {
            "predicted_class": prediction,
            "risk_status": risk_status,
            "prediction_proba": prediction_proba,
        }
    except Exception as e:
        print("Error in /predict:", str(e))
        raise HTTPException(status_code=500, detail=str(e))





from bson import ObjectId

def convert_objectids(data):
    if isinstance(data, list):
        return [convert_objectids(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectids(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

@app.post("/predictions/create")
async def create_prediction(prediction: PredictionIn, current_user: dict = Depends(get_current_user)):
    prediction_dict = prediction.dict()
    prediction_dict["owner"] = current_user["_id"]
    prediction_dict["timestamp"] = datetime.utcnow()
    new_prediction = await prediction_collection.insert_one(prediction_dict)
    created_prediction = await prediction_collection.find_one({"_id": new_prediction.inserted_id})
    # Convert any ObjectId in the returned document to string
    created_prediction = convert_objectids(created_prediction)
    return {"msg": "Prediction saved", "prediction": created_prediction}
