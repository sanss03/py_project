from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, calculator

app = FastAPI(title="Tax Sahayak API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(calculator.router, prefix="/api/calculator", tags=["Calculator"])

@app.get("/")
async def root():
    return {"message": "Welcome to Tax Sahayak API"}
