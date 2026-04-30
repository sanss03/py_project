from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TaxInput(BaseModel):
    income: float
    tax_percentage: float = 10.0

class EMIInput(BaseModel):
    principal: float
    rate: float
    months: int

@router.post("/tax")
async def calculate_tax(data: TaxInput):
    """
    Simple tax calculation based on income and a flat percentage.
    """
    tax = (data.income * data.tax_percentage) / 100
    net_income = data.income - tax
    
    return {
        "total_tax": round(tax, 2),
        "net_income": round(net_income, 2),
        "currency": "INR"
    }

@router.post("/emi")
async def calculate_emi(data: EMIInput):
    """
    Standard EMI calculation using the formula:
    EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
    """
    P = data.principal
    R = (data.rate / 12) / 100  # Monthly interest rate
    N = data.months
    
    if R == 0:
        emi = P / N
    else:
        emi = (P * R * pow(1 + R, N)) / (pow(1 + R, N) - 1)
        
    total_payment = emi * N
    total_interest = total_payment - P
    
    return {
        "monthly_emi": round(emi, 2),
        "total_interest": round(total_interest, 2),
        "total_payment": round(total_payment, 2),
        "currency": "INR"
    }
