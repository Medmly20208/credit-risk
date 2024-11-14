from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

# Load the saved model
model_path = 'model.pkl'  # Use standard single quotes
with open(model_path, 'rb') as f:
    model = pickle.load(f)
origins = [
    "http://localhost:5173",
    "localhost:5173",
    "https://predict-reach-on-time.netlify.app",
    "predict-reach-on-time.netlify.app"
]



# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# Define request body structure using Pydantic
class PredictionRequest(BaseModel):
    # List of features for prediction
    features: list[float]

# Root endpoint to check if the service is running
@app.get("/")
def read_root():
    return {"message": "Model Deployment API is running!"}

# Prediction endpoint
@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        # Convert the input features to a NumPy array for the model
        features = np.array(request.features).reshape(1, -1)
        # Perform prediction using the loaded model
        prediction = model.predict(features)
        # Return the prediction result
        return {"prediction": int(prediction[0])}
    except Exception as e:
        
        raise HTTPException(status_code=400, detail=str(e))
