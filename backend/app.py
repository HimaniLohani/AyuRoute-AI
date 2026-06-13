from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AyuRoute AI Triage Engine")

# User input structure define karne ke liye
class SymptomInput(BaseModel):
    symptoms: str

@app.post("/triage")
async def advanced_triage(data: SymptomInput):
    user_text = data.symptoms.lower()
    
    # 1. Severe Keywords Check
    severe_keywords = ["chest pain", "breathing difficulty", "stroke", "paralysis", "heavy bleeding", "heart attack"]
    # 2. Moderate Keywords Check
    moderate_keywords = ["fever", "vomiting", "severe pain", "infection", "fracture", "stomach ache"]
    
    # Simple, fast and zero-error processing logic
    if any(keyword in user_text for keyword in severe_keywords):
        return {
            "status": "success",
            "severity": "Severe",
            "ai_confidence": "High (Critical Keyword Match)",
            "action_taken": "One-tap ambulance dispatch + nearest ER alert"
        }
        
    elif any(keyword in user_text for keyword in moderate_keywords):
        return {
            "status": "success",
            "severity": "Moderate",
            "ai_confidence": "High (Specialist Needed)",
            "action_taken": "Ranked specialist list (rating + distance) + instant booking"
        }
    
    # Default Fallback (Mild)
    return {
        "status": "success",
        "severity": "Mild",
        "ai_confidence": "Baseline Classification",
        "action_taken": "OTC medicine suggestions + personalized diet/recovery plan"
    }