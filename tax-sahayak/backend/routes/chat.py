from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini_service import generate_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint that calls the Groq AI service to generate a response.
    """
    ai_response = await generate_response(request.message)
    
    return {
        "response": ai_response,
        "status": "success"
    }
