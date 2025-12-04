from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Importar CORS
import pymongo

mongo = pymongo.MongoClient("mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=rs0")
db = mongo["f1"]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data")
def data():
    
    return [
        {k:v for k,v in doc.items() if k != "_id"}
        for doc in db["tires"].find()
    ]