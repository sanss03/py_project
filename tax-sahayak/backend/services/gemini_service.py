import os
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

SYSTEM_PROMPT = (
    "You are 'Tax Sahayak', an intelligent financial assistant. "
    "Your expertise is in Indian Income Tax, Loans, EMI calculations, and general personal finance. "
    "Keep responses short, clear, and helpful. "
    "For complex tax matters, advise consulting a Chartered Accountant. "
    "Be polite and professional. Use simple language."
)

# Fallback responses when quota is exhausted
FALLBACK_RESPONSES = {
    "emi": "EMI = (P × R × (1+R)^N) / ((1+R)^N - 1). Use the EMI Calculator on the right to compute it instantly!",
    "tax": "Your income tax depends on your slab. Use the Tax Calculator on the right — enter your income and tax rate to get your liability!",
    "loan": "For loans, the key factors are: Principal amount, Interest Rate, and Tenure. Try the EMI Calculator to plan your repayment!",
    "section 80c": "Section 80C allows up to ₹1.5 lakh deduction on PPF, ELSS, LIC, NSC, and home loan principal.",
    "hra": "HRA exemption = min of (actual HRA received, 50%/40% of basic salary, rent paid minus 10% of basic salary).",
    "itr": "To file ITR: collect Form 16, log in to incometax.gov.in, choose the correct ITR form, fill details and submit by July 31.",
    "hello": "Hello! I'm Tax Sahayak. Ask me about EMI, income tax, loans, or deductions!",
    "hi": "Hi there! How can I help with your finances today?",
}

def get_fallback(message: str) -> str:
    lower = message.lower()
    for key, response in FALLBACK_RESPONSES.items():
        if key in lower:
            return response
    return (
        "⚠️ AI quota limit reached for now. "
        "Meanwhile: For EMI queries, use the calculator on the right. "
        "For tax queries, visit incometax.gov.in or consult a CA. "
        "Try again in a few minutes!"
    )

# Initialize Gemini client
client = None
if GEMINI_API_KEY and "your_gemini_api_key" not in GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

# Try multiple models in order of free-tier availability
MODELS_TO_TRY = [
    "gemini-2.0-flash-lite",   # Higher free-tier quota
    "gemini-1.5-flash-8b",     # Largest free-tier limits
    "gemini-2.0-flash",        # Standard model
]

async def generate_response(message: str) -> str:
    if not client:
        return "AI not configured. Please set GEMINI_API_KEY in your backend .env file."

    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    max_output_tokens=400,
                    temperature=0.7,
                ),
            )
            return response.text
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                # Try next model
                await asyncio.sleep(1)
                continue
            elif "404" in error_str or "NOT_FOUND" in error_str:
                # Model not available, try next
                continue
            else:
                return f"Error: {error_str}"

    # All models exhausted — return smart fallback
    return get_fallback(message)
