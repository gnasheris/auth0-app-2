# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import projects, datasets, patients

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api")
app.include_router(datasets.router, prefix="/api")
app.include_router(patients.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}