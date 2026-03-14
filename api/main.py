"""FacePay FastAPI backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.face import router as face_router
from routes.payment import router as payment_router
from routes.webhook import router as webhook_router

app = FastAPI(
    title="FacePay API",
    description="Face recognition payment platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "exp://localhost:8081",
        "exp://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(face_router)
app.include_router(payment_router)
app.include_router(webhook_router)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
