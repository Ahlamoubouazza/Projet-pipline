from fastapi import FastAPI, File, UploadFile, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import shutil
import os
from pipeline import run_pipeline_step, predict_from_value

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

data_cache = {}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    data_cache["file_path"] = filepath
    return {"message": "Fichier uploadé avec succès", "filename": file.filename}

@app.get("/run_pipeline")
async def run_pipeline(step: str = Query(..., enum=["ingest", "clean", "aggregate", "plot"])):
    if "file_path" not in data_cache:
        return JSONResponse(status_code=400, content={"error": "Aucun fichier uploadé. Veuillez d'abord uploader un fichier."})
    
    result = run_pipeline_step(step, data_cache["file_path"], data_cache)
    
    if step == "plot":
        plot_path = os.path.join(OUTPUT_DIR, "plot.png")
        return FileResponse(plot_path)
    
    return result

@app.post("/predict_house_price")
def predict_house_price(payload: dict = Body(...)):
    if "df" not in data_cache:
        return JSONResponse(status_code=400, content={"error": "Données non chargées. Lancez l'upload et le traitement d'abord."})

    result = predict_from_value("house_features", payload, data_cache)
    return result