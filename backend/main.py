from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import audit, packet

app = FastAPI(title="DeathLedger API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/api/v1")
app.include_router(packet.router, prefix="/api/v1")
