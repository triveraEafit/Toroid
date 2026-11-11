from fastapi import FastAPI

app = FastAPI(
    title="Toroid API",
    description="Backend de Toroid",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Toroid API funcionando"}

@app.get("/health")
def health():
    return {"status": "ok"}